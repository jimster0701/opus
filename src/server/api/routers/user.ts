import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { type Interest } from "~/types/interest";

export const userRouter = createTRPCRouter({
  getUserById: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.id },
        include: {
          createdInterests: true,
        },
      });

      return user ?? null;
    }),

  getFriends: protectedProcedure.query(async ({ ctx }) => {
    const currentUserId = ctx.session.user.id;

    const friends = await ctx.db.follow.findMany({
      where: {
        OR: [{ followerId: currentUserId }, { followingId: currentUserId }],
      },
      include: {
        follower: true,
        following: true,
      },
    });

    // Filter and map to return unique friend details
    const friendList = friends.map((relation) => {
      return relation.followerId === currentUserId
        ? relation.following
        : relation.follower;
    });

    return friendList;
  }),

  getUserInterests: protectedProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          interestIds: true,
          createdInterests: true,
        },
      });

      const defaultInterests = await ctx.db.interest.findMany({
        where: {
          createdById: "system",
          id: { in: user?.interestIds ?? [] },
        },
        include: {
          createdBy: { select: { id: true, displayName: true, image: true } },
        },
      });

      return [...(user?.createdInterests ?? []), ...defaultInterests];
    }),

  getImageUrl: protectedProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const imageUrl = await ctx.db.user.findUnique({
        where: {
          id: input.userId,
        },
        select: { image: true },
      });

      return imageUrl;
    }),

  getNewUsersByInterests: protectedProcedure
    .input(z.object({ interestIds: z.array(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      const currentUserId = ctx.session.user.id;
      const users = await ctx.db.user.findMany({
        orderBy: { id: "desc" },
        where: {
          interestIds: { hasSome: input.interestIds },
          NOT: { followers: { some: { followerId: currentUserId } } },
        },
      });

      return users ?? null;
    }),

  IsFollowing: protectedProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const relation = await ctx.db.follow.findUnique({
        where: {
          follower_following_unique: {
            followerId: ctx.session.user.id,
            followingId: input.userId,
          },
        },
      });
      return relation != null;
    }),

  getFollowers: protectedProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.follow.findMany({
        where: { followingId: input.userId },
        select: {
          follower: { select: { id: true, displayName: true, image: true } },
        },
      });
    }),

  getFollowing: protectedProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.follow.findMany({
        where: { followerId: input.userId },
        select: {
          following: { select: { id: true, displayName: true, image: true } },
        },
      });
    }),

  addFollowing: protectedProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { id: currentUserId } = ctx.session.user;

      if (currentUserId === input.userId) {
        throw new Error("You can't follow yourself");
      }

      const existingFollow = await ctx.db.follow.findUnique({
        where: {
          follower_following_unique: {
            followerId: currentUserId,
            followingId: input.userId,
          },
        },
      });

      if (existingFollow) return existingFollow;

      return await ctx.db.follow.create({
        data: {
          follower: { connect: { id: currentUserId } },
          following: { connect: { id: input.userId } },
        },
      });
    }),

  removeFollowing: protectedProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const currentUserId = ctx.session.user.id;

      return await ctx.db.follow.delete({
        where: {
          follower_following_unique: {
            followerId: currentUserId,
            followingId: input.userId,
          },
        },
      });
    }),

  updateDisplayName: protectedProcedure
    .input(z.object({ newDisplayName: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      if (input.newDisplayName.length < 20)
        return ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: {
            displayName: input.newDisplayName,
          },
        });
      else {
        throw new Error("Display name cannt be over 20 characters");
      }
    }),

  updateInterests: protectedProcedure
    .input(z.object({ interestIds: z.array(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { interestIds: input.interestIds },
      });
    }),

  updateProfilePicture: protectedProcedure
    .input(z.object({ image: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { image: input.image },
      });
    }),

  updateThemePreset: protectedProcedure
    .input(z.object({ theme: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { themePreset: input.theme },
      });
    }),
});
