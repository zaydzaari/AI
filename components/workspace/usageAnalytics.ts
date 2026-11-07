import { count, models, money, summarizeUsage, usage } from "./fixtures";

export const periods = ["October", "Last 7 days"] as const;
export type Period = (typeof periods)[number];
const fractionalUSD = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 4 });
export const formatUsageCost = (value: number) => value > 0 && value < .0001 ? "<$0.0001" : value < 1 ? fractionalUSD.format(value) : money(value);
export const metrics = {
  requests: { label: "Requests", format: count },
  tokens: { label: "Tokens", format: count },
  cost: { label: "Estimated cost", format: formatUsageCost },
} as const;
export type Metric = keyof typeof metrics;

export const members = [
  { id: "mira", name: "Mira Chen", initials: "MC", role: "Owner" },
  { id: "jordan", name: "Jordan Lee", initials: "JL", role: "Member" },
  { id: "sam", name: "Sam Rivera", initials: "SR", role: "Member" },
] as const;

type UsageTotals = {
  requests: number;
  input: number;
  cached: number;
  output: number;
  cost: number;
  uncachedCost: number;
  cachedCost: number;
  outputCost: number;
};

export type UsageFilters = { period: Period; metric: Metric; model: string; member: string; group: "model" | "member"; day: string };
export type UsageGroup = UsageFilters["group"];
const seriesColors = ["#2858cf", "#527e85", "#8b8fae", "#ad927b", "#768194"];
const defaultFilters: UsageFilters = { period: "October", metric: "requests", model: "", member: "", group: "model", day: "" };

export function readUsageFilters(query: Pick<URLSearchParams, "get">): UsageFilters {
  const metric = query.get("metric");
  const model = query.get("model");
  const member = query.get("member");
  const period = query.get("range") === "7d" ? "Last 7 days" : "October";
  const availableDays = period === "Last 7 days" ? usage.slice(-7) : usage;
  return {
    period,
    metric: metric === "tokens" || metric === "cost" ? metric : "requests",
    model: models.find(item => item.id === model)?.id ?? "",
    member: members.find(item => item.id === member)?.id ?? "",
    group: query.get("group") === "member" ? "member" : "model",
    day: availableDays.find(item => item.label === query.get("day"))?.label ?? "",
  };
}

function usageQuery(overrides: Partial<UsageFilters> = {}) {
  const { period, metric, model, member, group, day } = { ...defaultFilters, ...overrides };
  const query = new URLSearchParams();
  if (period === "Last 7 days") query.set("range", "7d");
  if (metric !== "requests") query.set("metric", metric);
  if (model) query.set("model", model);
  if (member) query.set("member", member);
  if (group === "member") query.set("group", group);
  if (day) query.set("day", day);
  return query.size ? `?${query}` : "";
}

export const usageHref = (filters: Partial<UsageFilters> = {}) => `/dashboard/usage${usageQuery(filters)}`;
export const getDashboardHref = (filters: Pick<UsageFilters, "period" | "metric" | "group">) => `/dashboard${usageQuery(filters)}`;

function addUsage(rows: readonly UsageTotals[]): UsageTotals {
  const sum: UsageTotals = { requests: 0, input: 0, cached: 0, output: 0, cost: 0, uncachedCost: 0, cachedCost: 0, outputCost: 0 };
  for (const row of rows) {
    sum.requests += row.requests;
    sum.input += row.input;
    sum.cached += row.cached;
    sum.output += row.output;
    sum.uncachedCost += row.uncachedCost;
    sum.cachedCost += row.cachedCost;
    sum.outputCost += row.outputCost;
  }
  sum.cost = sum.uncachedCost + sum.cachedCost + sum.outputCost;
  return sum;
}

// Split each model day's existing fixtures across demo members. The last share takes
// the remainder so member totals reconcile to the same requests, tokens and rates.
const attributedUsage = usage.map((day, dayIndex) => ({
  label: day.label,
  rows: day.models.flatMap((row, modelIndex) => {
    const [inputRate, cachedRate, outputRate] = models[modelIndex].rates;
    const first = Math.floor(row.requests * (.4 + .08 * (modelIndex % 3)));
    const second = Math.floor(row.requests * (.24 + .06 * ((dayIndex + modelIndex) % 3)));
    const shares = [first, second, row.requests - first - second];
    let end = 0;
    return members.map((member, index) => {
      const requests = shares[index];
      const start = end;
      end += requests;
      const allocate = (value: number) => row.requests ? Math.floor(value * end / row.requests) - Math.floor(value * start / row.requests) : 0;
      const cached = allocate(row.cached);
      const uncached = allocate(row.input - row.cached);
      const output = allocate(row.output);
      const uncachedCost = uncached * inputRate / 1_000_000;
      const cachedCost = cached * cachedRate / 1_000_000;
      const outputCost = output * outputRate / 1_000_000;
      return { modelId: row.modelId, memberId: member.id, requests, input: uncached + cached, cached, output, uncachedCost, cachedCost, outputCost, cost: uncachedCost + cachedCost + outputCost };
    });
  }),
}));

export function metricValue(totals: UsageTotals, metric: Metric) {
  return metric === "tokens" ? totals.input + totals.output : totals[metric];
}

export function getUsageAnalysis({ period, model, member, group = "model", day = "" }: Pick<UsageFilters, "period" | "model" | "member"> & { group?: UsageGroup; day?: string }) {
  const periodDays = period === "October" ? attributedUsage : attributedUsage.slice(-7);
  const days = day ? periodDays.filter(item => item.label === day) : periodDays;
  const filtered = days.map(day => ({
    label: day.label,
    rows: day.rows.filter(row => (!model || row.modelId === model) && (!member || row.memberId === member)),
  }));
  const rows = filtered.flatMap(day => day.rows);
  const groupIds = (group === "model" ? models : members).map(item => item.id);
  const groupKey = group === "model" ? "modelId" : "memberId";
  return {
    daily: filtered.map(day => ({
      label: day.label,
      ...addUsage(day.rows),
      groups: groupIds.map(id => ({ id, ...addUsage(day.rows.filter(row => row[groupKey] === id)) })),
    })),
    totals: addUsage(rows),
    byModel: models.map(model => ({ model, ...addUsage(rows.filter(row => row.modelId === model.id)) })).filter(row => row.requests > 0),
    byMember: members.map(member => ({ member, ...addUsage(rows.filter(row => row.memberId === member.id)) })).filter(row => row.requests > 0),
  };
}

export function getWeeklyChange(metric: Metric) {
  const previous = summarizeUsage(usage.slice(-14, -7));
  const current = summarizeUsage(usage.slice(-7));
  const value = (totals: typeof previous) => metric === "tokens" ? totals.input + totals.output : totals[metric];
  return value(previous) ? (value(current) - value(previous)) / value(previous) * 100 : null;
}

export function getUsageMix(analysis: ReturnType<typeof getUsageAnalysis>, group: UsageGroup, metric: Metric) {
  const rows = group === "model"
    ? analysis.byModel.map(row => ({ id: row.model.id, name: row.model.name, value: metricValue(row, metric) }))
    : analysis.byMember.map(row => ({ id: row.member.id, name: row.member.name, value: metricValue(row, metric) }));
  const order = (group === "model" ? models : members).map(item => item.id);
  return {
    series: rows.sort((a, b) => b.value - a.value).map(row => ({ ...row, color: seriesColors[order.indexOf(row.id)] })),
    days: analysis.daily.map(day => ({
      label: day.label,
      value: metricValue(day, metric),
      parts: Object.fromEntries(day.groups.map(part => [part.id, metricValue(part, metric)])),
    })),
  };
}
