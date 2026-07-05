import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AnalyticsDto } from "../../types/api";

export function AnalyticsCharts({ analytics }: { analytics: AnalyticsDto | null }) {
  const daily = Object.entries(analytics?.daily ?? {}).map(([day, clicks]) => ({ day, clicks }));
  const devices = Object.entries(analytics?.devices ?? {}).map(([name, value]) => ({ name, value }));
  return (
    <section className="chart-grid">
      <div className="panel">
        <h3>Daily clicks</h3>
        <ResponsiveContainer width="100%" height={220}><AreaChart data={daily}><CartesianGrid vertical={false} /><XAxis dataKey="day" /><YAxis /><Tooltip /><Area dataKey="clicks" stroke="#0f766e" fill="#ccfbf1" /></AreaChart></ResponsiveContainer>
      </div>
      <div className="panel">
        <h3>Devices</h3>
        <ResponsiveContainer width="100%" height={220}><BarChart data={devices}><CartesianGrid vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#2563eb" /></BarChart></ResponsiveContainer>
      </div>
    </section>
  );
}
