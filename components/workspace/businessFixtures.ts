import { models, monthlyUsage, plans } from "./fixtures";
import { getUsageAnalysis, getUsageMix } from "./usageAnalytics";

export type PlanName = (typeof plans)[number]["name"];
export type DemoCustomer = {
  id: string;
  name: string;
  email: string;
  plan: PlanName;
  status: "Active" | "Paused";
  joined: string;
  fundedCents: number;
  adjustmentCents: number;
  usageScale: number;
};

export type SpendingPolicy = { budgetCents: number; alertPercent: number; pauseAtLimit: boolean };
export type OwnerAuditEvent = {
  id: string;
  customerId: string;
  title: string;
  detail: string;
  time: string;
  creditDeltaCents?: number;
  balanceAfterCents?: number;
};

export const initialCustomers: DemoCustomer[] = [
  { id: "mira", name: "Mira Chen", email: "mira@example.com", plan: "Starter", status: "Active", joined: "Oct 1, 2026", fundedCents: 5000, adjustmentCents: 0, usageScale: 1 },
  { id: "jordan", name: "Jordan Lee", email: "jordan@example.com", plan: "Developer", status: "Active", joined: "Oct 3, 2026", fundedCents: 10000, adjustmentCents: 0, usageScale: 1.7 },
  { id: "sam", name: "Sam Rivera", email: "sam@example.com", plan: "Pro", status: "Active", joined: "Oct 5, 2026", fundedCents: 15000, adjustmentCents: 0, usageScale: 3.2 },
  { id: "alex", name: "Alex Morgan", email: "alex@example.com", plan: "Starter", status: "Paused", joined: "Oct 8, 2026", fundedCents: 5000, adjustmentCents: 0, usageScale: .6 },
  { id: "noor", name: "Noor Haddad", email: "noor@example.com", plan: "Ultimate", status: "Active", joined: "Oct 10, 2026", fundedCents: 20000, adjustmentCents: 0, usageScale: 4.5 },
  { id: "leo", name: "Leo Park", email: "leo@example.com", plan: "Developer", status: "Active", joined: "Oct 12, 2026", fundedCents: 7500, adjustmentCents: 0, usageScale: 1.4 },
  { id: "imani", name: "Imani Brooks", email: "imani@example.com", plan: "Starter", status: "Active", joined: "Oct 15, 2026", fundedCents: 2500, adjustmentCents: 0, usageScale: .35 },
  { id: "rowan", name: "Rowan Blake", email: "rowan@example.com", plan: "Ultimate", status: "Active", joined: "Oct 18, 2026", fundedCents: 25000, adjustmentCents: 0, usageScale: 5.5 },
];

// These supplier rates are hypothetical modelling inputs, not provider quotes.
export const candidateRoutes = models.map(model => ({
  model,
  supplier: `Candidate supplier ${model.name}`,
  upstreamRates: model.rates.map(rate => rate * .58),
  agreement: "Pending agreement" as const,
}));

export function customerUsage(customer: DemoCustomer) {
  const rows = monthlyUsage.rows.map(row => {
    const input = Math.round(row.input * customer.usageScale);
    const cached = Math.round(row.cached * customer.usageScale);
    const output = Math.round(row.output * customer.usageScale);
    const requests = Math.round(row.requests * customer.usageScale);
    const [inputRate, cachedRate, outputRate] = row.model.rates;
    const retail = ((input - cached) * inputRate + cached * cachedRate + output * outputRate) / 1_000_000;
    const upstream = retail * .58;
    return { model: row.model, requests, input, cached, output, retail, upstream };
  });
  const retailCents = Math.round(rows.reduce((sum, row) => sum + row.retail, 0) * 100);
  const upstreamCents = Math.round(rows.reduce((sum, row) => sum + row.upstream, 0) * 100);
  return {
    rows,
    retailCents,
    upstreamCents,
    availableCents: customer.fundedCents + customer.adjustmentCents - retailCents,
    requests: rows.reduce((sum, row) => sum + row.requests, 0),
    tokens: rows.reduce((sum, row) => sum + row.input + row.output, 0),
  };
}

export function initialPolicy(customer: DemoCustomer): SpendingPolicy {
  return { budgetCents: customer.id === "mira" ? 2500 : Math.ceil(customerUsage(customer).retailCents / 2500) * 2500, alertPercent: 80, pauseAtLimit: true };
}

export const operatingExpenses = [
  { id: "hosting", label: "Hosting", cents: 1500 },
  { id: "support", label: "Support provision", cents: 2000 },
  { id: "other", label: "Other operating costs", cents: 1000 },
];
export const operatingTargetCents = 100_000;

export function businessSummary(customers: DemoCustomer[]) {
  const accounts = customers.map(customer => ({ customer, ...customerUsage(customer) }));
  const sum = (key: "retailCents" | "upstreamCents" | "availableCents" | "requests") => accounts.reduce((total, account) => total + account[key], 0);
  const fundedCents = customers.reduce((total, customer) => total + customer.fundedCents, 0);
  const processingCents = Math.round(fundedCents * .029) + customers.length * 30;
  const fixedCents = operatingExpenses.reduce((total, item) => total + item.cents, 0);
  const usageCents = sum("retailCents");
  const upstreamCents = sum("upstreamCents");
  const contributionCents = usageCents - upstreamCents - processingCents;
  return {
    accounts,
    usageCents,
    upstreamCents,
    fundedCents,
    processingCents,
    fixedCents,
    contributionCents,
    operatingCents: contributionCents - fixedCents,
    remainingCreditCents: sum("availableCents"),
    requests: sum("requests"),
  };
}

export function ownerUsageMix(customers: DemoCustomer[]) {
  const reference = getUsageMix(getUsageAnalysis({ period: "October", model: "", member: "" }), "model", "cost");
  const days = reference.days.map(day => ({ label: day.label, value: 0, parts: Object.fromEntries(reference.series.map(item => [item.id, 0])) }));
  for (const customer of customers) {
    const account = customerUsage(customer);
    const rawTotal = account.rows.reduce((sum, row) => sum + row.retail, 0);
    const normalization = rawTotal ? account.retailCents / 100 / rawTotal : 0;
    const joinedDay = Number(customer.joined.split(" ")[1].replace(",", ""));
    for (const row of account.rows) {
      const eligible = reference.days.slice(joinedDay - 1);
      const weight = eligible.reduce((sum, day) => sum + (day.parts[row.model.id] ?? 0), 0);
      for (let index = joinedDay - 1; index < days.length; index++) {
        const amount = weight ? row.retail * normalization * reference.days[index].parts[row.model.id] / weight : 0;
        days[index].parts[row.model.id] += amount;
        days[index].value += amount;
      }
    }
  }
  const series = reference.series.map(item => ({ ...item, value: days.reduce((sum, day) => sum + day.parts[item.id], 0) })).sort((a, b) => b.value - a.value);
  return { days, series };
}
