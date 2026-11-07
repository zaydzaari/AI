export const models = [
  { id: "glm", name: "GLM", provider: "Z.ai", category: "General", context: 128000, output: 16000, rates: [0.6, 0.15, 2.4], capabilities: ["Text", "Streaming", "Tool calls"], description: "A balanced starting point for everyday questions, structured summaries, and drafting.", mark: "G", tone: "blue" },
  { id: "deepseek", name: "DeepSeek", provider: "DeepSeek", category: "Reasoning", context: 128000, output: 24000, rates: [0.8, 0.2, 3.2], capabilities: ["Text", "Reasoning", "Streaming"], description: "An example reasoning model for working through multi-step questions and comparing alternatives.", mark: "D", tone: "blue" },
  { id: "qwen", name: "Qwen", provider: "Alibaba Cloud", category: "Coding", context: 64000, output: 12000, rates: [0.4, 0.1, 1.6], capabilities: ["Text", "Code", "Tool calls"], description: "A coding example for reviewing small changes, explaining snippets, and drafting tests.", mark: "Q", tone: "violet" },
  { id: "kimi", name: "Kimi", provider: "Moonshot AI", category: "Long context", context: 256000, output: 32000, rates: [1.1, 0.28, 4.4], capabilities: ["Text", "Long context", "Streaming"], description: "A long-context example for comparing material across documents and extracting decisions.", mark: "K", tone: "navy" },
  { id: "minimax", name: "MiniMax", provider: "MiniMax", category: "General", context: 200000, output: 20000, rates: [0.5, 0.12, 2], capabilities: ["Text", "Streaming", "Tool calls"], description: "A general-purpose example for turning rough notes into polished, reusable drafts.", mark: "M", tone: "mint" },
] as const;

export type ModelExample = (typeof models)[number];
export const getModel = (id: string) => models.find(model => model.id === id) ?? models[0];

const requestPattern = [54, 66, 58, 72, 91, 78, 63, 84, 102, 79, 97, 118, 94, 112, 125, 104, 132, 109, 96, 125, 141, 116, 134, 152, 143, 126, 158, 147, 165, 174];

export const usage = requestPattern.map((requests, day) => {
  const dayModels = models.map((model, index) => {
    const count = index === 0 ? requests - [0.24, 0.19, 0.13, 0.08].reduce((sum, share) => sum + Math.floor(requests * share), 0) : Math.floor(requests * [0, 0.24, 0.19, 0.13, 0.08][index]);
    const input = count * (4600 + index * 750);
    const cached = Math.round(input * (0.26 + (day % 5) * 0.035));
    const output = count * (980 + index * 230);
    const [inputRate, cachedRate, outputRate] = model.rates;
    const cost = ((input - cached) * inputRate + cached * cachedRate + output * outputRate) / 1_000_000;
    return { modelId: model.id, requests: count, input, cached, output, cost };
  });
  return { label: `Oct ${day + 1}`, requests, models: dayModels, cost: dayModels.reduce((sum, row) => sum + row.cost, 0) };
});

export function summarizeUsage(days = usage) {
  const rows = models.map(model => {
    const totals = { requests: 0, input: 0, cached: 0, output: 0, cost: 0 };
    for (const day of days) {
      const row = day.models.find(item => item.modelId === model.id)!;
      totals.requests += row.requests;
      totals.input += row.input;
      totals.cached += row.cached;
      totals.output += row.output;
      totals.cost += row.cost;
    }
    return { model, ...totals };
  });
  const totals = rows.reduce((sum, row) => ({
    requests: sum.requests + row.requests, input: sum.input + row.input, cached: sum.cached + row.cached,
    output: sum.output + row.output, cost: sum.cost + row.cost,
  }), { requests: 0, input: 0, cached: 0, output: 0, cost: 0 });
  return { rows, ...totals };
}

export const monthlyUsage = summarizeUsage();
export const demoCredit = 50;
export const balance = demoCredit - monthlyUsage.cost;
export const count = (value: number) => value.toLocaleString("en-US");
export const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export const plans = [
  { name: "Starter", monthly: 9, audience: "For trying Aether on personal projects.", features: ["Playground and model explorer", "Personal workspace", "Credit allowance to be defined"] },
  { name: "Developer", monthly: 20, audience: "For building and testing integrations.", features: ["Starter features", "API key management", "Model-level usage breakdown"] },
  { name: "Pro", monthly: 49, audience: "For a regular research and coding workflow.", features: ["Developer features", "Agent approval workflow", "Task history and result previews"] },
  { name: "Ultimate", monthly: 99, audience: "For larger individual workloads.", features: ["Pro features", "Expanded credit allowance proposal", "Account and security preferences"] },
] as const;

export type DemoKey = { id: string; name: string; value: string; permission: string; expiry: string; created: string; lastUsed: string; requests: number };
export const initialKeys: DemoKey[] = [
  { id: "notebook", name: "Personal notebook", value: "demo_aether_notebook_48f3", permission: "Inference only", expiry: "30 days", created: "Oct 18, 2026", lastUsed: "Oct 30", requests: 148 },
  { id: "prototype", name: "App prototype", value: "demo_aether_prototype_92e1", permission: "Read only", expiry: "90 days", created: "Oct 8, 2026", lastUsed: "Oct 27", requests: 37 },
];

export const initialProfile = { name: "Mira Chen", email: "mira@example.com", appearance: "Light", activity: true, usage: true, news: false };

export const examplePrompts = [
  { label: "Review a code change", text: "Show me a JavaScript example that retries a failed request." },
  { label: "Plan a project", text: "Give me a short plan for reviewing a product prototype." },
  { label: "Summarize research", text: "Summarize what to check before choosing a model provider." },
];

export type ChatMessage = { id: string; role: "user" | "assistant"; text: string; model?: string };
export type Conversation = { id: string; title: string; messages: ChatMessage[] };
export const initialConversations: Conversation[] = [
  { id: "review", title: "Prototype review", messages: [
    { id: "question", role: "user", text: examplePrompts[1].text },
    { id: "answer", role: "assistant", model: "GLM", text: "### A 30-minute review\n\n1. **Set the scope.** Pick the two flows you want feedback on.\n2. **Watch someone use them.** Capture where they pause or backtrack.\n3. **Choose the next change.** Rank issues by how often they block a task.\n\nEnd with one owner and one next step." },
  ] },
];

export type TaskStatus = "Running" | "Awaiting approval" | "Approved" | "Rejected" | "Completed";
export type DemoTask = { id: string; title: string; status: TaskStatus; step: number; time: string };
export const initialTasks: DemoTask[] = [
  { id: "project-audit", title: "Analyze this project and find bugs", status: "Awaiting approval", step: 4, time: "Today" },
  { id: "retry-audit", title: "Review retry handling", status: "Completed", step: 5, time: "Oct 29" },
];

export const taskSteps = [
  { title: "Inspect project files", tool: "File index", detail: "Read the demo manifest and identified the network client.", result: "4 fixture files inspected" },
  { title: "Search the repository", tool: "Repository search", detail: "Found the retry loop and its test coverage in the example project.", result: "2 matches in the demo repository" },
  { title: "Identify a problem", tool: "Code review", detail: "A permanent client error enters the retry loop and repeats the same request.", result: "1 finding in src/client.ts" },
  { title: "Propose a patch", tool: "Patch preview", detail: "Return client errors immediately. Keep retrying rate limits and temporary failures.", result: "1 proposed file change" },
  { title: "Request approval", tool: "Human review", detail: "The proposed change is ready for a decision.", result: "Approval checkpoint" },
  { title: "Prepare a report", tool: "Result preview", detail: "Summarized the finding and the review outcome.", result: "1 demo report" },
] as const;

export const diffLines = [
  { kind: "context", text: "const response = await request(url);" },
  { kind: "remove", text: "- if (!response.ok) return retry(url);" },
  { kind: "add", text: "+ const { status } = response;" },
  { kind: "add", text: "+ if (status === 429 || (status >= 500 && status < 600)) {" },
  { kind: "add", text: "+   return retry(url);" },
  { kind: "add", text: "+ }" },
  { kind: "context", text: "return response;" },
] as const;
