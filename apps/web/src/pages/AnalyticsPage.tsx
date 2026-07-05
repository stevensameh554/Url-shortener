import { useEffect, useState } from "react";
import { AnalyticsCharts } from "../features/analytics/AnalyticsCharts";
import { AnalyticsSummary } from "../features/analytics/AnalyticsSummary";
import { DateRangePicker } from "../features/analytics/DateRangePicker";
import { getAnalytics } from "../features/analytics/analyticsApi";
import type { AnalyticsDto, LinkDto } from "../types/api";

export function AnalyticsPage({ link }: { link: LinkDto | null }) {
  const [analytics, setAnalytics] = useState<AnalyticsDto | null>(null);
  useEffect(() => {
    if (link) getAnalytics(link.shortCode).then(setAnalytics).catch(() => setAnalytics(null));
  }, [link]);
  return <section className="stack"><div className="panel"><h2>Analytics</h2><DateRangePicker /></div><AnalyticsSummary analytics={analytics} /><AnalyticsCharts analytics={analytics} /></section>;
}
