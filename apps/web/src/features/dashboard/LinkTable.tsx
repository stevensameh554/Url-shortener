import { BarChart3, Copy, QrCode } from "lucide-react";
import type { LinkDto } from "../../types/api";

export function LinkTable({ links, onSelect, onQr }: { links: LinkDto[]; onSelect: (link: LinkDto) => void; onQr: (link: LinkDto) => void }) {
  return (
    <div className="table">
      {links.map((link) => (
        <div className="table-row" key={link.id}>
          <button type="button" onClick={() => onSelect(link)}>
            <strong>{link.shortCode}</strong>
            <span>{link.originalUrl}</span>
          </button>
          <small>{link.clickCount} clicks</small>
          <button type="button" title="Copy" onClick={() => navigator.clipboard.writeText(link.shortUrl)}><Copy size={16} /></button>
          <button type="button" title="QR" onClick={() => onQr(link)}><QrCode size={16} /></button>
          <button type="button" title="Analytics" onClick={() => onSelect(link)}><BarChart3 size={16} /></button>
        </div>
      ))}
    </div>
  );
}
