import { type Post } from "~/types/post";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  createPost: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        taskId: z.number(),
        private: z.boolean(),
        description: z.string().min(1),
        imageUrl: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          name: input.name,
          task: { connect: { id: input.taskId } },
          description: input.description,
          imageUrl: input.imageUrl,
          likedBy: [],
          private: input.private,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
  updatePost: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1),
        taskId: z.number().min(1),
        name: z.string().min(1),
        private: z.boolean(),
        imageUrl: z.string().min(1),
        description: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.update({
        where: { id: input.id },
        data: {
          name: input.name,
          taskId: input.taskId,
          description: input.description,
          imageUrl: input.imageUrl,
          private: input.private,
        },
      });
    }),

  deletePost: protectedProcedure
    .input(z.object({ id: z.number().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (prisma) => {
        const commentIds = await prisma.comment.findMany({
          where: { postId: input.id },
          select: { id: true },
        });

        await prisma.reply.deleteMany({
          where: { commentId: { in: commentIds.map((c) => c.id) } },
        });
        await prisma.comment.deleteMany({ where: { postId: input.id } });

        return ctx.db.post.delete({
          where: { id: input.id },
        });
      });
    }),

  updateImage: protectedProcedure
    .input(z.object({ id: z.number().min(1), imageUrl: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.update({
        where: { id: input.id },
        data: { imageUrl: input.imageUrl },
      });
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });

    return post ?? null;
  }),

  getAllFriends: protectedProcedure.query(async ({ ctx }) => {
    const following = await ctx.db.follow.findMany({
      where: { followerId: ctx.session.user.id },
      select: { followingId: true },
    });

    const followingIds = following.map((f) => f.followingId);

    const dbPosts = await ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        createdBy: {
          id: { in: followingIds },
        },
      },
      include: {
        createdBy: true,
        task: {
          include: {
            friends: {
              include: {
                user: {
                  select: {
                    id: true,
                    displayName: true,
                    image: true,
                  },
                },
              },
            },
            interests: {
              include: {
                interest: {
                  select: {
                    id: true,
                    name: true,
                    icon: true,
                    colour: true,
                    private: true,
                    createdById: true,
                    createdBy: true,
                  },
                },
                task: {
                  select: {
                    id: true,
                    type: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        comments: {
          include: {
            createdBy: {
              select: { id: true, displayName: true, image: true },
            },
            replies: {
              include: {
                createdBy: {
                  select: {
                    id: true,
                    displayName: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const posts = dbPosts.map((dbPost) => {
      const transformedInterests = dbPost.task.interests.map(
        (interestRelation) => {
          const taskInterest = {
            id: `${interestRelation.taskId}-${interestRelation.interestId}`,
            taskId: interestRelation.taskId,
            interestId: interestRelation.interestId,
            task: {
              id: interestRelation.interest.id,
              type: interestRelation.task.type,
              name: interestRelation.task.name,
            },
            interest: {
              id: interestRelation.interest.id,
              name: interestRelation.interest.name,
              icon: interestRelation.interest.icon,
              colour: interestRelation.interest.colour,
              private: interestRelation.interest.private,
              createdById: interestRelation.interest.createdById,
              createdBy: interestRelation.interest.createdBy,
            },
          };
          return taskInterest;
        }
      );

      const post = {
        id: dbPost.id,
        name: dbPost.name ?? "",
        description: dbPost.description ?? "",
        createdAt: dbPost.createdAt,
        updatedAt: dbPost.updatedAt,
        private: dbPost.private,
        createdById: dbPost.createdById,
        createdBy: dbPost.createdBy,
        likedBy: dbPost.likedBy ?? [],
        imageUrl: dbPost.imageUrl,
        comments: dbPost.comments,
        task: {
          ...dbPost.task,
          interests: transformedInterests,
        },
      };

      return post;
    });

    const typedPosts = posts as unknown as Post[];
    return typedPosts;
  }),

  getAllUser: protectedProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        isFriend: z.boolean(),
        isPrivate: z.boolean(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!input.isFriend && input.isPrivate) return [];
      const dbPosts = await ctx.db.post.findMany({
        orderBy: { createdAt: "desc" },
        where: { createdBy: { id: input.userId } },
        include: {
          createdBy: true,
          task: {
            include: {
              friends: {
                include: {
                  user: {
                    select: {
                      id: true,
                      displayName: true,
                      image: true,
                    },
                  },
                },
              },
              interests: {
                include: {
                  interest: {
                    select: {
                      id: true,
                      name: true,
                      icon: true,
                      colour: true,
                      private: true,
                      createdById: true,
                      createdBy: true,
                    },
                  },
                  task: {
                    select: {
                      id: true,
                      type: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
          comments: {
            include: {
              createdBy: {
                select: {
                  id: true,
                  displayName: true,
                  image: true,
                },
              },
              replies: {
                include: {
                  createdBy: {
                    select: {
                      id: true,
                      displayName: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const posts = dbPosts.map((dbPost) => {
        const transformedInterests = dbPost.task.interests.map(
          (interestRelation) => {
            const taskInterest = {
              id: `${interestRelation.taskId}-${interestRelation.interestId}`,
              taskId: interestRelation.taskId,
              interestId: interestRelation.interestId,
              task: {
                id: interestRelation.interest.id,
                type: interestRelation.task.type,
                name: interestRelation.task.name,
              },
              interest: {
                id: interestRelation.interest.id,
                name: interestRelation.interest.name,
                icon: interestRelation.interest.icon,
                colour: interestRelation.interest.colour,
                private: interestRelation.interest.private,
                createdById: interestRelation.interest.createdById,
                createdBy: interestRelation.interest.createdBy,
              },
            };
            return taskInterest;
          }
        );

        const post = {
          id: dbPost.id,
          name: dbPost.name ?? "",
          description: dbPost.description ?? "",
          createdAt: dbPost.createdAt,
          updatedAt: dbPost.updatedAt,
          private: dbPost.private,
          createdById: dbPost.createdById,
          createdBy: dbPost.createdBy,
          likedBy: dbPost.likedBy ?? [],
          imageUrl: dbPost.imageUrl,
          comments: dbPost.comments,
          task: {
            ...dbPost.task,
            interests: transformedInterests,
          },
        };

        return post;
      });

      const typedPosts = posts as unknown as Post[];
      return typedPosts;
    }),

  getAllSessionUser: protectedProcedure.query(async ({ ctx }) => {
    const dbPosts = await ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.userId } },
      include: {
        createdBy: true,
        task: {
          include: {
            friends: {
              include: {
                user: {
                  select: {
                    id: true,
                    displayName: true,
                    image: true,
                  },
                },
              },
            },
            interests: {
              include: {
                interest: {
                  select: {
                    id: true,
                    name: true,
                    icon: true,
                    colour: true,
                    private: true,
                    createdById: true,
                    createdBy: true,
                  },
                },
                task: {
                  select: {
                    id: true,
                    type: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        comments: {
          include: {
            createdBy: {
              select: {
                id: true,
                displayName: true,
                image: true,
              },
            },
            replies: {
              include: {
                createdBy: {
                  select: {
                    id: true,
                    displayName: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const posts = dbPosts.map((dbPost) => {
      const transformedInterests = dbPost.task.interests.map(
        (interestRelation) => {
          const taskInterest = {
            id: `${interestRelation.taskId}-${interestRelation.interestId}`,
            taskId: interestRelation.taskId,
            interestId: interestRelation.interestId,
            task: {
              id: interestRelation.interest.id,
              type: interestRelation.task.type,
              name: interestRelation.task.name,
            },
            interest: {
              id: interestRelation.interest.id,
              name: interestRelation.interest.name,
              icon: interestRelation.interest.icon,
              colour: interestRelation.interest.colour,
              private: interestRelation.interest.private,
              createdById: interestRelation.interest.createdById,
              createdBy: interestRelation.interest.createdBy,
            },
          };
          return taskInterest;
        }
      );

      const post = {
        id: dbPost.id,
        name: dbPost.name ?? "",
        description: dbPost.description ?? "",
        createdAt: dbPost.createdAt,
        updatedAt: dbPost.updatedAt,
        private: dbPost.private,
        createdById: dbPost.createdById,
        createdBy: dbPost.createdBy,
        likedBy: dbPost.likedBy ?? [],
        imageUrl: dbPost.imageUrl,
        comments: dbPost.comments,
        task: {
          ...dbPost.task,
          interests: transformedInterests,
        },
      };

      return post;
    });

    const typedPosts = posts as unknown as Post[];
    return typedPosts;
  }),

  getAllInterest: protectedProcedure
    .input(z.object({ interestIds: z.array(z.number().min(1)) }))
    .query(async ({ ctx, input }) => {
      const dbPosts = await ctx.db.post.findMany({
        orderBy: { createdAt: "desc" },
        where: {
          createdBy: { private: false },
          task: {
            interests: {
              some: {
                interestId: {
                  in: input.interestIds,
                },
              },
            },
          },
        },
        include: {
          createdBy: true,
          task: {
            include: {
              friends: {
                include: {
                  user: {
                    select: {
                      id: true,
                      displayName: true,
                      image: true,
                    },
                  },
                },
              },
              interests: {
                include: {
                  interest: {
                    select: {
                      id: true,
                      name: true,
                      icon: true,
                      colour: true,
                      private: true,
                      createdById: true,
                      createdBy: true,
                    },
                  },
                  task: {
                    select: {
                      id: true,
                      type: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
          comments: {
            include: {
              createdBy: {
                select: {
                  id: true,
                  displayName: true,
                  image: true,
                },
              },
              replies: {
                include: {
                  createdBy: {
                    select: {
                      id: true,
                      displayName: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const posts = dbPosts.map((dbPost) => {
        const transformedInterests = dbPost.task.interests.map(
          (interestRelation) => {
            const taskInterest = {
              id: `${interestRelation.taskId}-${interestRelation.interestId}`,
              taskId: interestRelation.taskId,
              interestId: interestRelation.interestId,
              task: {
                id: interestRelation.interest.id,
                type: interestRelation.task.type,
                name: interestRelation.task.name,
              },
              interest: {
                id: interestRelation.interest.id,
                name: interestRelation.interest.name,
                icon: interestRelation.interest.icon,
                colour: interestRelation.interest.colour,
                private: interestRelation.interest.private,
                createdById: interestRelation.interest.createdById,
                createdBy: interestRelation.interest.createdBy,
              },
            };
            return taskInterest;
          }
        );

        const post = {
          id: dbPost.id,
          name: dbPost.name ?? "",
          description: dbPost.description ?? "",
          createdAt: dbPost.createdAt,
          updatedAt: dbPost.updatedAt,
          private: dbPost.private,
          createdById: dbPost.createdById,
          createdBy: dbPost.createdBy,
          likedBy: dbPost.likedBy ?? [],
          imageUrl: dbPost.imageUrl,
          comments: dbPost.comments,
          task: {
            ...dbPost.task,
            interests: transformedInterests,
          },
        };

        return post;
      });

      const typedPosts = posts as unknown as Post[];
      return typedPosts;
    }),

  likePost: protectedProcedure
    .input(z.object({ postId: z.number(), userId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.postId },
        select: { likedBy: true, createdById: true },
      });
      if (post?.likedBy.includes(input.userId))
        throw new Error("Post already liked");

      if (post)
        await ctx.db.notification.create({
          data: {
            type: "LIKE_POST",
            fromUserId: ctx.session.userId,
            toUserId: post.createdById,
            postId: input.postId,
          },
        });

      return ctx.db.post.update({
        where: { id: input.postId },
        data: {
          likedBy: { push: input.userId },
        },
      });
    }),

  unlikePost: protectedProcedure
    .input(z.object({ postId: z.number(), userId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.postId },
        select: { likedBy: true },
      });
      if (!post) throw new Error("Post not found");

      const updatedLikedBy = post.likedBy.filter((id) => id !== input.userId);

      return ctx.db.post.update({
        where: { id: input.postId },
        data: { likedBy: updatedLikedBy },
      });
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
