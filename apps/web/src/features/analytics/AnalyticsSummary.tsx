import type { AnalyticsDto } from "../../types/api";

export function AnalyticsSummary({ analytics }: { analytics: AnalyticsDto | null }) {
  return (
    <section className="metrics">
      <article><span>Total clicks</span><strong>{analytics?.totalClicks ?? 0}</strong></article>
      <article><span>Unique visitors</span><strong>{analytics?.uniqueVisitors ?? 0}</strong></article>
      <article><span>Tracked events</span><strong>{analytics?.events.length ?? 0}</strong></article>
    </section>
  );
}
