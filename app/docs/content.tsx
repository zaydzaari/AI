import type { ReactNode } from "react";
import Link from "next/link";
import { BRAND, MODELS } from "@/lib/content";
import { CodeExample } from "./CodeExample";

type DocSection = { id: string; title: string; body: ReactNode };
type DocArticle = { slug: string; title: string; summary: string; group: string; sections: DocSection[] };

const { apiBase, envKey } = BRAND;
const exampleModel = "core-128k";
const message = "Give me three questions for a project review.";

function curlExample(stream = false) {
  return `curl ${stream ? "-N " : ""}${apiBase}/chat/completions \\
  -H "Authorization: Bearer $${envKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${exampleModel}",
    "messages": [{ "role": "user", "content": "${message}" }]${stream ? ',\n    "stream": true' : ""}
  }'`;
}

const pythonSetup = `import os
from openai import OpenAI

client = OpenAI(
    base_url="${apiBase}",
    api_key=os.environ["${envKey}"],
)`;

const pythonCompletion = `${pythonSetup}

response = client.chat.completions.create(
    model="${exampleModel}",
    messages=[{"role": "user", "content": "${message}"}],
)
print(response.choices[0].message.content)`;

const pythonStream = `${pythonSetup}

chunks = client.chat.completions.create(
    model="${exampleModel}",
    messages=[{"role": "user", "content": "${message}"}],
    stream=True,
)

for chunk in chunks:
    if chunk.choices:
        text = chunk.choices[0].delta.content
        if text:
            print(text, end="", flush=True)`;

const responseExample = `{
  "id": "chatcmpl_example",
  "object": "chat.completion",
  "model": "${exampleModel}",
  "choices": [{
    "index": 0,
    "message": { "role": "assistant", "content": "What changed since the last review?" },
    "finish_reason": "stop"
  }]
}`;

export const articles: DocArticle[] = [
  {
    slug: "", title: "Quickstart", group: "Get started",
    summary: "See how to make a first chat completion request using cURL or the OpenAI Python client.",
    sections: [
      { id: "before-you-start", title: "Before you start", body: <p>A live integration needs a service URL, an issued API key, and a model ID available to that key. The examples use <code>{apiBase}</code> and <code>{exampleModel}</code> so you can review the intended request format today.</p> },
      { id: "first-request", title: "Make a request with cURL", body: <><p>Set <code>{envKey}</code> in your environment, then pass it in the bearer header. See <Link href="/docs/authentication">Authentication</Link> for key handling.</p><CodeExample label="cURL" code={curlExample()} /></> },
      { id: "python", title: "Use the Python client", body: <><p>Install the <code>openai</code> package and configure the client with the service’s versioned base URL. The SDK adds <code>/chat/completions</code> to it.</p><CodeExample label="Install command" code="python -m pip install openai" /><CodeExample label="Python" code={pythonCompletion} /></> },
      { id: "next-steps", title: "Next steps", body: <p>See the <Link href="/docs/chat-completions">request and response fields</Link>, or open the <Link href="/designs/agent#api">request builder</Link> to change options and preview the generated cURL.</p> },
    ],
  },
  {
    slug: "authentication", title: "Authentication", group: "Get started",
    summary: "Configure a server-side API key and send it as a bearer token.",
    sections: [
      { id: "api-key", title: "Set your API key", body: <><p>Use a key issued for the environment you are calling. Store it in your server’s secret store or environment. The examples read <code>{envKey}</code> from the environment.</p><CodeExample label="Shell" code={`export ${envKey}="replace-with-your-issued-key"`} /></> },
      { id: "bearer-header", title: "Send the bearer header", body: <><CodeExample label="HTTP header" code="Authorization: Bearer YOUR_API_KEY" /><p>With the OpenAI client, supply the key when creating the client and it will populate this header for you.</p></> },
      { id: "check-your-setup", title: "Check your setup", body: <ul><li>Keep keys out of client-side JavaScript, source control, logs, and screenshots.</li><li>If a request fails authentication, check that the key is present and belongs to the host you are calling.</li><li>If a key is exposed, revoke it and replace it wherever your application uses it.</li></ul> },
    ],
  },
  {
    slug: "chat-completions", title: "Chat Completions", group: "API reference",
    summary: "Review the proposed OpenAI-compatible request and response for text generation.",
    sections: [
      { id: "endpoint", title: "Endpoint", body: <><p className="doc-endpoint"><strong>POST</strong> <code>/v1/chat/completions</code></p><p>Send a JSON body with a model and an ordered list of messages. Use the <Link href="/docs/authentication">bearer header</Link> to pass the key.</p></> },
      { id: "request-fields", title: "Request fields", body: <div className="doc-table"><table><thead><tr><th scope="col">Field</th><th scope="col">Type</th><th scope="col">Description</th></tr></thead><tbody>
        <tr><td><code>model</code></td><td>string</td><td>Required. Model ID from the <Link href="/docs/models">model catalogue</Link>.</td></tr>
        <tr><td><code>messages</code></td><td>array</td><td>Required. Ordered messages with a <code>role</code> and text <code>content</code>.</td></tr>
        <tr><td><code>stream</code></td><td>boolean</td><td>Set to <code>true</code> to request <Link href="/docs/streaming">streaming output</Link>.</td></tr>
        <tr><td><code>cache</code></td><td>object</td><td>Optional extension shown in the <Link href="/docs/prompt-caching">caching preview</Link>.</td></tr>
      </tbody></table></div> },
      { id: "example-response", title: "Example response", body: <><p>For the sample non-streaming response, read the assistant’s text at <code>choices[0].message.content</code>.</p><CodeExample label="Sample JSON" code={responseExample} /></> },
    ],
  },
  {
    slug: "models", title: "Models", group: "API reference",
    summary: "Compare the example model families used in the Aether playground.",
    sections: [
      { id: "catalogue", title: "Sample catalogue", body: <><p>These IDs and context sizes match the local request builder. A production catalogue will determine actual model availability and limits.</p><div className="doc-table"><table><thead><tr><th scope="col">Family</th><th scope="col">Model ID</th><th scope="col">Context</th><th scope="col">Use case</th></tr></thead><tbody>{MODELS.map(model => <tr key={model.id}><td>{model.name}</td><td><code>{model.id}-{model.context.toLowerCase()}{model.variants.includes("Standard") ? "" : `:${model.variants[0].toLowerCase()}`}</code></td><td>{model.context}</td><td>{model.role}</td></tr>)}</tbody></table></div></> },
      { id: "variants", title: "Response variants", body: <p>In the preview, the standard variant uses the base ID. The request builder appends a suffix for other variants, such as <code>forge-256k:low-refusal</code>. Available choices depend on the model.</p> },
      { id: "try-a-model", title: "Try a model", body: <p>Use the <Link href="/designs/agent#console">prompt console</Link> to see a model suggestion and compare sample usage estimates.</p> },
    ],
  },
  {
    slug: "streaming", title: "Streaming", group: "Capabilities",
    summary: "Read an answer as it is generated, one text chunk at a time.",
    sections: [
      { id: "enable-streaming", title: "Enable streaming", body: <><p>Set <code>stream</code> to <code>true</code>. In cURL, <code>-N</code> disables output buffering so chunks can appear as they arrive.</p><CodeExample label="cURL" code={curlExample(true)} /></> },
      { id: "read-chunks", title: "Read text chunks", body: <><p>In the proposed Chat Completions stream, the SDK exposes incremental text at <code>choices[0].delta.content</code>. Check that the chunk contains a choice and text before appending it.</p><CodeExample label="Python" code={pythonStream} /></> },
      { id: "interrupted-streams", title: "Handle an interrupted stream", body: <p>Keep the text you already received. If the connection closes before completion, mark the reply as incomplete and let the user decide whether to retry.</p> },
    ],
  },
  {
    slug: "prompt-caching", title: "Prompt caching", group: "Capabilities",
    summary: "Understand what a reusable prompt prefix is and how the preview represents it.",
    sections: [
      { id: "prefix", title: "Keep the prefix stable", body: <p>A prefix is the start of the input. Place reusable instructions and fixed context first, then put the part that changes at the end. Editing an earlier message changes the prefix from that point on.</p> },
      { id: "request-option", title: "Preview the request option", body: <><p>Turning on prompt caching in the <Link href="/designs/agent#api">request builder</Link> adds this sample field. The final API’s caching defaults and model support still need to be confirmed.</p><CodeExample label="Sample JSON field" code={'"cache": { "prefix": true }'} /></> },
      { id: "usage", title: "Read the estimate", body: <p>The console assumes a 300-token cached prefix and uses sample rates for its next-turn estimate. This value describes the demo calculation. Actual reuse and billing would come from production usage data.</p> },
    ],
  },
  {
    slug: "openhands", title: "OpenHands", group: "Integrations",
    summary: "Review an example configuration for a custom OpenAI-compatible endpoint in OpenHands.",
    sections: [
      { id: "configuration", title: "Configure the endpoint", body: <><p>In OpenHands, open the advanced settings for a custom LLM endpoint. Use the model name, versioned base URL, and key for the same environment.</p><div className="doc-table"><table><thead><tr><th scope="col">Setting</th><th scope="col">Example value</th></tr></thead><tbody><tr><td>Custom model</td><td><code>openai/forge-256k</code></td></tr><tr><td>Base URL</td><td><code>{apiBase}</code></td></tr><tr><td>API key</td><td>Use an issued key from your secret store.</td></tr></tbody></table></div><p>The first <code>openai/</code> selects the compatible adapter. The remaining value is the model ID sent to the service.</p></> },
      { id: "verify", title: "Verify the connection", body: <p>Once you have a live endpoint, replace the quickstart’s <code>{exampleModel}</code> with your chosen model ID, such as <code>forge-256k</code>. Run the <Link href="/docs#first-request">quickstart request</Link> before testing a small coding task in OpenHands. This setup awaits a live compatibility test.</p> },
    ],
  },
];

export function docHref(slug: string) {
  return slug ? `/docs/${slug}` : "/docs";
}
