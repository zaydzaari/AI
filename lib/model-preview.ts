/** A local prompt heuristic shared by the model previews. */
export function suggest(text: string): { id: string; why: string } {
  const t = text.toLowerCase();
  if (/(code|bug|refactor|test|function|repo|typescript|python)/.test(t)) return { id: "forge", why: "looks like code" };
  if (/(pdf|files|document|contract|book|archive|long|repo-wide|all \d+)/.test(t)) return { id: "atlas", why: "large inputs" };
  if (/(villain|dark|uncensored|no filter|graphic|red.?team|edgy)/.test(t)) return { id: "unbound", why: "fewer refusals" };
  if (/(quick|short|tl;?dr|one line|classify|extract)/.test(t)) return { id: "swift", why: "short & fast" };
  return { id: "core", why: "general purpose" };
}
