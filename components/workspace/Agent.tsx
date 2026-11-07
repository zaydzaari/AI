"use client";

import { useSearchParams } from "next/navigation";
import { ArrowRight, ArrowUpRight, Bot, Check, ChevronDown, Circle, Clock3, FileCode2, FileText, Play, ShieldCheck, Terminal } from "lucide-react";
import { Fragment, useEffect, useRef, useState, type FormEvent } from "react";
import { diffLines, taskSteps, type DemoTask } from "./fixtures";
import { useWorkspace } from "./WorkspaceShell";
import { Button, Card, Empty, Field, Notice, PageTitle, Segments, Skeleton, TaskBadge } from "./ui";

const views = ["Activity", "File changes", "Sources", "Report"] as const;
type TaskView = (typeof views)[number];
type Decision = "Approved" | "Rejected";
const sources = [
  { path: "src/client.ts", lines: "Lines 18–26", note: "Retry path and HTTP status handling" },
  { path: "src/client.test.ts", lines: "Lines 31–48", note: "Fixture coverage for temporary failures" },
  { path: "project.json", lines: "Lines 1–12", note: "Project manifest from the sample repository" },
];

function FilePreview() {
  const added = diffLines.filter(line => line.kind === "add").length;
  const removed = diffLines.filter(line => line.kind === "remove").length;

  return <figure className="aw-diff">
    <figcaption><span><FileCode2 size={16} aria-hidden /> <code>src/client.ts</code></span><span className="aw-diff-count" aria-label={`${added} lines added, ${removed} line removed`}><span>+{added}</span><span>−{removed}</span></span></figcaption>
    <pre><code>{diffLines.map(line => <Fragment key={line.text}>
      <span className={`aw-diff-line aw-diff-${line.kind}`}><span>{line.kind === "context" ? "" : line.text.slice(0, 2)}</span><span>{line.kind === "context" ? line.text : line.text.slice(2)}</span></span>{"\n"}
    </Fragment>)}</code></pre>
  </figure>;
}

export function Agent() {
  const query = useSearchParams();
  const { tasks, setTasks } = useWorkspace();
  const [selected, setSelected] = useState(query.get("task") ?? tasks[0]?.id);
  const [draft, setDraft] = useState("");
  const [chosenView, setChosenView] = useState<TaskView | null>(null);
  const task = tasks.find(item => item.id === selected) ?? tasks[0];
  const awaitingReview = task.status === "Awaiting approval";
  const view = chosenView ?? (awaitingReview ? "File changes" : task.step === 5 ? "Report" : "Activity");
  const running = tasks.find(item => item.status === "Running");
  const runningId = running?.id;
  const runningStep = running?.step;
  const viewHeading = useRef<HTMLHeadingElement>(null);
  const focusOnView = useRef(false);

  useEffect(() => {
    if (focusOnView.current) {
      viewHeading.current?.focus();
      focusOnView.current = false;
    }
  }, [view]);

  useEffect(() => {
    if (!runningId || runningStep === undefined) return;
    const timer = window.setTimeout(() => {
      setTasks(items => items.map(item => {
        if (item.id !== runningId || item.status !== "Running") return item;
        return item.step >= 3 ? { ...item, step: 4, status: "Awaiting approval" } : { ...item, step: item.step + 1 };
      }));
    }, 620);
    return () => window.clearTimeout(timer);
  }, [runningId, runningStep, setTasks]);

  function start(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim() || running) return;
    const item: DemoTask = { id: crypto.randomUUID(), title: draft.trim(), status: "Running", step: 0, time: "Just now" };
    setTasks(items => [item, ...items]);
    setSelected(item.id);
    setChosenView(null);
    setDraft("");
  }

  function openReview() {
    focusOnView.current = true;
    setChosenView("File changes");
  }

  function selectTask(id: string) {
    setSelected(id);
    setChosenView(null);
  }

  function decide(status: Decision) {
    focusOnView.current = true;
    setTasks(items => items.map(item => item.id === task.id && item.status === "Awaiting approval" ? { ...item, status, step: 5 } : item));
    setChosenView(null);
  }

  return <div className="aw-page">
    <PageTitle title="Agent workspace" description="Follow a simulated repository review from task to decision" />
    <Card className="aw-agent-input">
      <form onSubmit={start}>
        <Field label="Task input"><input value={draft} maxLength={180} onChange={event => setDraft(event.target.value)} placeholder="Analyze this project and find bugs" /></Field>
        <Button type="submit" tone="primary" disabled={!draft.trim() || Boolean(running)}><Play size={16} aria-hidden /> {running ? "Running demo task…" : "Run demo task"}</Button>
      </form>
      <div className="aw-agent-input-foot"><button type="button" className="aw-text-link" onClick={() => setDraft("Analyze this project and find bugs")}>Use example task <ArrowUpRight size={14} /></button><span>Runs use the same sample repository and patch.</span></div>
    </Card>
    <div className="aw-workbench aw-agent-workbench">
      <aside className="aw-workbench-rail" aria-label="Task history">
        <p>Task history</p>
        <div className="aw-workbench-history">{tasks.map(item => <button type="button" key={item.id} aria-pressed={task.id === item.id} onClick={() => selectTask(item.id)}><Bot size={16} aria-hidden /><span>{item.title}<small>{item.status} · {item.time}</small></span></button>)}</div>
        <div className="aw-agent-history-select"><Field label="Task history"><select value={task.id} onChange={event => selectTask(event.target.value)}>{tasks.map(item => <option value={item.id} key={item.id}>{item.title} · {item.time}</option>)}</select></Field></div>
      </aside>
      <section className="aw-agent-detail" aria-label="Selected task">
        <div className="aw-agent-heading"><div><h2>{task.title}</h2><p>Sample repository · {task.time}</p></div><span role="status"><TaskBadge status={task.status} /></span></div>
        <ol className="aw-timeline" aria-label="Task status timeline">{taskSteps.map((step, index) => {
          const complete = index < task.step || task.step === 5;
          const active = !complete && index === task.step;
          return <li key={step.title} aria-current={active ? "step" : undefined} data-state={complete ? "done" : active ? "active" : "pending"}><span className="aw-timeline-icon" aria-hidden>{complete ? <Check size={13} /> : active ? <Clock3 size={13} /> : <Circle size={10} />}</span><span>{step.title}<span className="sr-only"> · {complete ? "Completed" : active ? "Current step" : "Pending"}</span></span></li>;
        })}</ol>
        <div className="aw-agent-view-bar"><Segments label="Task view" options={views} value={view} onChange={setChosenView} />{awaitingReview && view !== "File changes" && <button type="button" className="aw-text-link" onClick={openReview}>Review patch <ArrowRight size={15} aria-hidden /></button>}</div>
        <div className="aw-agent-view">
          {view === "Activity" && <div className="aw-agent-activity" key={task.id}>{taskSteps.slice(0, task.status === "Running" ? task.step : task.step + 1).map(step => <details key={step.title}><summary><Terminal size={16} aria-hidden /><strong>{step.title}</strong><span>{step.result}</span><ChevronDown className="aw-activity-chevron" size={15} aria-hidden /></summary><div><p>{step.detail}</p><small>{step.tool} · simulated</small></div></details>)}{task.status === "Running" && <Skeleton label="Simulating the next agent step" />}</div>}
          {view === "File changes" && (task.step >= 4 ? <section className="aw-agent-review" aria-labelledby="aw-patch-heading">
            <div className="aw-agent-review-intro"><h3 id="aw-patch-heading" ref={viewHeading} tabIndex={-1}>Proposed retry fix</h3><p>The retry loop repeats permanent client errors. This patch retries only rate limits (HTTP 429) and server errors (HTTP 5xx).</p></div>
            <div className={awaitingReview ? "aw-agent-review-grid" : undefined}>
              <FilePreview />
              {awaitingReview && <aside className="aw-approval" aria-label="Patch decision"><div className="aw-approval-heading"><ShieldCheck size={19} aria-hidden /><h4>Decide on this patch</h4></div><p>Both choices are simulated. No files will change.</p><div className="aw-actions"><Button tone="primary" onClick={() => decide("Approved")}>Approve patch</Button><Button onClick={() => decide("Rejected")}>Reject patch</Button></div></aside>}
            </div>
          </section> : <Empty icon={FileCode2} title="Patch is being prepared" detail="The change will appear after the repository review" />)}
          {view === "Sources" && (task.step > 0 ? <ul className="aw-source-list">{sources.map(source => <li key={source.path}><FileText size={18} /><div><strong>{source.path}</strong><small>{source.lines} · {source.note}</small></div></li>)}</ul> : <Empty icon={FileText} title="Waiting for source inspection" detail="The demo will list its fixture files here" />)}
          {view === "Report" && (task.step === 5 ? <div className="aw-report"><h3 ref={viewHeading} tabIndex={-1}>Repository review report</h3><Notice tone={task.status === "Rejected" ? "info" : "success"}>{task.status === "Rejected" ? "Patch rejected in the demo." : task.status === "Approved" ? "Patch approved in the demo." : "Demo review completed."}</Notice><p>One finding in <code>src/client.ts</code>. The retry loop repeats permanent client errors. The proposed change limits retries to HTTP 429 and server errors.</p><p className="aw-muted">This report uses fixture data. Your project files were untouched.</p></div> : <Empty icon={FileText} title="Report pending" detail="The report becomes available after the approval decision" />)}
        </div>
      </section>
    </div>
  </div>;
}
