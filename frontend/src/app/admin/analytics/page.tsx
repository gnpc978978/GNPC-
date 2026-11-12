"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Clock3,
  Download,
  Eye,
  Globe2,
  Monitor,
  RefreshCw,
  Smartphone,
  Tablet,
  Users,
  UserRoundCheck,
} from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { authenticatedApiFetch, responseJson } from "@/services/api";

type TrendPoint = { date: string; pageViews: number; uniqueVisitors: number };
type Breakdown = { name: string; count: number };
type PageRow = { path: string; pageViews: number; uniqueVisitors: number };
type FeatureRow = { type: string; label: string; count: number };
type Journey = {
  session: string;
  entryPath: string;
  currentPath: string;
  firstSeenAt: string;
  lastSeenAt: string;
  deviceType: string;
  referrerSource: string;
  steps: { type: string; path: string; label: string; at: string }[];
};
type AnalyticsData = {
  range: { from: string; to: string };
  summary: {
    uniqueVisitors: number;
    pageViews: number;
    sessions: number;
    activeVisitors: number;
    averageTimeSeconds: number;
    newVisitors: number;
    returningVisitors: number;
    visitorChange: number;
    pageViewChange: number;
  };
  trend: TrendPoint[];
  pages: PageRow[];
  sections: { section: string; views: number }[];
  features: FeatureRow[];
  audience: { devices: Breakdown[]; browsers: Breakdown[]; sources: Breakdown[] };
  live: Journey[];
};

type ApiResponse = { success: boolean; message?: string; data?: AnalyticsData };

const dateString = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const number = (value: number) => new Intl.NumberFormat("en-IN").format(value || 0);
const duration = (seconds: number) => {
  if (!seconds) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return mins ? `${mins}m ${secs}s` : `${secs}s`;
};

const csvCell = (value: unknown) => {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
};

function groupTrend(data: TrendPoint[], mode: "daily" | "weekly" | "monthly") {
  if (mode === "daily") return data.map((item) => ({ ...item, label: item.date.slice(5) }));
  const groups = new Map<string, { label: string; pageViews: number; visitors: Set<string> }>();
  data.forEach((item) => {
    const date = new Date(`${item.date}T00:00:00`);
    let label = item.date.slice(0, 7);
    if (mode === "weekly") {
      const day = (date.getDay() + 6) % 7;
      date.setDate(date.getDate() - day);
      label = dateString(date).slice(5);
    }
    const group = groups.get(label) || { label, pageViews: 0, visitors: new Set<string>() };
    group.pageViews += item.pageViews;
    // The API reports daily unique visitors. Weekly/monthly trend sums are a
    // daily reach indicator, not cross-day deduplicated people.
    group.visitors.add(`${item.date}:${item.uniqueVisitors}`);
    groups.set(label, group);
  });
  return Array.from(groups.values()).map((group) => ({
    label: group.label,
    pageViews: group.pageViews,
    uniqueVisitors: Array.from(group.visitors).reduce((sum, key) => sum + Number(key.split(":")[1]), 0),
  }));
}

function StatCard({
  title,
  value,
  detail,
  icon: Icon,
  change,
  live,
}: {
  title: string;
  value: string;
  detail: string;
  icon: typeof Users;
  change?: number;
  live?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
        <span className="rounded-xl bg-blue-50 p-3 text-blue-700"><Icon size={21} /></span>
      </div>
      <div className="mt-3 flex min-h-5 items-center gap-2 text-xs text-slate-500">
        {live ? <><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> Live · updates every 20 seconds</> : detail}
        {change !== undefined && (
          <span className={`ml-auto inline-flex items-center gap-1 font-semibold ${change >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
            {change >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(change)}% vs previous period
          </span>
        )}
      </div>
    </div>
  );
}

function BreakdownList({ title, rows, icon: Icon }: { title: string; rows: Breakdown[]; icon: typeof Globe2 }) {
  const max = Math.max(1, ...rows.map((row) => row.count));
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Icon size={18} className="text-blue-700" />
        <h3 className="font-bold text-slate-900">{title}</h3>
      </div>
      {rows.length ? <div className="space-y-3">
        {rows.slice(0, 6).map((row) => (
          <div key={row.name}>
            <div className="mb-1 flex justify-between gap-3 text-sm">
              <span className="truncate text-slate-600">{row.name || "Unknown"}</span>
              <span className="font-semibold tabular-nums text-slate-900">{number(row.count)}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.max(2, (row.count / max) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div> : <p className="text-sm text-slate-400">No data in this date range.</p>}
    </section>
  );
}

export default function AnalyticsPage() {
  const today = useMemo(() => new Date(), []);
  const [from, setFrom] = useState(() => dateString(new Date(Date.now() - 29 * 86400000)));
  const [to, setTo] = useState(() => dateString(today));
  const [grouping, setGrouping] = useState<"daily" | "weekly" | "monthly">("daily");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadReport = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    else setRefreshing(true);
    setError("");
    try {
      const query = new URLSearchParams({ from, to });
      const response = await authenticatedApiFetch(`/analytics/report?${query.toString()}`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      const result = await responseJson<ApiResponse>(response);
      if (!result.success || !result.data) throw new Error(result.message || "Analytics data is unavailable.");
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load analytics.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [from, to]);

  useEffect(() => {
    void loadReport();
  }, [loadReport]);

  useEffect(() => {
    const timer = window.setInterval(() => void loadReport(true), 20_000);
    return () => window.clearInterval(timer);
  }, [loadReport]);

  const chartData = useMemo(
    () => groupTrend(data?.trend || [], grouping),
    [data?.trend, grouping]
  );

  const setPreset = (days: number) => {
    setFrom(dateString(new Date(Date.now() - (days - 1) * 86400000)));
    setTo(dateString(new Date()));
  };

  const exportCsv = () => {
    if (!data) return;
    const rows: unknown[][] = [
      ["GNPC Website Analytics"],
      ["From", from, "To", to],
      [],
      ["Summary"],
      ["Metric", "Value"],
      ["Unique visitors", data.summary.uniqueVisitors],
      ["Page views", data.summary.pageViews],
      ["Sessions", data.summary.sessions],
      ["Active visitors now", data.summary.activeVisitors],
      ["Average time on page (seconds)", data.summary.averageTimeSeconds],
      ["New visitors", data.summary.newVisitors],
      ["Returning visitors", data.summary.returningVisitors],
      [],
      ["Daily traffic"],
      ["Date", "Unique visitors", "Page views"],
      ...data.trend.map((item) => [item.date, item.uniqueVisitors, item.pageViews]),
      [],
      ["Top pages"],
      ["Page", "Unique visitors", "Page views"],
      ...data.pages.map((item) => [item.path, item.uniqueVisitors, item.pageViews]),
      [],
      ["Feature engagement"],
      ["Event", "Feature", "Count"],
      ...data.features.map((item) => [item.type, item.label, item.count]),
    ];
    const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `gnpc-analytics-${from}-to-${to}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading && !data) {
    return <div className="flex min-h-72 items-center justify-center text-sm font-medium text-slate-500">Loading website intelligence…</div>;
  }

  if (error && !data) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-white p-6">
        <h2 className="font-bold text-slate-900">Analytics could not be loaded</h2>
        <p className="mt-2 text-sm text-rose-700">{error}</p>
        <button onClick={() => void loadReport()} className="mt-4 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white">Try again</button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-blue-700">
            <Activity size={15} /> Website intelligence
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Analytics & Insights</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">First-party visitor activity, content performance and feature engagement. No external analytics services.</p>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <label className="text-xs font-semibold text-slate-600">From
            <input type="date" value={from} max={to} onChange={(event) => setFrom(event.target.value)} className="mt-1 block rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800" />
          </label>
          <label className="text-xs font-semibold text-slate-600">To
            <input type="date" value={to} min={from} max={dateString(new Date())} onChange={(event) => setTo(event.target.value)} className="mt-1 block rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800" />
          </label>
          <button onClick={() => void loadReport()} className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-700 px-3 text-sm font-semibold text-white hover:bg-blue-800">
            <BarChart3 size={16} /> Apply
          </button>
          <button onClick={exportCsv} className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <Download size={16} /> CSV
          </button>
          <button onClick={() => void loadReport(true)} disabled={refreshing} aria-label="Refresh analytics" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50">
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex flex-wrap gap-2">
          {[7, 30, 90].map((days) => (
            <button key={days} onClick={() => setPreset(days)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800">{days === 7 ? "Last 7 days" : days === 30 ? "Last 30 days" : "Last 90 days"}</button>
          ))}
        </div>
        <span className="text-xs text-slate-500">Compared with the previous equivalent period</span>
      </div>

      {error && <p className="rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800">{error} Showing the last successfully loaded report.</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Live visitors" value={number(data.summary.activeVisitors)} detail="" icon={Activity} live />
        <StatCard title="Unique visitors" value={number(data.summary.uniqueVisitors)} detail="Distinct anonymous visitors" icon={Users} change={data.summary.visitorChange} />
        <StatCard title="Page views" value={number(data.summary.pageViews)} detail="Total recorded page views" icon={Eye} change={data.summary.pageViewChange} />
        <StatCard title="Sessions" value={number(data.summary.sessions)} detail="Visitor sessions started" icon={Globe2} />
        <StatCard title="Average time" value={duration(data.summary.averageTimeSeconds)} detail="Measured from page activity" icon={Clock3} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,.8fr)]">
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-slate-900">Traffic trends</h2>
              <p className="mt-1 text-xs text-slate-500">Unique visitor reach and page views over the selected period</p>
            </div>
            <div className="flex rounded-lg bg-slate-100 p-1">
              {(["daily", "weekly", "monthly"] as const).map((mode) => (
                <button key={mode} onClick={() => setGrouping(mode)} className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize ${grouping === mode ? "bg-white text-blue-800 shadow-sm" : "text-slate-500"}`}>{mode}</button>
              ))}
            </div>
          </div>
          <div className="mt-5 h-72">
            {chartData.length ? <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="uniqueVisitors" name="Daily unique visitors" stroke="#2563eb" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="pageViews" name="Page views" stroke="#d49a36" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer> : <div className="flex h-full items-center justify-center text-sm text-slate-400">No traffic recorded for this period yet.</div>}
          </div>
          {grouping !== "daily" && <p className="mt-2 text-xs text-slate-400">Grouped visitor reach sums daily unique counts; the headline unique visitor metric is deduplicated across the full date range.</p>}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <UserRoundCheck size={18} className="text-blue-700" />
            <h2 className="font-bold text-slate-900">Audience mix</h2>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-xs font-medium text-blue-700">New visitors</p>
              <p className="mt-1 text-2xl font-bold text-blue-950">{number(data.summary.newVisitors)}</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-4">
              <p className="text-xs font-medium text-amber-800">Returning</p>
              <p className="mt-1 text-2xl font-bold text-amber-950">{number(data.summary.returningVisitors)}</p>
            </div>
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-500">Visitors are identified using a random first-party browser identifier. Clearing browser storage or using another browser creates a new anonymous visitor.</p>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-900">Most visited pages</h2>
          <p className="mt-1 text-xs text-slate-500">Ranked by recorded page views</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400"><tr><th className="pb-3 font-semibold">Page</th><th className="pb-3 text-right font-semibold">Visitors</th><th className="pb-3 text-right font-semibold">Views</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {data.pages.map((row) => <tr key={row.path}><td className="max-w-[220px] truncate py-3 font-medium text-slate-700">{row.path}</td><td className="py-3 text-right tabular-nums text-slate-600">{number(row.uniqueVisitors)}</td><td className="py-3 text-right font-semibold tabular-nums text-slate-900">{number(row.pageViews)}</td></tr>)}
                {!data.pages.length && <tr><td colSpan={3} className="py-8 text-center text-slate-400">No page views yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-900">Popular website sections</h2>
          <p className="mt-1 text-xs text-slate-500">Page views grouped by top-level route</p>
          <div className="mt-4 space-y-4">
            {data.sections.length ? data.sections.map((row) => {
              const max = Math.max(1, ...data.sections.map((item) => item.views));
              return <div key={row.section}>
                <div className="mb-1.5 flex justify-between text-sm"><span className="font-medium text-slate-700">{row.section}</span><span className="font-semibold tabular-nums text-slate-900">{number(row.views)}</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-blue-700 to-sky-400" style={{ width: `${(row.views / max) * 100}%` }} /></div>
              </div>;
            }) : <p className="py-8 text-center text-sm text-slate-400">No section activity yet.</p>}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-bold text-slate-900">Feature engagement</h2>
        <p className="mt-1 text-xs text-slate-500">Button and link clicks, registrations, downloads and tagged feature interactions</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400"><tr><th className="pb-3 font-semibold">Interaction</th><th className="pb-3 font-semibold">Element / feature</th><th className="pb-3 text-right font-semibold">Events</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {data.features.map((item, index) => <tr key={`${item.type}-${item.label}-${index}`}><td className="py-3"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold capitalize text-blue-800">{item.type.replace("_", " ")}</span></td><td className="py-3 text-slate-700">{item.label || "Unlabelled interaction"}</td><td className="py-3 text-right font-bold tabular-nums text-slate-900">{number(item.count)}</td></tr>)}
              {!data.features.length && <tr><td colSpan={3} className="py-8 text-center text-slate-400">No feature interactions recorded yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-3">
        <BreakdownList title="Devices" rows={data.audience.devices} icon={Monitor} />
        <BreakdownList title="Browsers" rows={data.audience.browsers} icon={Globe2} />
        <BreakdownList title="Referral sources" rows={data.audience.sources} icon={ArrowUpRight} />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-bold text-slate-900">Live visitor activity</h2>
            <p className="mt-1 text-xs text-slate-500">Anonymous sessions active within the last 90 seconds</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> {number(data.summary.activeVisitors)} active visitors</span>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {data.live.map((journey) => (
            <div key={journey.session} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold text-slate-500">Visitor session · {journey.session}</span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">{journey.deviceType === "mobile" ? <Smartphone size={13} /> : journey.deviceType === "tablet" ? <Tablet size={13} /> : <Monitor size={13} />}{journey.deviceType}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">Entered at <strong className="font-semibold text-slate-900">{journey.entryPath}</strong></p>
              <p className="mt-1 text-sm text-slate-600">Currently viewing <strong className="font-semibold text-blue-800">{journey.currentPath}</strong></p>
              <p className="mt-1 text-xs text-slate-400">Source: {journey.referrerSource} · Last active {new Date(journey.lastSeenAt).toLocaleTimeString()}</p>
              {journey.steps.length > 0 && <div className="mt-3 border-t border-slate-200 pt-3">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Recent journey</p>
                <div className="flex flex-wrap gap-1.5">
                  {journey.steps.map((step, index) => <span key={`${step.at}-${index}`} className="rounded-md bg-white px-2 py-1 text-[10px] text-slate-600">{step.type.replace("_", " ")} · {step.path}</span>)}
                </div>
              </div>}
            </div>
          ))}
          {!data.live.length && <div className="rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-400 lg:col-span-2">No active visitors at this moment. New visits will appear here automatically.</div>}
        </div>
      </section>

      <p className="text-center text-xs leading-5 text-slate-400">First-party GNPC analytics · Random anonymous visitor IDs · No IP address, personal form values or sensitive data stored · Event retention: up to 400 days</p>
    </div>
  );
}
