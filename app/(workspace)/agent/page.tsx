import { Suspense } from "react";
import { Agent } from "@/components/workspace/Agent";
import { Skeleton } from "@/components/workspace/ui";

export const metadata = { title: "Agent workspace" };
export default function Page() {
  return <Suspense fallback={<Skeleton label="Loading Agent workspace" />}><Agent /></Suspense>;
}
