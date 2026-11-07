import type { Metadata } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, FileText, FolderOpen } from "lucide-react";
import Link from "next/link";
import { AgentConsole, AgentRequestBuilder } from "@/components/designs/agent/AgentTools";
import { AgentReview, AgentWorkspace } from "@/components/designs/agent/AgentWorkspace";
import { meetingSources } from "@/components/designs/agent/meetingSources";
import { BrandWordmark } from "@/components/system/Brand";
import { FinalCTA } from "@/components/system";
import { MODELS } from "@/lib/content";
import "./agent.css";
import "./agent-tools.css";

export const metadata: Metadata = {
  title: "Aether Agent — Personal agent concept",
  description: "Explore a personal agent workspace for planning, research and writing.",
};

const workflow = [
  { title: "Give it a task.", text: "Describe the outcome you want. Add the notes, files or constraints that should shape the result." },
  { title: "Follow the work.", text: "See the steps alongside the original request and the sources that informed the result." },
  { title: "Review the result.", text: "Get something you can use, such as a brief, a comparison or a draft. Decide what happens next." },
];

const questions = [
  ["What can I try on this page?", "Switch between the Plan, Research and Write examples in the workspace. Each shows a different request, the steps the agent took and a sample result you can open."],
  ["How does the agent get context?", "The concept gives each task its own set of sources. You can see which notes or files belong to a task before reviewing what the agent produced."],
  ["Can the agent send or publish work on its own?", "This design puts an explicit review step before actions that affect other people. The preview uses sample data and sends nothing."],
  ["Where does model choice fit?", "Aether is designed around multiple model families. The agent workspace keeps the task and its sources together while you choose a model suited to the work."],
];

export default function AgentPage() {
  return (
    <div className="agent-page" id="top">
      <a className="agent-skip" href="#main">Skip to content</a>
      <header className="agent-header">
        <div className="agent-container agent-nav">
          <a href="#top" className="agent-brand" aria-label="Aether, top of page"><BrandWordmark /></a>
          <nav aria-label="Primary"><a href="#workspace">Workspace</a><a href="#how">How it works</a><a href="#control">Your control</a><a href="#console">Playground</a><Link href="/docs">Docs</Link></nav>
          <div className="agent-nav-entry"><Link className="agent-nav-access" href="/login">Sign in</Link><Link className="agent-nav-access" href="/dashboard">Open app <ArrowUpRight size={16} aria-hidden /></Link></div>
        </div>
      </header>

      <main id="main">
        <section className="agent-hero" aria-labelledby="agent-title">
          <div className="agent-container agent-hero-grid">
            <div className="agent-hero-copy">
              <h1 id="agent-title">Meet your<br /> personal agent.</h1>
              <div className="agent-hero-intro">
                <p>Give Aether a task and the files that matter. See how it works through the request and brings the result back for your review.</p>
                <div className="agent-hero-actions">
                  <a className="agent-button" href="#workspace">Try the workspace <ArrowDown size={17} aria-hidden /></a>
                  <a className="agent-link" href="#how">How it works <ArrowRight size={16} aria-hidden /></a>
                </div>
              </div>
            </div>
            <AgentWorkspace />
          </div>
        </section>

        <section className="agent-section agent-workflow" id="how" aria-labelledby="how-title">
          <div className="agent-container">
            <div className="agent-section-head">
              <h2 id="how-title">From request to result.</h2>
              <p>Aether gives the work a place to happen, with a clear path from what you asked for to what’s ready to use.</p>
            </div>
            <ol className="agent-steps" role="list">
              {workflow.map((step, index) => <li key={step.title}>
                <span aria-hidden className="agent-step-number">0{index + 1}</span>
                <h3>{step.title}</h3><p>{step.text}</p>
              </li>)}
            </ol>
          </div>
        </section>

        <section className="agent-section agent-context" id="context" aria-labelledby="context-title">
          <div className="agent-container agent-split">
            <div className="agent-context-copy">
              <h2 id="context-title">Give it the whole picture.</h2>
              <p>A short prompt can start the task. Meeting notes, a project brief or a reference file give your agent the details that make the result specific to your work.</p>
              <a className="agent-link" href="#workspace">Explore a sample task <ArrowRight size={16} aria-hidden /></a>
            </div>
            <figure className="agent-sheet">
              <figcaption className="agent-sheet-heading"><FolderOpen size={20} aria-hidden /> Context for Tuesday’s meeting</figcaption>
              <ul role="list" className="agent-files">
                {meetingSources.map(source => <li key={source.name}><FileText size={18} aria-hidden /><div><strong>{source.name}</strong><span>{source.description}</span></div><span className="agent-file-type">{source.type}</span></li>)}
              </ul>
              <p className="agent-sheet-note"><Check size={15} aria-hidden /> The sample meeting brief uses all three sources.</p>
            </figure>
          </div>
        </section>

        <section className="agent-section agent-review-section" id="control" aria-labelledby="control-title">
          <div className="agent-container agent-split agent-review-grid">
            <div className="agent-review-copy">
              <h2 id="control-title">It does the prep. You make the call.</h2>
              <p>Review what the agent used and what it produced. A draft can stay a draft until you’re ready to take the next step.</p>
            </div>
            <AgentReview />
          </div>
        </section>

        <section className="agent-section" id="models" aria-labelledby="model-title">
          <div className="agent-container agent-split">
            <div className="agent-context-copy">
              <h2 id="model-title">Different models. One workspace.</h2>
              <p>Choose a model suited to the task. The conversation and its sources stay together as the work changes.</p>
              <a className="agent-link" href="#console">Try the prompt console <ArrowRight size={16} aria-hidden /></a>
            </div>
            <dl className="agent-models">
              {MODELS.filter(model => ["core", "forge", "atlas"].includes(model.id)).map(model => <div key={model.id}>
                <dt>{model.name}</dt><dd>{model.role}</dd>
              </div>)}
            </dl>
          </div>
        </section>

        <section className="agent-section agent-playground" id="console" aria-labelledby="console-title">
          <div className="agent-container">
            <div className="agent-tool-heading">
              <div className="agent-section-head">
                <h2 id="console-title">Find a model for your task.</h2>
                <p>Type a prompt or pick an example. See the model suggestion, context used and estimated cost for the next turn.</p>
              </div>
              <a className="agent-link" href="#api">Build an API request <ArrowDown size={16} aria-hidden /></a>
            </div>
            <AgentConsole />
          </div>
        </section>

        <section className="agent-section agent-builder" id="api" aria-labelledby="api-title">
          <div className="agent-container">
            <div className="agent-section-head">
              <h2 id="api-title">Build your first request.</h2>
              <p>Choose a model, set streaming and caching, and copy the matching cURL example.</p>
              <Link className="agent-link" href="/docs">Read the API docs <ArrowRight size={16} aria-hidden /></Link>
            </div>
            <AgentRequestBuilder />
          </div>
        </section>

        <section className="agent-section agent-faq" id="faq" aria-labelledby="faq-title">
          <div className="agent-container agent-split">
            <h2 id="faq-title">Questions about Aether Agent.</h2>
            <div className="agent-questions">
              {questions.map(([question, answer]) => <details key={question}>
                <summary>{question}<ChevronDown size={19} aria-hidden /></summary><p>{answer}</p>
              </details>)}
            </div>
          </div>
        </section>

        <FinalCTA title="What’s your next task?" lead="Leave your email to preview the early-access flow." />
      </main>

      <footer className="agent-footer"><div className="agent-container">
        <a className="agent-brand" href="#top"><BrandWordmark /></a>
        <p>Personal agent concept · local preview</p>
        <Link className="agent-link" href="/designs">Design gallery <ArrowUpRight size={15} aria-hidden /></Link>
      </div></footer>
    </div>
  );
}
