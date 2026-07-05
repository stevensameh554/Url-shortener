import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getAnalytics, shortenLink } from "./api.js";
import "./styles.css";

const demoClicks = [
  { day: "Mon", clicks: 38 },
  { day: "Tue", clicks: 54 },
  { day: "Wed", clicks: 47 },
  { day: "Thu", clicks: 80 },
  { day: "Fri", clicks: 68 },
  { day: "Sat", clicks: 92 },
  { day: "Sun", clicks: 73 }
];

const demoSources = [
  { name: "Direct", value: 48 },
  { name: "Search", value: 30 },
  { name: "Social", value: 22 }
];

function App() {
  const [form, setForm] = useState({ originalUrl: "", customAlias: "", expiresAt: "" });
  const [createdLinks, setCreatedLinks] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const chartData = useMemo(() => {
    if (!analytics?.clicksByDay) return demoClicks;
    return Object.entries(analytics.clicksByDay).map(([day, clicks]) => ({ day, clicks }));
  }, [analytics]);

  async function handleCreate(event) {
    event.preventDefault();
    setStatus({ type: "loading", message: "Creating link" });

    try {
      const link = await shortenLink({
        originalUrl: form.originalUrl,
        customAlias: form.customAlias || undefined,
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined
      });
      setCreatedLinks((links) => [link, ...links]);
      setSelectedCode(link.shortCode);
      setForm({ originalUrl: "", customAlias: "", expiresAt: "" });
      setStatus({ type: "success", message: "Short link created" });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  }

  async function handleLoadAnalytics(shortCode) {
    setSelectedCode(shortCode);
    setStatus({ type: "loading", message: "Loading analytics" });
    try {
      setAnalytics(await getAnalytics(shortCode));
      setStatus({ type: "success", message: "Analytics loaded" });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand-mark">LP</div>
        <nav aria-label="Primary">
          <a href="#create" className="active">Create</a>
          <a href="#links">Links</a>
          <a href="#analytics">Analytics</a>
          <a href="#settings">Settings</a>
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">LinkPulse</p>
            <h1>URL operations and click intelligence</h1>
          </div>
          <div className="status-strip">
            <span>API</span>
            <strong>localhost:4000</strong>
          </div>
        </header>

        <section className="metrics" aria-label="Dashboard metrics">
          <Metric label="Active links" value={createdLinks.length || 24} trend="+12%" />
          <Metric label="Total clicks" value={analytics?.totalClicks ?? 8452} trend="+18%" />
          <Metric label="Unique visitors" value={analytics?.uniqueVisitors ?? 3921} trend="+9%" />
          <Metric label="Cache hit target" value="92%" trend="Redis" />
        </section>

        <section className="grid">
          <div className="panel create-panel" id="create">
            <div className="panel-heading">
              <h2>Create short link</h2>
              <p>Generate tracked short links with optional alias and expiry.</p>
            </div>
            <form onSubmit={handleCreate}>
              <label>
                Destination URL
                <input
                  required
                  type="url"
                  placeholder="https://example.com/product/launch"
                  value={form.originalUrl}
                  onChange={(event) => setForm({ ...form, originalUrl: event.target.value })}
                />
              </label>
              <div className="form-row">
                <label>
                  Custom alias
                  <input
                    placeholder="launch"
                    value={form.customAlias}
                    onChange={(event) => setForm({ ...form, customAlias: event.target.value })}
                  />
                </label>
                <label>
                  Expiration
                  <input
                    type="datetime-local"
                    value={form.expiresAt}
                    onChange={(event) => setForm({ ...form, expiresAt: event.target.value })}
                  />
                </label>
              </div>
              <button type="submit" disabled={status.type === "loading"}>
                {status.type === "loading" ? "Working" : "Shorten URL"}
              </button>
              {status.message && <p className={`message ${status.type}`}>{status.message}</p>}
            </form>
          </div>

          <div className="panel chart-panel" id="analytics">
            <div className="panel-heading">
              <h2>Clicks by day</h2>
              <p>{selectedCode ? `Showing ${selectedCode}` : "Demo data until a link is selected."}</p>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="clicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#146c5a" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#146c5a" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e5e1d8" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={36} />
                <Tooltip />
                <Area type="monotone" dataKey="clicks" stroke="#146c5a" fill="url(#clicks)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="grid lower-grid">
          <div className="panel" id="links">
            <div className="panel-heading">
              <h2>Recent links</h2>
              <p>Created links appear here immediately.</p>
            </div>
            <div className="table">
              {(createdLinks.length ? createdLinks : sampleLinks).map((link) => (
                <button className="table-row" key={link.shortCode} onClick={() => handleLoadAnalytics(link.shortCode)}>
                  <span>
                    <strong>{link.shortCode}</strong>
                    <small>{link.originalUrl}</small>
                  </span>
                  <span>{link.clicks} clicks</span>
                </button>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-heading">
              <h2>Traffic sources</h2>
              <p>Referrer mix for campaign performance.</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={demoSources}>
                <CartesianGrid stroke="#e5e1d8" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={32} />
                <Tooltip />
                <Bar dataKey="value" fill="#146c5a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </section>
    </main>
  );
}

function Metric({ label, value, trend }) {
  return (
    <article className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{trend}</small>
    </article>
  );
}

const sampleLinks = [
  { shortCode: "launch", originalUrl: "https://example.com/product/launch", clicks: 1280 },
  { shortCode: "docs", originalUrl: "https://example.com/docs/getting-started", clicks: 864 },
  { shortCode: "offer", originalUrl: "https://example.com/campaign/q3", clicks: 412 }
];

createRoot(document.getElementById("root")).render(<App />);
