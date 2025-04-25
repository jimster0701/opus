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

      return ctx.db.$transaction([
        ctx.db.user.update({
          where: { id: input.userId },
          data: {
            followers: { push: currentUserId },
          },
        }),
        ctx.db.user.update({
          where: { id: currentUserId },
          data: {
            following: { push: input.userId },
          },
        }),
      ]);
    }),

  removeFollowing: protectedProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const currentUserId = ctx.session.user.id;

      const [targetUser, currentUser] = await Promise.all([
        ctx.db.user.findUnique({ where: { id: input.userId } }),
        ctx.db.user.findUnique({ where: { id: currentUserId } }),
      ]);

      if (!targetUser || !currentUser) throw new Error("User not found");

      const newFollowers = targetUser.followers.filter(
        (f) => f !== currentUserId
      );
      const newFollowing = currentUser.following.filter(
        (f) => f !== input.userId
      );

      return await ctx.db.$transaction([
        ctx.db.user.update({
          where: { id: input.userId },
          data: { followers: { set: newFollowers } },
        }),
        ctx.db.user.update({
          where: { id: currentUserId },
          data: { following: { set: newFollowing } },
        }),
      ]);
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
