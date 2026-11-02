import { Suspense } from "react";
import { Compare } from "@/components/lab/Compare";

export const metadata = { title: "Compare — Aether Design Lab" };

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="h-screen bg-[#0b0b0a]" />}>
      <Compare />
    </Suspense>
  );
}
