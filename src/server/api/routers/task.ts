import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TaskType } from "~/types/task";

export const taskRouter = createTRPCRouter({
  getDailyTasks: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.task.findMany({
      orderBy: { name: "desc" },
      where: {
        userId: ctx.session.user.id,
        createdAt: new Date(), // Get tasks made today's
        type: {
          in: [TaskType.generated, TaskType.generatedFriend],
        },
      },
    });
    return post ?? null;
  }),

  getCustomTasks: protectedProcedure.query(async ({ ctx }) => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const post = await ctx.db.task.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        userId: ctx.session.user.id,
        createdAt: { gte: oneWeekAgo },
        type: {
          in: [TaskType.custom, TaskType.customFriend],
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
          type: TaskType.custom,
          name: input.name,
          icon: input.icon,
          interestIds: input.interestIds,
          description: input.description,
          userId: ctx.session.user.id,
        },
      });
    }),

  createCustomFriendTask: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        icon: z.string().min(1),
        friends: z.array(z.string().min(1)),
        interestIds: z.array(z.number().min(1)),
        description: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({
        data: {
          type: TaskType.customFriend,
          name: input.name,
          icon: input.icon,
          interestIds: input.interestIds,
          userId: ctx.session.user.id,
          description: input.description,
          friends: {
            connect: input.friends.map((friendId) => ({ id: friendId })),
          },
        },
      });
    }),
});
