import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const tagRouter = createTRPCRouter({
  getAllTasks: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.task.findMany({
      orderBy: { name: "desc" },
      where: { userId: ctx.session.user.id },
    });

    return post ?? null;
  }),
});
