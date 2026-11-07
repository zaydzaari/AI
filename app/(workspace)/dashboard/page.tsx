import { Suspense } from "react";
import { Dashboard } from "@/components/workspace/Dashboard";
import { Skeleton } from "@/components/workspace/ui";

export const metadata = { title: "Dashboard" };
export default function Page() {
  return <Suspense fallback={<Skeleton label="Loading dashboard" />}><Dashboard /></Suspense>;
}
