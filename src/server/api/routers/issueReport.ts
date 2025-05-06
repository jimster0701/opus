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
      const report = await ctx.db.issueReport.create({
        data: {
          userId: ctx.session.userId,
          message: input.message,
        },
      });
      await ctx.db.notification.create({
        data: {
          type: "BUG_REPORT",
          fromUserId: ctx.session.userId,
          toUserId: "cma27qvsr00007xxedkmacbik",
          reportId: report.id,
        },
      });
      return report;
    }),
});
