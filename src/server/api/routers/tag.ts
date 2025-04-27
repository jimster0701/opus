import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const tagRouter = createTRPCRouter({
  getAllTags: protectedProcedure.query(async ({ ctx }) => {
    const tags = await ctx.db.tag.findMany({
      orderBy: { id: "desc" },
      where: { OR: [{ userId: "system" }, { userId: ctx.session.user.id }] },
      include: {
        user: {
          select: { id: true, name: true, displayName: true, image: true },
        },
      },
    });
    return tags ?? null;
  }),
});
