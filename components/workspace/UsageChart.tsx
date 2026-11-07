import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, type KeyboardEvent, type MouseEvent } from "react";
import { Segments } from "./ui";
import { metrics, type getUsageMix, type Metric, type UsageGroup } from "./usageAnalytics";

type Mix = ReturnType<typeof getUsageMix>;
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const scopes = ["Period", "Day"] as const;
const width = 700;
const height = 200;
const ticks = [1, .75, .5, .25, 0];

export function UsageChart({ mix, metric, group, hrefFor }: { mix: Mix; metric: Metric; group: UsageGroup; hrefFor: (id: string, day?: string) => string | undefined }) {
  const { days, series } = mix;
  const last = days.length - 1;
  const [selected, setSelected] = useState(last);
  const [hovered, setHovered] = useState<number | null>(null);
  const [scope, setScope] = useState<(typeof scopes)[number]>("Period");
  if (!days.length || !series.length) return <p className="aw-muted">No sample usage matches these filters.</p>;

  const { label, format } = metrics[metric];
  const current = Math.max(0, Math.min(selected, last));
  const active = Math.max(0, Math.min(hovered ?? current, last));
  const day = days[active];
  const periodTotal = series.reduce((total, item) => total + item.value, 0);
  const breakdownTotal = scope === "Day" ? day.value : periodTotal;
  const slot = width / days.length;
  const bar = Math.min(66, slot * .73);
  const scale = metric === "cost" ? 10_000 : 1;
  const rawStep = Math.max(1, Math.max(...days.map(item => item.value)) * scale / 4);
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const step = [1, 2, 2.5, 3, 5, 10].map(factor => factor * magnitude).find(value => value >= rawStep && Number.isInteger(value)) ?? 10 * magnitude;
  const max = step * 4 / scale;
  const dates = [...new Set([0, Math.floor(last / 2), last])];
  const describe = (value: number) => metric === "cost" ? format(value) : `${format(value)} ${label.toLowerCase()}`;

  function indexAt(event: MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    return Math.max(0, Math.min(last, Math.floor((event.clientX - bounds.left) / bounds.width * days.length)));
  }

  function selectDay(index: number) {
    if (index < 0 || index > last) return;
    setHovered(null);
    setSelected(index);
    setScope("Day");
  }

  function inspectWithKeyboard(event: KeyboardEvent<HTMLDivElement>) {
    const targets: Record<string, number> = { ArrowLeft: current - 1, ArrowDown: current - 1, ArrowRight: current + 1, ArrowUp: current + 1, Home: 0, End: last };
    if (!(event.key in targets)) return;
    event.preventDefault();
    selectDay(Math.max(0, Math.min(last, targets[event.key])));
  }

  return <div className="aw-mix">
    <figure className="aw-chart" data-metric={metric}>
      <div className="aw-chart-axis-y" aria-hidden="true">
        {ticks.map(part => <span key={part} style={{ top: `${(1 - part) * 100}%` }}>{metric === "cost" ? format(max * part) : compact.format(max * part)}</span>)}
      </div>
      <div className="aw-chart-plot"
        tabIndex={0}
        role="slider"
        aria-label={`Inspect daily ${label.toLowerCase()} by ${group}`}
        aria-valuemin={0}
        aria-valuemax={last}
        aria-valuenow={current}
        aria-valuetext={`${days[current].label}, ${describe(days[current].value)}`}
        onKeyDown={inspectWithKeyboard}
        onPointerMove={event => { if (event.pointerType === "mouse") setHovered(indexAt(event)); }}
        onPointerLeave={() => setHovered(null)}
        onClick={event => selectDay(indexAt(event))}>
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label={`${label} by ${group}, ${days[0].label} through ${days[last].label}. ${describe(periodTotal)}.`}>
          {ticks.map(part => <line key={part} x1="0" x2={width} y1={height * (1 - part)} y2={height * (1 - part)} className="aw-chart-gridline" vectorEffect="non-scaling-stroke" />)}
          <rect x={active * slot} y={0} width={slot} height={height} className="aw-chart-day-band" />
          <g key={`${metric}:${group}`} className="aw-chart-series">
            {days.map((item, index) => {
              let bottom = height;
              return <g key={item.label}>{series.map(part => {
                const size = (item.parts[part.id] ?? 0) / max * height;
                bottom -= size;
                return <rect key={part.id} x={(index + .5) * slot - bar / 2} y={bottom} width={bar} height={size} fill={part.color} />;
              })}</g>;
            })}
          </g>
        </svg>
        {hovered !== null && <div className="aw-chart-tooltip" aria-hidden="true" data-side={active < days.length / 2 ? "after" : "before"} style={{ left: `${(active + .5) / days.length * 100}%` }}>
          <div><strong>{day.label}</strong><span>{describe(day.value)}</span></div>
          {series.map(item => <p key={item.id}><i style={{ background: item.color }} /><span>{item.name}</span><strong>{format(day.parts[item.id] ?? 0)}</strong></p>)}
        </div>}
      </div>
      <div className="aw-chart-axis-x" aria-hidden="true">
        {dates.map(index => <span key={index} style={{ left: `${(index + .5) / days.length * 100}%` }} data-edge={last === 0 ? undefined : index === 0 ? "start" : index === last ? "end" : undefined}>{days[index].label}</span>)}
      </div>
      <figcaption>
        <div className="aw-chart-inspector" role="group" aria-label="Inspect a day">
          <p aria-hidden="true"><span>{day.label}</span><strong>{describe(day.value)}</strong></p>
          <span className="sr-only" role="status">{days[current].label}, {describe(days[current].value)}</span>
          <button type="button" aria-label="Previous day" aria-disabled={current === 0} onClick={() => selectDay(current - 1)}><ChevronLeft size={17} aria-hidden="true" /></button>
          <button type="button" aria-label="Next day" aria-disabled={current === last} onClick={() => selectDay(current + 1)}><ChevronRight size={17} aria-hidden="true" /></button>
        </div>
      </figcaption>
    </figure>

    <section className="aw-mix-readout" aria-label={group === "model" ? "Model share" : "Member share"}>
      <div className="aw-mix-head">
        <div><h3>{group === "model" ? "Model mix" : "Member mix"}</h3><p>{scope === "Day" ? day.label : "Selected period"}</p></div>
        <Segments label="Breakdown range" options={scopes} value={scope} onChange={setScope} />
      </div>
      <ul className="aw-mix-list">
        {series.map(item => {
          const value = scope === "Day" ? day.parts[item.id] ?? 0 : item.value;
          const share = breakdownTotal ? value / breakdownTotal * 100 : 0;
          const href = hrefFor(item.id, scope === "Day" ? day.label : undefined);
          const content = <><div className="aw-mix-row-head"><span className="aw-mix-dot" style={{ background: item.color }} aria-hidden="true" /><strong>{item.name}</strong><span>{format(value)}</span>{href && <ArrowUpRight size={13} aria-hidden="true" />}</div><div className="aw-mix-row-share"><span aria-hidden="true"><i style={{ width: `${share}%`, background: item.color }} /></span><small>{share.toFixed(1)}%</small></div></>;
          return <li key={item.id}>{href ? <Link href={href} title={`View ${item.name} usage for ${scope === "Day" ? day.label : "this period"}`}>{content}</Link> : <div>{content}</div>}</li>;
        })}
      </ul>
    </section>
  </div>;
}
