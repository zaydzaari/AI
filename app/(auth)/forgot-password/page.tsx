import { Auth } from "@/components/workspace/Auth";

export const metadata = { title: "Reset your password" };
export default function Page() {
  return <Auth mode="reset" />;
}
