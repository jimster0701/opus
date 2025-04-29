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
        taskId: z.number(),
        description: z.string().min(1),
        imageUrl: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          name: input.name,
          task: { connect: { id: input.taskId } },
          description: input.description,
          imageUrl: input.imageUrl,
          likedBy: [],
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  updateImage: protectedProcedure
    .input(z.object({ id: z.number().min(1), imageUrl: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.update({
        where: { id: input.id },
        data: { imageUrl: input.imageUrl },
      });
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });

    return post ?? null;
  }),

  getAllFriends: protectedProcedure.query(async ({ ctx }) => {
    const following = await ctx.db.follow.findMany({
      where: { followerId: ctx.session.user.id },
      select: { followingId: true },
    });

    const followingIds = following.map((f) => f.followingId);

    const post = await ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        createdBy: {
          id: { in: followingIds },
        },
      },
      include: {
        createdBy: true,
        task: true,
        comments: {
          include: {
            createdBy: {
              select: { id: true, name: true, displayName: true, image: true },
            },
            replies: {
              include: {
                createdBy: {
                  select: {
                    id: true,
                    name: true,
                    displayName: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return post;
  }),

  getAllUser: protectedProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findMany({
        orderBy: { createdAt: "desc" },
        where: { createdBy: { id: input.userId } },
        include: {
          createdBy: true,
          task: true,
          comments: {
            include: {
              createdBy: {
                select: {
                  id: true,
                  name: true,
                  displayName: true,
                  image: true,
                },
              },
              replies: {
                include: {
                  createdBy: {
                    select: {
                      id: true,
                      name: true,
                      displayName: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return post ?? null;
    }),

  getAllInterest: protectedProcedure
    .input(z.object({ interestIds: z.array(z.number().min(1)) }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findMany({
        orderBy: { createdAt: "desc" },
        where: { task: { interestIds: { hasSome: input.interestIds } } },
        include: {
          createdBy: true,
          task: true,
          comments: {
            include: {
              createdBy: {
                select: {
                  id: true,
                  name: true,
                  displayName: true,
                  image: true,
                },
              },
              replies: {
                include: {
                  createdBy: {
                    select: {
                      id: true,
                      name: true,
                      displayName: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
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
