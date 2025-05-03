import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TaskType } from "@prisma/client";

export const taskRouter = createTRPCRouter({
  getDailyTasks: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.task.findMany({
      orderBy: { name: "desc" },
      where: {
        createdById: ctx.session.user.id,
        createdAt: new Date(), // Get tasks made today's
        type: {
          in: [TaskType.GENERATED, TaskType.GENERATED_FRIEND],
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
    return post ?? null;
  }),

  getCustomTasks: protectedProcedure.query(async ({ ctx }) => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const post = await ctx.db.task.findMany({
      orderBy: { updatedAt: "desc" },
      where: {
        createdById: ctx.session.user.id,
        updatedAt: { gte: oneWeekAgo },
        type: {
          in: [TaskType.CUSTOM, TaskType.CUSTOM_FRIEND],
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
    return post ?? null;
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
          },
        });

        return updatedTask;
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
