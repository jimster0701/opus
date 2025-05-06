import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const notificationRouter = createTRPCRouter({
  getNotifications: protectedProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.notification.findMany({
        where: { toUserId: input.userId },
        orderBy: { createdAt: "desc" },
        include: {
          fromUser: {
            select: {
              id: true,
              displayName: true,
              image: true,
            },
          },
          toUser: {
            select: {
              id: true,
              displayName: true,
              image: true,
            },
          },
        },
      });
    }),

  createInterestNotification: protectedProcedure
    .input(
      z.object({ userId: z.string().min(1), interestId: z.number().min(1) })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.notification.create({
        data: {
          type: "TAKE_INTEREST",
          fromUserId: ctx.session.userId,
          toUserId: input.userId,
          interestId: input.interestId,
        },
      });
    }),

  markNotificationsAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.db.notification.updateMany({
      where: {
        toUserId: ctx.session.userId,
        read: false,
      },
      data: {
        read: true,
      },
    });
  }),
});
