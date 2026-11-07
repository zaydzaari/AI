"use client";

import { ArrowUp, Check, Copy, Cpu, Database, Gauge, Sparkles, Terminal } from "lucide-react";
import { useState } from "react";
import { BRAND, MODELS, PROMPTS, estimateCost, fmtUSD, type Model, type Variant } from "@/lib/content";
import { suggest } from "@/lib/model-preview";

const getModel = (id: string) => MODELS.find(model => model.id === id) ?? MODELS[0];

function getSuggestion(text: string) {
  const preset = PROMPTS.find(example => example.prompt === text);
  return preset ? { id: preset.model, why: `${preset.label.toLowerCase()} example` } : suggest(text);
}

function ModelOptions({ selected, onSelect, automatic = false }: { selected: string | null; onSelect: (id: string | null) => void; automatic?: boolean }) {
  return (
    <div className="agent-tool-options" role="group" aria-label="Model">
      {automatic && <button type="button" aria-pressed={selected === null} onClick={() => onSelect(null)}>Auto</button>}
      {MODELS.map(model => <button key={model.id} type="button" aria-pressed={selected === model.id} onClick={() => onSelect(model.id)}>{model.name}</button>)}
    </div>
  );
}

function VariantOptions({ model, selected, onSelect }: { model: Model; selected: Variant; onSelect: (variant: Variant) => void }) {
  return (
    <div className="agent-tool-options" role="group" aria-label="Response variant">
      {model.variants.map(variant => <button key={variant} type="button" aria-pressed={selected === variant} onClick={() => onSelect(variant)}>{variant}</button>)}
    </div>
  );
}

type Turn = { prompt: string; response: string; model: string; variant: Variant };

export function AgentConsole() {
  const [input, setInput] = useState("");
  const [pinned, setPinned] = useState<string | null>(null);
  const [variant, setVariant] = useState<Variant>("Standard");
  const [turn, setTurn] = useState<Turn | null>(null);
  const prompt = input.trim() || turn?.prompt || "";
  const suggested = getSuggestion(prompt);
  const model = getModel(pinned ?? suggested.id);
  const activeVariant = model.variants.includes(variant) ? variant : model.variants[0];
  const inputTokens = 600 + Math.ceil(prompt.length / 4);
  const cachedTokens = 300;
  const cost = estimateCost(model, inputTokens, 180, cachedTokens / inputTokens);

  function run(text: string) {
    const message = text.trim();
    if (!message) return;
    const picked = getModel(pinned ?? getSuggestion(message).id);
    const preset = PROMPTS.find(example => example.prompt === message);
    setTurn({
      prompt: message,
      response: preset?.response ?? "This preview shows the model selection and usage estimate. Choose a suggested prompt to see a sample reply.",
      model: picked.name,
      variant: picked.variants.includes(variant) ? variant : picked.variants[0],
    });
    setInput("");
  }

  return (
    <>
      <div className="agent-console">
        <div className="agent-console-bar">
          <p><Terminal size={17} aria-hidden /> Prompt console</p>
          <ModelOptions selected={pinned} onSelect={setPinned} automatic />
        </div>
        <div className="agent-console-body" data-has-turn={Boolean(turn)}>
          <div className="agent-console-output" aria-live="polite">
            {turn ? (
              <>
                <p className="agent-console-prompt">{turn.prompt}</p>
                <p className="agent-console-reply"><strong>{turn.model} · {turn.variant} · Sample reply</strong>{turn.response}</p>
              </>
            ) : (
              <div className="agent-console-empty"><Sparkles size={23} aria-hidden /><p>Type a prompt to see which model fits.</p></div>
            )}
          </div>
          <div className="agent-tool-options agent-console-presets" role="group" aria-label="Sample prompts">
            {PROMPTS.map(example => <button key={example.label} type="button" onClick={() => run(example.prompt)}>{example.label}</button>)}
          </div>
        </div>
        <form className="agent-console-form" onSubmit={event => { event.preventDefault(); run(input); }}>
          <label htmlFor="agent-console-input">Your prompt</label>
          <div className="agent-console-entry">
            <input id="agent-console-input" value={input} onChange={event => setInput(event.target.value)} maxLength={600} placeholder="Try ‘refactor my fetch code’" />
            <button type="submit" aria-label="Run prompt preview" disabled={!input.trim()}><ArrowUp size={18} aria-hidden /></button>
          </div>
          <div className="agent-console-status">
            <p role="status"><Sparkles size={14} aria-hidden /><span><strong>{model.name}</strong> · {pinned ? "Pinned model" : suggested.why}</span></p>
            <VariantOptions model={model} selected={activeVariant} onSelect={setVariant} />
          </div>
        </form>
      </div>
      <dl className="agent-console-metrics">
        <div><dt><Gauge size={16} aria-hidden /> Context used</dt><dd><strong>{inputTokens.toLocaleString("en-US")}</strong><span>of {model.context} tokens</span><progress aria-label="Estimated context used" value={inputTokens} max={model.contextK * 1000} /></dd></div>
        <div><dt><Database size={16} aria-hidden /> Cached prefix</dt><dd><strong>{cachedTokens}</strong><span>estimated reused tokens</span></dd></div>
        <div><dt><Cpu size={16} aria-hidden /> Next turn cost</dt><dd><strong>{fmtUSD(cost)}</strong><span>at sample rates</span></dd></div>
      </dl>
      <p className="agent-tool-note">Local preview with sample replies. Estimates assume a 600-token setup, a 300-token cached prefix and a 180-token reply.</p>
    </>
  );
}

export function AgentRequestBuilder() {
  const [model, setModel] = useState(() => getModel("forge"));
  const [variant, setVariant] = useState<Variant>("Standard");
  const [stream, setStream] = useState(true);
  const [cache, setCache] = useState(true);
  const [copying, setCopying] = useState(false);
  const [notice, setNotice] = useState<{ code: string; ok: boolean } | null>(null);
  const activeVariant = model.variants.includes(variant) ? variant : model.variants[0];
  const modelId = `${model.id}-${model.context.toLowerCase()}${activeVariant === "Standard" ? "" : `:${activeVariant.toLowerCase()}`}`;
  const body = { model: modelId, stream, ...(cache ? { cache: { prefix: true } } : {}), messages: [{ role: "user", content: "Hello" }] };
  const fields = Object.entries(body).map(([key, value]) => `    ${JSON.stringify(key)}: ${JSON.stringify(value)}`);
  const code = [
    `curl ${BRAND.apiBase}/chat/completions \\`,
    `  -H "Authorization: Bearer $${BRAND.envKey}" \\`,
    '  -H "Content-Type: application/json" \\',
    `  -d '{\n${fields.join(",\n")}\n  }'`,
  ].join("\n");
  const activeNotice = notice?.code === code ? notice : null;

  async function copyRequest() {
    setCopying(true);
    setNotice(null);
    try {
      await navigator.clipboard.writeText(code);
      setNotice({ code, ok: true });
    } catch {
      setNotice({ code, ok: false });
    } finally {
      setCopying(false);
    }
  }

  return (
    <div className="agent-request">
      <div className="agent-request-controls">
        <div><p>Model</p><ModelOptions selected={model.id} onSelect={id => setModel(getModel(id ?? "forge"))} /></div>
        <div><p>Variant</p><VariantOptions model={model} selected={activeVariant} onSelect={setVariant} /></div>
        <div className="agent-request-switches">
          <label>Stream tokens <input type="checkbox" role="switch" checked={stream} onChange={event => setStream(event.target.checked)} /><span aria-hidden /></label>
          <label>Prompt caching <input type="checkbox" role="switch" checked={cache} onChange={event => setCache(event.target.checked)} /><span aria-hidden /></label>
        </div>
      </div>
      <div className="agent-request-code">
        <div className="agent-request-bar">
          <span><Terminal size={16} aria-hidden /> cURL</span>
          <button type="button" onClick={copyRequest} disabled={copying} aria-label="Copy request">{activeNotice?.ok ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}{copying ? "Copying…" : activeNotice?.ok ? "Copied" : "Copy"}</button>
        </div>
        <pre><code>{code}</code></pre>
        <p className="agent-request-note" role="status">{activeNotice ? activeNotice.ok ? "Request copied to clipboard." : "Select the code to copy it manually." : "Example endpoint · placeholder API key"}</p>
      </div>
    </div>
  );
}
