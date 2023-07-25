"use client";

import { api } from "@/convex/_generated/api";
import { PostsScrollView } from "./(common)/PostsScrollView";

export function AllPosts() {
  return <PostsScrollView query={api.posts.all} args={{}} />;
}
