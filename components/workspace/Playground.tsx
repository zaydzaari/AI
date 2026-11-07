"use client";

import { ArrowUp, MessageSquare, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { isValidElement, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Markdown from "react-markdown";
import { examplePrompts, getModel, type ChatMessage } from "./fixtures";
import { mockReply } from "./mock";
import { useWorkspace } from "./WorkspaceShell";
import { Badge, Button, CodeBlock, CopyButton, Dialog, Empty, ModelSelect, PageTitle, Skeleton } from "./ui";

type ReplyJob = { conversation: string; message: ChatMessage };

function MarkdownMessage({ text }: { text: string }) {
  return <div className="aw-markdown"><Markdown skipHtml components={{
    pre: ({ children }) => {
      if (!isValidElement<{ children?: ReactNode; className?: string }>(children)) return <pre>{children}</pre>;
      return <CodeBlock text={String(children.props.children ?? "").trimEnd()} label={children.props.className?.replace("language-", "") ?? "Code"} />;
    },
  }}>{text}</Markdown></div>;
}

export function Playground() {
  const query = useSearchParams();
  const { conversations, setConversations } = useWorkspace();
  const [selected, setSelected] = useState(conversations[0]?.id);
  const [model, setModel] = useState(() => getModel(query.get("model") ?? "glm").id);
  const [prompt, setPrompt] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const [job, setJob] = useState<ReplyJob | null>(null);
  const [stream, setStream] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);
  const conversation = conversations.find(item => item.id === selected) ?? conversations[0];
  const messages = conversation?.messages ?? [];
  const currentJob = job && job.conversation === conversation?.id ? job : null;

  useEffect(() => {
    if (!job) return;
    const words = job.message.text.split(/(\s+)/);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let position = 0;
    const timer = window.setInterval(() => {
      position += reduced ? words.length : 7;
      if (position < words.length) {
        setStream(words.slice(0, position).join(""));
        return;
      }
      window.clearInterval(timer);
      setConversations(items => items.map(item => item.id === job.conversation ? { ...item, messages: [...item.messages, job.message] } : item));
      setJob(null);
    }, reduced ? 120 : 85);
    return () => window.clearInterval(timer);
  }, [job, setConversations]);

  useEffect(() => {
    const thread = threadRef.current;
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, [messages.length, stream, selected]);

  function newConversation() {
    const id = crypto.randomUUID();
    setConversations(items => [{ id, title: "New conversation", messages: [] }, ...items]);
    setSelected(id);
    setPrompt("");
  }

  function send(text: string, regenerate = false) {
    const value = text.trim();
    if (!value || job || !conversation) return;
    const message: ChatMessage = { id: crypto.randomUUID(), role: "user", text: value };
    setConversations(items => items.map(item => {
      if (item.id !== conversation.id) return item;
      const last = item.messages.at(-1);
      const next = regenerate ? last?.role === "assistant" ? item.messages.slice(0, -1) : item.messages : [...item.messages, message];
      return { ...item, title: item.messages.length ? item.title : value.slice(0, 44), messages: next };
    }));
    setStream("");
    setJob({ conversation: conversation.id, message: { id: crypto.randomUUID(), role: "assistant", text: mockReply(value), model: getModel(model).name } });
    setPrompt("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send(prompt);
  }

  function clearConversation() {
    if (currentJob) setJob(null);
    setConversations(items => items.map(item => item.id === conversation?.id ? { ...item, title: "New conversation", messages: [] } : item));
    setPrompt("");
    setConfirmClear(false);
  }

  const lastPrompt = messages.findLast(message => message.role === "user")?.text;
  const lastMessageId = messages.at(-1)?.id;

  return <div className="aw-page aw-playground-page">
    <PageTitle title="Playground" description="Try a prompt, switch models, and read a simulated reply" />
    <div className="aw-workbench aw-playground">
      <aside className="aw-workbench-rail" aria-label="Conversations">
        <Button onClick={newConversation}><Plus size={17} /> New conversation</Button>
        <p>Conversations</p>
        <div className="aw-workbench-history">{conversations.map(item => <button key={item.id} type="button" aria-pressed={conversation?.id === item.id} onClick={() => { setSelected(item.id); setPrompt(""); }}><MessageSquare size={16} /><span>{item.title}</span></button>)}</div>
      </aside>
      <section className="aw-chat" aria-label="Chat workspace">
        <header className="aw-workbench-bar"><ModelSelect value={model} onChange={id => setModel(getModel(id).id)} /><Button tone="quiet" aria-label="Clear conversation" disabled={!messages.length && !currentJob} onClick={() => setConfirmClear(true)}><Trash2 size={16} /> <span className="aw-hide-phone">Clear conversation</span></Button></header>
        <div className="aw-chat-thread" ref={threadRef} tabIndex={0} aria-label="Conversation messages">
          {!messages.length && <Empty icon={MessageSquare} title="Start a conversation" detail="Enter a prompt or choose a sample to see a reply" />}
          {messages.map(message => <div className={`aw-message aw-message-${message.role}`} key={message.id}>
            <div className="aw-message-meta"><strong>{message.role === "user" ? "You" : message.model}</strong>{message.role === "assistant" && <Badge>Simulated</Badge>}</div>
            {message.role === "assistant" ? <MarkdownMessage text={message.text} /> : <p>{message.text}</p>}
            <div className="aw-message-actions"><CopyButton text={message.text} title={message.role === "user" ? "Copy prompt" : "Copy response"} />
              {message.role === "assistant" && message.id === lastMessageId && lastPrompt && <Button tone="quiet" disabled={Boolean(job)} onClick={() => send(lastPrompt, true)}><RotateCcw size={15} /> Regenerate</Button>}
            </div>
          </div>)}
          {currentJob && <div className="aw-message aw-message-assistant" aria-busy="true"><div className="aw-message-meta"><strong>{currentJob.message.model}</strong><Badge tone="blue">Streaming demo</Badge></div>{stream ? <MarkdownMessage text={stream} /> : <Skeleton label="Preparing a sample reply" />}</div>}
          <span className="sr-only" role="status">{currentJob ? "Generating a simulated response" : messages.at(-1)?.role === "assistant" ? "Sample response ready" : ""}</span>
        </div>
        <form className="aw-composer" onSubmit={submit}>
          <div className="aw-prompt-chips" aria-label="Example prompts">{examplePrompts.map(example => <button key={example.label} type="button" disabled={Boolean(job)} onClick={() => send(example.text)}>{example.label}</button>)}</div>
          <div><label className="sr-only" htmlFor="aw-prompt">Your prompt</label><textarea id="aw-prompt" rows={2} value={prompt} maxLength={2000} onChange={event => setPrompt(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); send(prompt); } }} placeholder="Ask a question or describe a task…" /><Button tone="primary" className="aw-icon-button" type="submit" aria-label="Send prompt" disabled={Boolean(job) || !prompt.trim()}><ArrowUp size={19} /></Button></div>
          <p>Local preview with sample responses.</p>
        </form>
      </section>
    </div>
    {confirmClear && <Dialog title="Clear this conversation?" onClose={() => setConfirmClear(false)}><p className="aw-muted">This removes the messages from the selected demo conversation.</p><div className="aw-dialog-actions"><Button onClick={() => setConfirmClear(false)}>Cancel</Button><Button tone="danger" onClick={clearConversation}>Clear messages</Button></div></Dialog>}
  </div>;
}
