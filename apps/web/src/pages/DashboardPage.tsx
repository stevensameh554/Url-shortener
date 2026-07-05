import { useEffect, useState } from "react";
import { LinkFilters } from "../features/dashboard/LinkFilters";
import { LinkTable } from "../features/dashboard/LinkTable";
import { listLinks } from "../features/dashboard/dashboardApi";
import { getQr } from "../features/links/linkApi";
import { QRCodePanel } from "../features/links/QRCodePanel";
import type { LinkDto } from "../types/api";

export function DashboardPage({ onSelect }: { onSelect: (link: LinkDto) => void }) {
  const [links, setLinks] = useState<LinkDto[]>([]);
  const [query, setQuery] = useState("");
  const [qr, setQr] = useState("");
  useEffect(() => {
    const params = query ? `?search=${encodeURIComponent(query)}` : "";
    listLinks(params).then((result) => setLinks(result.items)).catch(() => setLinks([]));
  }, [query]);
  async function showQr(link: LinkDto) {
    const response = await getQr(link.shortCode);
    setQr(response.dataUrl);
  }
  return <section className="stack"><div className="panel"><h2>Dashboard</h2><LinkFilters query={query} onQuery={setQuery} /><LinkTable links={links} onSelect={onSelect} onQr={showQr} /></div><QRCodePanel dataUrl={qr} /></section>;
}
