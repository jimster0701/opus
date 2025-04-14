import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        imageId: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          name: input.name,
          description: input.description,
          imageId: input.imageId,
          likedBy: [],
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });

    return post ?? null;
  }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
      include: { createdBy: true },
    });

    return post ?? null;
  }),

  likePost: protectedProcedure
    .input(z.object({ postId: z.number(), userId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.postId },
        select: { likedBy: true },
      });
      if (post?.likedBy.includes(input.userId))
        throw new Error("Post already liked");
      return ctx.db.post.update({
        where: { id: input.postId },
        data: {
          likedBy: { push: input.userId },
        },
      });
    }),

  unlikePost: protectedProcedure
    .input(z.object({ postId: z.number(), userId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.postId },
        select: { likedBy: true },
      });
      if (!post) throw new Error("Post not found");

      const updatedLikedBy = post.likedBy.filter((id) => id !== input.userId);

      return ctx.db.post.update({
        where: { id: input.postId },
        data: { likedBy: updatedLikedBy },
      });
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
