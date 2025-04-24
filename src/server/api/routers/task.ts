import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const tagRouter = createTRPCRouter({
  getAllTags: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.tag.findMany({
      orderBy: { name: "desc" },
      where: { userId: ctx.session.user.id },
    });

    return post ?? null;
  }),
});
