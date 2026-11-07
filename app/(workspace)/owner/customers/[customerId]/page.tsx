import { notFound } from "next/navigation";
import { initialCustomers } from "@/components/workspace/businessFixtures";
import { OwnerCustomerDetail } from "@/components/workspace/OwnerConsole";

export const metadata = { title: "Customer details · Owner" };
export function generateStaticParams() {
  return initialCustomers.map(customer => ({ customerId: customer.id }));
}
export default async function Page({ params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = await params;
  if (!initialCustomers.some(customer => customer.id === customerId)) notFound();
  return <OwnerCustomerDetail key={customerId} customerId={customerId} />;
}
