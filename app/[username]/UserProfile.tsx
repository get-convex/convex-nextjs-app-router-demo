"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";

export function UserProfile({ username }: { username: string }) {
  const user = useQuery(api.users.get, { username });
  return user == null ? null : (
    <div className="profile">
      <Image src={user.pictureUrl} alt="profile pic" width={80} height={80} />
      <h1>{user.name}</h1>
      <div>
        <h2>@{user.username}</h2>·
        <h3>
          {user.numPosts} Post{user.numPosts === 1 ? "" : "s"}
        </h3>
      </div>
    </div>
  );
}
