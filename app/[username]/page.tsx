import { BackLink } from "../(common)/BackLink";
import { UserPosts } from "./UserPosts";
import { UserProfile } from "./UserProfile";

export default function Profile({ params }: { params: { username: string } }) {
  return (
    <main>
      <BackLink />
      <UserProfile username={params.username} />
      <UserPosts username={params.username} />
    </main>
  );
}
