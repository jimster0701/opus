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
      return ctx.db.interest.create({
        data: {
          name: input.name,
          icon: input.icon,
          colour: input.colour,
          private: input.private,
          createdById: ctx.session.user.id,
        },
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
      return ctx.db.interest.delete({
        where: { id: input.id },
      });
    }),

  getInterestsById: protectedProcedure
    .input(
      z.object({
        interestIds: z.array(z.number().min(1)),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.interest.findMany({
        where: {
          id: { in: input.interestIds },
        },
        include: {
          createdBy: {
            select: { id: true, displayName: true, image: true }, // Simple user
          },
        },
      });
    }),

  getUserCreatedInterests: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
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
