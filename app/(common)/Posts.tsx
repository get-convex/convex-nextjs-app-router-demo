import { Post } from "@/convex/posts";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";

dayjs.extend(relativeTime);

export function Posts(props: { posts: Post[] }) {
  return (
    <ul>
      {props.posts.map((post) => (
        <li key={post._id}>
          <Image
            alt="profile pic"
            src={post.author.pictureUrl}
            width={40}
            height={40}
          />
          <div>
            <div>
              <Link href={`/${post.author.username}`}>
                <span className="name">{post.author.name}</span>
              </Link>
              <span className="username">@{post.author.username}</span>·
              <Link href={`/post/${post._id}`}>
                <span className="time">
                  {dayjs(post._creationTime).fromNow()}
                </span>
              </Link>
            </div>
            <div className="text">{post.text}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
