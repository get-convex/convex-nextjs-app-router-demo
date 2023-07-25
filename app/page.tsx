import { AllPosts } from "./AllPosts";
import { SignInOrComposer } from "./SignInOrComposer";

export default function Home() {
  return (
    <main>
      <SignInOrComposer />
      <AllPosts />
    </main>
  );
}
