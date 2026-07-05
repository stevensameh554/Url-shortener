import type { LinkDto } from "../types/api";

export function LinkDetailsPage({ link }: { link: LinkDto | null }) {
  if (!link) return <section className="panel"><h2>Select a link</h2></section>;
  return <section className="panel"><h2>{link.shortCode}</h2><p>{link.originalUrl}</p><p>{link.clickCount} clicks</p><p>Status: {link.status}</p></section>;
}
