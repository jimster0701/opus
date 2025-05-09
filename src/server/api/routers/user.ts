import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { NotificationType } from "~/types/notification";

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

    const following = await ctx.db.follow.findMany({
      where: { followerId: currentUserId },
      select: { followingId: true },
    });

    const followingIds = following.map((f) => f.followingId);

    const friends = await ctx.db.follow.findMany({
      where: {
        followerId: {
          in: followingIds,
        },
        followingId: currentUserId,
      },
      include: {
        follower: true,
      },
    });

    return friends.map((f) => f.follower);
  }),

  getUserInterests: protectedProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          interests: true,
        },
      });

      const defaultInterests = await ctx.db.interest.findMany({
        where: {
          id: { in: user?.interests.map((i) => i.interestId) ?? [] },
        },
        include: {
          createdBy: { select: { id: true, displayName: true, image: true } },
        },
      });

      return defaultInterests;
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
          interests: { some: { interestId: { in: input.interestIds } } },
          NOT: { followers: { some: { followerId: currentUserId } } },
        },
      });

      return users ?? null;
    }),

  IsFriend: protectedProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const relation1 = await ctx.db.follow.findUnique({
        where: {
          follower_following_unique: {
            followerId: ctx.session.user.id,
            followingId: input.userId,
          },
        },
      });
      const relation2 = await ctx.db.follow.findUnique({
        where: {
          follower_following_unique: {
            followerId: input.userId,
            followingId: ctx.session.user.id,
          },
        },
      });
      return relation1 != null && relation2 != null;
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

      await ctx.db.notification.create({
        data: {
          type: NotificationType.FOLLOW,
          fromUserId: currentUserId,
          toUserId: input.userId,
        },
      });

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

      const notification = await ctx.db.notification.findFirst({
        where: {
          type: "FOLLOW",
          fromUserId: currentUserId,
          toUserId: input.userId,
        },
      });

      await ctx.db.notification.delete({
        where: {
          id: notification?.id,
        },
      });

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
      const userId = ctx.session.user.id;

      const interestConnections = input.interestIds.map((interestId) => ({
        userId: userId,
        interestId: interestId,
      }));

      await ctx.db.userInterest.deleteMany({
        where: { userId: userId },
      });

      await ctx.db.userInterest.createMany({
        data: interestConnections,
        skipDuplicates: true,
      });

      return ctx.db.user.findUnique({
        where: { id: userId },
        include: {
          interests: true,
        },
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

  updatePrivate: protectedProcedure
    .input(z.object({ private: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { private: input.private },
      });
    }),

  updateTasksPrivate: protectedProcedure
    .input(z.object({ tasksPrivate: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { tasksPrivate: input.tasksPrivate },
      });
    }),
});
