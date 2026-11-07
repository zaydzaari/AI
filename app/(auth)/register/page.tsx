import { Auth } from "@/components/workspace/Auth";

export const metadata = { title: "Create an account" };
export default function Page() {
  return <Auth mode="register" />;
}
