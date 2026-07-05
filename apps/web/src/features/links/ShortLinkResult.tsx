import { Copy } from "lucide-react";
import type { LinkDto } from "../../types/api";

export function ShortLinkResult({ link }: { link: LinkDto | null }) {
  if (!link) return null;
  return (
    <section className="panel result-panel">
      <span>Short link</span>
      <strong>{link.shortUrl}</strong>
      <button type="button" onClick={() => navigator.clipboard.writeText(link.shortUrl)}><Copy size={16} /> Copy</button>
    </section>
  );
}
