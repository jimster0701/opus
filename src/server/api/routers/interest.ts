import { type UserInterest } from "@prisma/client";
import { type Interest } from "~/types/interest";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const interestRouter = createTRPCRouter({
  createInterest: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        icon: z.string().min(1),
        colour: z.string().min(1),
        private: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return ctx.db.$transaction(async (prisma) => {
        const interest = await prisma.interest.create({
          data: {
            name: input.name,
            icon: input.icon,
            colour: input.colour,
            private: input.private,
            createdById: userId,
          },
        });
        return interest;
      });
    }),

  updateInterest: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1),
        name: z.string().min(1),
        icon: z.string().min(1),
        colour: z.string().min(1),
        private: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.interest.update({
        where: { id: input.id },
        data: {
          name: input.name,
          icon: input.icon,
          colour: input.colour,
          private: input.private,
        },
      });
    }),

  deleteInterest: protectedProcedure
    .input(z.object({ id: z.number().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.userInterest.deleteMany({
        where: {
          interestId: input.id,
        },
      });

      await ctx.db.taskInterest.deleteMany({
        where: {
          interestId: input.id,
        },
      });

      return ctx.db.interest.delete({
        where: { id: input.id },
      });
    }),

  getCustomUserInterests: protectedProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const customInterests = await ctx.db.interest.findMany({
        where: {
          createdById: input.userId,
        },
      });

      return customInterests;
    }),

  getAllCustomInterests: protectedProcedure.query(async ({ ctx }) => {
    const customInterests = await ctx.db.interest.findMany({
      where: {
        NOT: {
          createdById: "system",
        },
        private: false,
      },
    });

    return customInterests;
  }),

  getInterestsById: protectedProcedure
    .input(
      z.object({
        interestIds: z.array(z.number().min(1)),
      })
    )
    .query(async ({ ctx, input }) => {
      const dbInterests = await ctx.db.interest.findMany({
        where: {
          id: { in: input.interestIds },
        },
        include: {
          createdBy: {
            select: { id: true, displayName: true, image: true }, // Simple user
          },
          users: { select: { userId: true, interestId: true } },
        },
      });

      const interests = dbInterests.map((dbInterest) => {
        // Create a properly typed Interest object
        const interest = {
          id: dbInterest.id,
          name: dbInterest.name,
          private: dbInterest.private,
          createdById: dbInterest.createdById,
          icon: dbInterest.icon,
          colour: dbInterest.colour,
          createdBy: dbInterest.createdBy,
          // Transform users array to match your interface if needed
          users: dbInterest.users.map((user: UserInterest) => ({
            userId: user.userId,
            interestId: user.interestId,
          })),
        };

        return interest;
      });

      // Type assertion to ensure TypeScript recognizes this as matching your Interest interface
      return interests as unknown as Interest[];
    }),

  getUserCreatedInterests: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.interest.findMany({
        where: {
          createdById: input.id,
        },
        include: {
          createdBy: {
            select: { id: true, displayName: true, image: true }, // Simple user
          },
        },
      });
    }),
});
