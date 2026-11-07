import { Suspense } from "react";
import { Playground } from "@/components/workspace/Playground";
import { Skeleton } from "@/components/workspace/ui";

export const metadata = { title: "Playground" };
export default function Page() {
  return <Suspense fallback={<Skeleton label="Loading Playground" />}><Playground /></Suspense>;
}
