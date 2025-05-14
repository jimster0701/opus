import { z } from "zod";
import { OpenAI } from "openai";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TaskType, type UserInterest } from "@prisma/client";
import { type Interest } from "~/types/interest";

export const TaskSchema = z.object({
  name: z.string(),
  icon: z.string().emoji("Icon must be a single emoji").max(10),
  interests: z.array(z.number()),
  description: z.string(),
});

function roundRobinSplit<T>(arr: T[], batchCount: number): T[][] {
  const batches: T[][] = Array.from({ length: batchCount }, () => []);
  arr.forEach((item, index) => {
    const batchIndex = index % batchCount;
    if (batches[batchIndex]) batches[batchIndex].push(item);
  });
  return batches;
}

const generateTask = async (batch: Interest[], systemPrompt: string) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const userPrompt = `Please generate one task for me based on one or more of my interests:\n${batch
    .map((i) => `id: ${i.id}, name: ${i.name}`)
    .join("\n")}\n`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 1,
  });

  return response.choices[0]?.message?.content;
};

const generateFriendsTask = async (
  interests: { name: string; id: number }[],
  systemPrompt: string
) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const userPrompt = `Please generate one task for me and my friend based on our interests:\n${interests
    .map((i) => `id: ${i.id}, name: ${i.name}`)
    .join("\n")}\n`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 1,
  });

  return response.choices[0]?.message?.content;
};

async function generateDailyTasks(ctx: any) {
  const user = await ctx.db.user.findUnique({
    where: {
      id: ctx.session.userId,
    },
    select: {
      interests: true,
    },
  });
  const userInterests = await ctx.db.interest.findMany({
    where: {
      id: { in: user?.interests.map((i: UserInterest) => i.interestId) ?? [] },
    },
    include: {
      createdBy: { select: { id: true, displayName: true, image: true } },
    },
  });
  if (userInterests.length === 0) return [];

  const shuffledInterests = userInterests.sort(() => 0.5 - Math.random());

  const batches: Interest[][] = roundRobinSplit(
    shuffledInterests.length == 10
      ? shuffledInterests.slice(0, 9)
      : shuffledInterests,
    3
  );

  const systemPrompt = `
          You are a creative assistant assigned to generate tasks for users based on their interests. 
          The tasks should be interesting, fun, achievable in a day, and varied.
          You can reach into sub catagories of interests to add depth to tasks.
          {
            "name": "the task's title",
            "icon": "a single emoji to represent the task",
            "interests": [id, ...],
            "description": "Simple sentence about the task, try to balance for different skill levels"
          }
        `;

  const tasks = await Promise.all(
    batches.map(async (batch: Interest[]) => {
      const content = await generateTask(batch, systemPrompt);
      if (!content) return;

      const cleaned = content.replace(/```(?:json)?/gi, "").trim();

      const taskData = TaskSchema.parse(JSON.parse(cleaned));
      return await ctx.db.task.create({
        data: {
          type: TaskType.GENERATED,
          name: taskData.name,
          icon: taskData.icon,
          description: taskData.description,
          createdById: ctx.session.userId,
          interests: {
            create: taskData.interests.map((interestId) => ({
              interest: {
                connect: { id: interestId },
              },
            })),
          },
        },
        include: {
          friends: {
            include: {
              user: {
                select: {
                  id: true,
                  displayName: true,
                  image: true,
                },
              },
            },
          },
          interests: {
            include: {
              interest: {
                select: {
                  id: true,
                  name: true,
                  icon: true,
                  colour: true,
                  private: true,
                  createdById: true,
                  createdBy: true,
                  users: true,
                },
              },
              task: {
                select: {
                  id: true,
                  type: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    })
  );
  return tasks;
}

async function generateCollabrativeTasks(
  ctx: any,
  interests: { name: string; id: number }[],
  friendIds: string[]
) {
  const systemPrompt = `
          You are a creative assistant assigned to generate collabrative tasks that users can do together based one interest of each.
          The tasks should be interesting, fun, achievable in a day, and varied.
          {
            "name": "the task's title",
            "icon": "a single emoji to represent the task",
            "interests": [id, ...],
            "description": "Simple sentence about the task, try to balance for different skill levels"
          }
        `;

  const content = await generateFriendsTask(interests, systemPrompt);
  if (!content) return;

  const cleaned = content.replace(/```(?:json)?/gi, "").trim();

  const taskData = TaskSchema.parse(JSON.parse(cleaned));
  return await ctx.db.task.create({
    data: {
      type: TaskType.GENERATED_FRIEND,
      name: taskData.name,
      icon: taskData.icon,
      description: taskData.description,
      createdById: "system",
      friends: {
        create: friendIds.map((id) => ({
          user: { connect: { id: id } },
        })),
      },
      interests: {
        create: taskData.interests.map((interestId) => ({
          interest: {
            connect: { id: interestId },
          },
        })),
      },
    },
    include: {
      friends: {
        include: {
          user: {
            select: {
              id: true,
              displayName: true,
              image: true,
            },
          },
        },
      },
      interests: {
        include: {
          interest: {
            select: {
              id: true,
              name: true,
              icon: true,
              colour: true,
              private: true,
              createdById: true,
              createdBy: true,
              users: true,
            },
          },
          task: {
            select: {
              id: true,
              type: true,
              name: true,
            },
          },
        },
      },
    },
  });
}

export const taskRouter = createTRPCRouter({
  getFriendsOnTask: protectedProcedure
    .input(
      z.object({
        userIds: z.array(z.string()),
      })
    )
    .query(async ({ ctx, input }) => {
      const users = await ctx.db.user.findMany({
        where: { id: { in: input.userIds } },
        select: { id: true, displayName: true, name: true, image: true },
      });
      return users;
    }),

  getDailyTasks: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);
      const tasks = await ctx.db.task.findMany({
        orderBy: { name: "desc" },
        where: {
          createdAt: { gte: startOfToday, lte: endOfToday }, // Get tasks made today
          type: {
            in: [TaskType.GENERATED],
          },
          OR: [
            { createdById: input.userId },
            {
              friends: {
                some: {
                  userId: input.userId,
                },
              },
            },
          ],
        },
        include: {
          friends: {
            include: {
              user: {
                select: {
                  id: true,
                  displayName: true,
                  image: true,
                },
              },
            },
          },
          interests: {
            include: {
              interest: {
                select: {
                  id: true,
                  name: true,
                  icon: true,
                  colour: true,
                  private: true,
                  createdById: true,
                  createdBy: true,
                  users: true,
                },
              },
              task: {
                select: {
                  id: true,
                  type: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (input.userId == ctx.session.userId && tasks.length == 0)
        return await generateDailyTasks(ctx);
      else return tasks ?? null;
    }),

  getCustomTasks: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const tasks = await ctx.db.task.findMany({
        orderBy: { updatedAt: "desc" },
        where: {
          updatedAt: { gte: oneWeekAgo },
          type: {
            in: [
              TaskType.CUSTOM,
              TaskType.CUSTOM_FRIEND,
              TaskType.GENERATED_FRIEND,
            ],
          },
          OR: [
            { createdById: input.userId },
            {
              friends: {
                some: {
                  userId: input.userId,
                },
              },
            },
          ],
        },
        include: {
          friends: {
            include: {
              user: {
                select: {
                  id: true,
                  displayName: true,
                  image: true,
                },
              },
            },
          },
          interests: {
            include: {
              interest: {
                select: {
                  id: true,
                  name: true,
                  icon: true,
                  colour: true,
                  private: true,
                  createdById: true,
                  createdBy: true,
                  users: true,
                },
              },
              task: {
                select: {
                  id: true,
                  type: true,
                  name: true,
                },
              },
            },
          },
        },
      });
      return tasks ?? null;
    }),

  createCustomTask: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        icon: z.string().min(1),
        interestIds: z.array(z.number().min(1)),
        description: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({
        data: {
          type: TaskType.CUSTOM,
          name: input.name,
          icon: input.icon,
          description: input.description,
          createdById: ctx.session.user.id,
          interests: {
            create: input.interestIds.map((interestId) => ({
              interest: {
                connect: { id: interestId },
              },
            })),
          },
        },
      });
    }),

  createCustomFriendTask: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        icon: z.string().min(1),
        friends: z.array(z.string().cuid()),
        interestIds: z.array(z.number().min(1)),
        description: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({
        data: {
          type: TaskType.CUSTOM_FRIEND,
          name: input.name,
          icon: input.icon,
          createdById: ctx.session.user.id,
          description: input.description,
          friends: {
            create: input.friends.map((friendId) => ({
              user: { connect: { id: friendId } },
            })),
          },
          interests: {
            create: input.interestIds.map((id) => ({
              interest: { connect: { id } },
            })),
          },
        },
      });
    }),

  generateFriendTask: protectedProcedure
    .input(
      z.object({
        friendIds: z.array(z.string().cuid()),
        interests: z.array(
          z.object({ id: z.number().min(1), name: z.string().min(1) })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await generateCollabrativeTasks(
        ctx,
        input.interests,
        input.friendIds
      );
    }),

  updateTask: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1),
        name: z.string().min(1),
        icon: z.string().min(1),
        interestIds: z.array(z.number().min(1)),
        description: z.string().min(1),
        friends: z.array(z.string().cuid()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (prisma) => {
        await prisma.task.update({
          where: { id: input.id },
          data: {
            name: input.name,
            icon: input.icon,
            description: input.description,
          },
        });

        // Update friends if provided
        if (input.friends) {
          await prisma.userTask.deleteMany({ where: { taskId: input.id } });
          await prisma.userTask.createMany({
            data: input.friends.map((friendId) => ({
              userId: friendId,
              taskId: input.id,
            })),
          });
        }

        // Update interests
        await prisma.taskInterest.deleteMany({ where: { taskId: input.id } });
        await prisma.taskInterest.createMany({
          data: input.interestIds.map((interestId) => ({
            taskId: input.id,
            interestId,
          })),
        });

        const updatedTask = await prisma.task.findUnique({
          where: { id: input.id },
          include: {
            interests: {
              include: {
                interest: {
                  select: {
                    id: true,
                    name: true,
                    icon: true,
                    colour: true,
                    private: true,
                    createdById: true,
                    createdBy: true,
                  },
                },
                task: {
                  select: {
                    id: true,
                    type: true,
                    name: true,
                  },
                },
              },
            },
            friends: true,
          },
        });

        return updatedTask;
      });
    }),

  completeTask: protectedProcedure
    .input(z.object({ id: z.number().min(1), value: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (prisma) => {
        return prisma.task.update({
          where: { id: input.id },
          data: {
            completed: input.value,
          },
        });
      });
    }),

  deleteTask: protectedProcedure
    .input(z.object({ id: z.number().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (prisma) => {
        await prisma.userTask.deleteMany({ where: { taskId: input.id } });
        await prisma.taskInterest.deleteMany({ where: { taskId: input.id } });
        await prisma.post.deleteMany({ where: { taskId: input.id } });

        return prisma.task.delete({
          where: { id: input.id },
        });
      });
    }),
});
