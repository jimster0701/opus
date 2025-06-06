import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const replyRouter = createTRPCRouter({
  createReply: protectedProcedure
    .input(
      z.object({
        message: z.string().min(1),
        commentId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.reply.create({
        data: {
          message: input.message,
          commentId: input.commentId,
          createdById: ctx.session.user.id,
        },
        include: {
          createdBy: {
            select: { id: true, displayName: true, image: true },
          },
        },
      });
    }),

  likeReply: protectedProcedure
    .input(z.object({ replyId: z.number(), userId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const reply = await ctx.db.reply.findUnique({
        where: { id: input.replyId },
        select: { likedBy: true, createdById: true },
      });
      if (reply?.likedBy.includes(input.userId))
        throw new Error("Reply already liked");
      if (reply)
        await ctx.db.notification.create({
          data: {
            type: "LIKE_REPLY",
            fromUserId: ctx.session.user.id,
            toUserId: reply.createdById,
            replyId: input.replyId,
          },
        });

      return ctx.db.reply.update({
        where: { id: input.replyId },
        data: {
          likedBy: { push: input.userId },
        },
      });
    }),

  unlikeReply: protectedProcedure
    .input(z.object({ replyId: z.number(), userId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const reply = await ctx.db.reply.findUnique({
        where: { id: input.replyId },
        select: { likedBy: true, createdById: true },
      });
      if (!reply) throw new Error("Reply not found");

      const updatedLikedBy = reply.likedBy.filter((id) => id !== input.userId);

      const notification = await ctx.db.notification.findFirst({
        where: {
          type: "LIKE_REPLY",
          fromUserId: ctx.session.user.id,
          toUserId: reply.createdById,
          postId: input.replyId,
        },
      });

      await ctx.db.notification.delete({
        where: {
          id: notification?.id,
        },
      });

      return ctx.db.reply.update({
        where: { id: input.replyId },
        data: { likedBy: updatedLikedBy },
      });
    }),

  deleteReply: protectedProcedure
    .input(z.object({ id: z.number().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.reply.delete({
        where: { id: input.id },
      });
    }),
});
