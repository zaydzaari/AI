"use client";

import { CalendarDays, Check, ChevronDown, FileSearch, FileText, LockKeyhole, PenLine } from "lucide-react";
import { useState } from "react";
import { BrandWordmark } from "@/components/system/Brand";
import { meetingSources } from "./meetingSources";

const examples = [
  {
    label: "Plan", title: "Prepare a meeting", icon: CalendarDays,
    prompt: "Get me ready for Tuesday’s project review.",
    response: "I’ve prepared a short brief from your project notes.",
    steps: ["Read three sources", "Pulled out the decisions and open questions"],
    sources: meetingSources.map(source => source.name),
    result: "Tuesday project brief", detail: "Agenda and discussion points",
    output: ["Confirm Thursday’s milestone and agree on who owns the open handoff.", "Decide whether the review needs a separate design checkpoint."],
  },
  {
    label: "Research", title: "Compare two options", icon: FileSearch,
    prompt: "Compare the two spaces for our team workshop.",
    response: "I’ve compared the two venues using your requirements.",
    steps: ["Reviewed both venue proposals", "Compared capacity, accessibility and total cost"],
    sources: ["Maple Room proposal", "Station Hall proposal", "Workshop requirements"],
    result: "Workshop venue comparison", detail: "Options and questions to verify",
    output: ["Maple Room fits the group and includes equipment in its rate.", "Station Hall has more breakout space. Confirm step-free access before booking."],
  },
  {
    label: "Write", title: "Draft an update", icon: PenLine,
    prompt: "Turn my notes into a short Friday update for the team.",
    response: "I’ve drafted an update around progress and next steps.",
    steps: ["Grouped the notes into progress and next steps", "Left the open date marked for your review"],
    sources: ["Friday notes", "Design review recap"],
    result: "Friday team update", detail: "Draft for review",
    output: ["This week we finished the first design review and agreed on the next set of changes.", "Next week we’ll share the revised draft. The review date is still to be confirmed."],
  },
] as const;

function SourceList({ sources }: { sources: readonly string[] }) {
  return <ul role="list" className="agent-source-list">{sources.map(source => <li key={source}><FileText size={15} aria-hidden />{source}</li>)}</ul>;
}

export function AgentWorkspace() {
  const [selected, setSelected] = useState(0);
  const example = examples[selected];

  return (
    <figure className="agent-demo" id="workspace" aria-labelledby="workspace-title">
      <div className="agent-window">
        <div className="agent-window-bar">
          <span className="agent-window-name" id="workspace-title"><BrandWordmark>Personal workspace</BrandWordmark></span>
          <span className="agent-window-mode">Interactive demo</span>
        </div>
        <div className="agent-window-grid">
          <div className="agent-window-nav" role="group" aria-label="Example tasks">
            <p>Example tasks</p>
            {examples.map(({ label, title, icon: Icon }, index) => (
              <button key={label} type="button" aria-pressed={selected === index} aria-controls="agent-example" onClick={() => setSelected(index)}>
                <Icon size={16} aria-hidden /><span className="agent-task-title">{title}</span><span className="agent-task-label">{label}</span>
              </button>
            ))}
          </div>
          <div className="agent-window-task" id="agent-example">
            <div className="agent-window-content">
              <div className="agent-thread" aria-live="polite" aria-atomic="true">
                <p className="agent-prompt">{example.prompt}</p>
                <div className="agent-answer">
                  <div className="agent-answer-name"><span aria-hidden><BrandWordmark>{""}</BrandWordmark></span>Aether Agent</div>
                  <p>{example.response}</p>
                  <ul role="list" className="agent-checklist">
                    {example.steps.map(step => <li key={step}><Check size={15} aria-hidden />{step}</li>)}
                  </ul>
                </div>
              </div>
              <details key={example.label} className="agent-result">
                <summary><FileText size={19} aria-hidden /><span><strong>{example.result}</strong><small>{example.detail}</small></span><span className="agent-result-action"><span>Preview</span><ChevronDown size={17} aria-hidden /></span></summary>
                <ul>{example.output.map(line => <li key={line}>{line}</li>)}</ul>
              </details>
              <details key={`${example.label}-sources`} className="agent-inline-sources">
                <summary>Sources used ({example.sources.length}) <ChevronDown size={16} aria-hidden /></summary>
                <SourceList sources={example.sources} />
              </details>
            </div>
            <aside className="agent-task-context" aria-label="Task context">
              <h2>Task context</h2>
              <p>{example.sources.length} sources used</p>
              <SourceList sources={example.sources} />
              <div className="agent-ready"><Check size={16} aria-hidden />Ready for review</div>
            </aside>
          </div>
        </div>
      </div>
      <figcaption>Choose a task to see its sources and sample result.</figcaption>
    </figure>
  );
}

export function AgentReview() {
  const [decision, setDecision] = useState<"draft" | "approved" | null>(null);

  return (
    <figure className="agent-review-sheet">
      <figcaption><LockKeyhole size={16} aria-hidden /> Approval preview</figcaption>
      <h3>Share the meeting brief?</h3>
      <p>The brief is ready. Review the agenda and open questions before sharing it with the project team.</p>
      <div className="agent-review-actions" role="group" aria-label="Example approval decision">
        <button type="button" aria-pressed={decision === "draft"} onClick={() => setDecision("draft")}>Keep as draft</button>
        <button type="button" aria-pressed={decision === "approved"} onClick={() => setDecision("approved")}>Approve in demo</button>
      </div>
      <p role="status" className="agent-review-footnote">{decision === "draft" ? "Kept as a draft in this demo." : decision === "approved" ? "Approved in the demo. Nothing was shared." : "Try either decision. This preview shares nothing."}</p>
    </figure>
  );
}
