import type { LinkDto } from "../../types/api";

export function EditLinkDialog({ link }: { link: LinkDto | null }) {
  if (!link) return null;
  return <aside className="panel side-panel"><h3>{link.shortCode}</h3><p>{link.originalUrl}</p><p>Status: {link.status}</p></aside>;
}
