import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AnalyticsCharts } from "./AnalyticsCharts";

describe("AnalyticsCharts", () => {
  it("renders chart headings", () => {
    expect(renderToString(<AnalyticsCharts analytics={null} />)).toContain("Daily clicks");
  });
});
