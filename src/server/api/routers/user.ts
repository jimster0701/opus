import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getNewUsersByInterests: protectedProcedure
    .input(z.object({ interests: z.array(z.string().min(1)) }))
    .mutation(async ({ ctx, input }) => {
      const users = await ctx.db.user.findMany({
        orderBy: { id: "desc" },
        where: {
          interests: { hasSome: input.interests },
          NOT: { followers: { has: ctx.session.user.id } },
        },
      });

      return users ?? null;
    }),

  getFriends: protectedProcedure
    .input(z.object({}))
    .mutation(async ({ ctx }) => {
      const users = await ctx.db.user.findMany({
        orderBy: { id: "desc" },
        where: {
          followers: { has: ctx.session.user.id },
          following: { has: ctx.session.user.id },
        },
      });

      return users ?? null;
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
          followerId_followingId: {
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
          followerId_followingId: {
            followerId: currentUserId,
            followingId: input.userId,
          },
        },
      });
    }),

  updateDisplayName: protectedProcedure
    .input(z.object({ newDisplayName: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          displayName: input.newDisplayName,
        },
      });
    }),

  updateInterests: protectedProcedure
    .input(z.object({ interests: z.array(z.string().min(1)) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { interests: input.interests },
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
