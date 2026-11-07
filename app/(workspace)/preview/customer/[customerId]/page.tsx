import { notFound } from "next/navigation";
import { initialCustomers } from "@/components/workspace/businessFixtures";
import { CustomerPanel } from "@/components/workspace/CustomerPanel";

export const metadata = { title: "Customer panel preview" };
export function generateStaticParams() {
  return initialCustomers.map(customer => ({ customerId: customer.id }));
}
export default async function Page({ params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = await params;
  if (!initialCustomers.some(customer => customer.id === customerId)) notFound();
  return <CustomerPanel key={customerId} customerId={customerId} preview />;
}
