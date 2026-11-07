"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { customerUsage, initialCustomers, initialPolicy, type DemoCustomer, type OwnerAuditEvent, type PlanName, type SpendingPolicy } from "./businessFixtures";
import { plans } from "./fixtures";

function initialState() {
  return { customers: initialCustomers, policies: Object.fromEntries(initialCustomers.map(customer => [customer.id, initialPolicy(customer)])), audit: [] as OwnerAuditEvent[] };
}

type BusinessStore = ReturnType<typeof initialState> & {
  adjustCredit: (id: string, cents: number, reason: string) => void;
  changeStatus: (id: string, status: DemoCustomer["status"], reason: string) => void;
  changePlan: (id: string, plan: string) => void;
  savePolicy: (id: string, policy: SpendingPolicy) => void;
  resetCustomer: (id: string) => void;
};

const BusinessContext = createContext<BusinessStore | null>(null);

export function useBusinessDemo() {
  const store = useContext(BusinessContext);
  if (!store) throw new Error("Business demo state requires BusinessDemoProvider.");
  return store;
}

export function BusinessDemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialState);

  function adjustCredit(id: string, cents: number, reason: string) {
    if (!Number.isSafeInteger(cents) || !cents || Math.abs(cents) > 100_000 || !reason.trim()) return;
    const eventId = crypto.randomUUID();
    setState(current => {
      const customer = current.customers.find(item => item.id === id);
      if (!customer) return current;
      const available = customerUsage(customer).availableCents;
      if (available + cents < 0) return current;
      return {
        ...current,
        customers: current.customers.map(item => item.id === id ? { ...item, adjustmentCents: item.adjustmentCents + cents } : item),
        audit: [{ id: eventId, customerId: id, title: "Demo credit adjusted", detail: reason.trim(), time: "Just now", creditDeltaCents: cents, balanceAfterCents: available + cents }, ...current.audit],
      };
    });
  }

  function changeStatus(id: string, status: DemoCustomer["status"], reason: string) {
    if (!reason.trim() || !["Active", "Paused"].includes(status)) return;
    const eventId = crypto.randomUUID();
    setState(current => {
      if (!current.customers.some(customer => customer.id === id && customer.status !== status)) return current;
      return {
        ...current,
        customers: current.customers.map(item => item.id === id ? { ...item, status } : item),
        audit: [{ id: eventId, customerId: id, title: `Account ${status.toLowerCase()} in demo`, detail: reason.trim(), time: "Just now" }, ...current.audit],
      };
    });
  }

  function changePlan(id: string, plan: string) {
    if (!plans.some(item => item.name === plan)) return;
    setState(current => ({ ...current, customers: current.customers.map(item => item.id === id ? { ...item, plan: plan as PlanName } : item) }));
  }

  function savePolicy(id: string, policy: SpendingPolicy) {
    if (!Number.isSafeInteger(policy.budgetCents) || policy.budgetCents < 0 || policy.budgetCents > 1_000_000 || ![50, 80, 90, 100].includes(policy.alertPercent)) return;
    const eventId = crypto.randomUUID();
    setState(current => {
      if (!current.customers.some(customer => customer.id === id)) return current;
      return { ...current, policies: { ...current.policies, [id]: policy }, audit: [{ id: eventId, customerId: id, title: "Spending preference saved", detail: "Customer updated the demo budget and alert threshold.", time: "Just now" }, ...current.audit] };
    });
  }

  function resetCustomer(id: string) {
    const original = initialCustomers.find(item => item.id === id);
    if (!original) return;
    setState(current => ({ ...current, customers: current.customers.map(item => item.id === id ? original : item), policies: { ...current.policies, [id]: initialPolicy(original) }, audit: current.audit.filter(event => event.customerId !== id) }));
  }

  return <BusinessContext.Provider value={{ ...state, adjustCredit, changeStatus, changePlan, savePolicy, resetCustomer }}>{children}</BusinessContext.Provider>;
}
