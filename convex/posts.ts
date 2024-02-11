import { asyncMap } from "modern-async";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { QueryCtx, mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { getUser } from "./users";
import { CHARACTER_LIMIT } from "./shared";

export const all = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("posts")
      .order("desc")
      .paginate(args.paginationOpts);

    return { ...result, page: await enrichPosts(ctx, result.page) };
  },
});

export const forAuthor = query({
  args: {
    authorUserName: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const author = await getUser(ctx, args.authorUserName);
    if (author === null) {
      return { page: [], isDone: true, continueCursor: "" };
    }
    const result = await ctx.db
      .query("posts")
      .withIndex("authorId", (q) => q.eq("authorId", author._id))
      .order("desc")
      .paginate(args.paginationOpts);

    return { ...result, page: await enrichPosts(ctx, result.page) };
  },
});

export type Post = NonNullable<Awaited<ReturnType<typeof enrichPost>>>;

export const get = query({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (post === null) {
      return null;
    }
    return await enrichPost(ctx, post);
  },
});

async function enrichPosts(ctx: QueryCtx, posts: Doc<"posts">[]) {
  return await asyncMap(posts, (post) => enrichPost(ctx, post));
}

async function enrichPost(ctx: QueryCtx, post: Doc<"posts">) {
  const author = await ctx.db.get(post.authorId);
  if (author === null) {
    return null;
  }
  return { ...post, author };
}

export const create = mutation({
  args: { text: v.string() },
  handler: async (ctx, { text }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Called createPost without being authenticated");
    }
    const author = await ctx.db
      .query("users")
      .withIndex("tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (author === null) {
      throw new Error("User not found");
    }

    if (text.length <= 0 || text.length > CHARACTER_LIMIT) {
      throw new Error("Message is too damn long! (or empty)");
    }

    const numSentRecently = (
      await ctx.db
        .query("posts")
        .withIndex("authorId", (q) =>
          q
            .eq("authorId", author._id)
            .gte("_creationTime", Date.now() - 1000 * 60)
        )
        .take(3)
    ).length;

    if (numSentRecently >= 3) {
      throw new Error("Too fast, slow down!");
    }

    await ctx.db.insert("posts", { authorId: author._id, text });
    // Instead of computing the number of tweets when a profile
    // is loaded, we "denormalize" the data and increment
    // a counter - this is safe thanks to Convex's ACID properties!
    await ctx.db.patch(author._id, { numPosts: author.numPosts + 1 });
  },
});
