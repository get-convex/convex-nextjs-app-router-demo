import { BackLink } from "@/app/(common)/BackLink";
import { Posts } from "@/app/(common)/Posts";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ConvexHttpClient } from "convex/browser";

export const dynamic = "force-dynamic";

export default async function Post({ params }: { params: { id: string } }) {
  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const post = await client.query(api.posts.get, {
    id: params.id as Id<"posts">,
  });
  return (
    <main>
      <BackLink />
      <Posts posts={post == null ? [] : [post]} />
    </main>
  );
}
