import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const reportRouter = createTRPCRouter({
  createIssueReport: protectedProcedure
    .input(
      z.object({
        message: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.issueReport.create({
        data: {
          userId: ctx.session.userId,
          message: input.message,
        },
      });
    }),
});
