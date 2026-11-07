import { Auth } from "@/components/workspace/Auth";

export const metadata = { title: "Sign in" };
export default function Page() {
  return <Auth mode="login" />;
}
