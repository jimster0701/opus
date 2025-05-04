import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const commentRouter = createTRPCRouter({
  createComment: protectedProcedure
    .input(
      z.object({
        message: z.string().min(1),
        postId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comment.create({
        data: {
          message: input.message,
          postId: input.postId,
          createdById: ctx.session.user.id,
        },
        include: {
          createdBy: {
            select: { id: true, displayName: true, image: true },
          },
          replies: { include: { createdBy: true } },
        },
      });
    }),

  likeComment: protectedProcedure
    .input(z.object({ commentId: z.number(), userId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.db.comment.findUnique({
        where: { id: input.commentId },
        select: { likedBy: true },
      });
      if (comment?.likedBy.includes(input.userId))
        throw new Error("Comment already liked");
      return ctx.db.comment.update({
        where: { id: input.commentId },
        data: {
          likedBy: { push: input.userId },
        },
      });
    }),

  unlikeComment: protectedProcedure
    .input(z.object({ commentId: z.number(), userId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.db.comment.findUnique({
        where: { id: input.commentId },
        select: { likedBy: true },
      });
      if (!comment) throw new Error("Comment not found");

      const updatedLikedBy = comment.likedBy.filter(
        (id) => id !== input.userId
      );

      return ctx.db.comment.update({
        where: { id: input.commentId },
        data: { likedBy: updatedLikedBy },
      });
    }),

  deleteComment: protectedProcedure
    .input(z.object({ id: z.number().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (prisma) => {
        await prisma.reply.deleteMany({
          where: { commentId: input.id },
        });

        return ctx.db.comment.delete({
          where: { id: input.id },
        });
      });
    }),
});
