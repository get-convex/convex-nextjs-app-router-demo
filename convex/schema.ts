import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    username: v.string(),
    pictureUrl: v.string(),
    numPosts: v.number(),
  }).index("byUserName", ["username"]),
  posts: defineTable({
    authorId: v.id("users"),
    text: v.string(),
  }).index("byAuthorId", ["authorId"]),
});
