import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TaskType } from "@prisma/client";

export const taskRouter = createTRPCRouter({
  getDailyTasks: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.task.findMany({
      orderBy: { name: "desc" },
      where: {
        userId: ctx.session.user.id,
        createdAt: new Date(), // Get tasks made today's
        type: {
          in: [TaskType.GENERATED, TaskType.GENERATED_FRIEND],
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
          in: [TaskType.CUSTOM, TaskType.CUSTOM_FRIEND],
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
          type: TaskType.CUSTOM_FRIEND,
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

  addFriends: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1),
        name: z.string().min(1),
        icon: z.string().min(1),
        interestIds: z.array(z.number().min(1)),
        description: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.update({
        where: { id: input.id },
        data: {},
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
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.update({
        where: { id: input.id },
        data: {
          name: input.name,
          icon: input.icon,
          interestIds: input.interestIds,
          description: input.description,
        },
      });
    }),

  deleteTask: protectedProcedure
    .input(z.object({ id: z.number().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.delete({
        where: { id: input.id },
      });
    }),
});
