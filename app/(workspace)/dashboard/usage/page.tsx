import { Suspense } from "react";
import { UsageDashboard } from "@/components/workspace/UsageDashboard";
import { Skeleton } from "@/components/workspace/ui";

export const metadata = { title: "Usage & Billing" };
export default function Page() {
  return <Suspense fallback={<Skeleton label="Loading usage and billing" />}><UsageDashboard /></Suspense>;
}
