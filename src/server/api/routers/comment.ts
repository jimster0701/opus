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
            select: { id: true, displayName: true, name: true, image: true },
          },
          replies: { include: { createdBy: true } },
        },
      });
    }),
});
