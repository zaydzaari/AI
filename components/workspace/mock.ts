import { examplePrompts, initialConversations, type DemoKey } from "./fixtures";

export function mockReply(prompt: string) {
  const input = prompt.toLowerCase();
  if (/javascript|code|retry|request/.test(input)) return [
    "### Retry temporary failures", "", "Retry a rate limit or server error. Return other responses to the caller.", "", "```js",
    "const response = await fetch(url);", "if (response.status === 429 || response.status >= 500) {", "  return retry(url);", "}", "return response;", "```", "", "Keep the retry count bounded and add a delay between attempts.",
  ].join("\n");
  if (prompt === examplePrompts[1].text || /plan|prototype/.test(input)) return initialConversations[0].messages[1].text;
  if (/research|provider|compare|summar/.test(input)) return "### What to compare\n\n- **Model fit.** Try the same representative prompts across providers.\n- **Usage.** Estimate input, cached input, and output separately.\n- **Reliability.** Test timeouts, retries, and partial responses.\n\nRecord the tradeoffs before you choose a default.";
  return "### A way to get started\n\n1. Describe the outcome in one sentence.\n2. Add the context or constraints that matter.\n3. Decide what a useful result should include.\n\nThis sample reply shows how a structured answer appears in the playground.";
}

export function makeDemoKey(name: string, permission: string, expiry: string): DemoKey {
  const id = crypto.randomUUID();
  return { id, name, value: `demo_aether_${id.replaceAll("-", "").slice(0, 20)}`, permission, expiry, created: "Just now", lastUsed: "Never", requests: 0 };
}
