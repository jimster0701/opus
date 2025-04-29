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
            select: { id: true, displayName: true, name: true, image: true },
          },
        },
      });
    }),

  likeReply: protectedProcedure
    .input(z.object({ replyId: z.number(), userId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const reply = await ctx.db.reply.findUnique({
        where: { id: input.replyId },
        select: { likedBy: true },
      });
      if (reply?.likedBy.includes(input.userId))
        throw new Error("Reply already liked");
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
        select: { likedBy: true },
      });
      if (!reply) throw new Error("Reply not found");

      const updatedLikedBy = reply.likedBy.filter((id) => id !== input.userId);

      return ctx.db.reply.update({
        where: { id: input.replyId },
        data: { likedBy: updatedLikedBy },
      });
    }),
});
