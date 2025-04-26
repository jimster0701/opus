import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const commentRouter = createTRPCRouter({
  getAllPostComments: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const comments = await ctx.db.comment.findMany({
        orderBy: { createdAt: "desc" },
        where: { postId: input.postId },
        include: { createdBy: true },
      });

      return comments ?? null;
    }),

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
          createdBy: true,
        },
      });
    }),
});
