import { useState } from "react";
import { CreateLinkForm } from "../features/links/CreateLinkForm";
import { ShortLinkResult } from "../features/links/ShortLinkResult";
import type { LinkDto } from "../types/api";

export function LandingPage() {
  const [created, setCreated] = useState<LinkDto | null>(null);
  return (
    <section className="hero">
      <div>
        <p className="eyebrow">LinkPulse</p>
        <h1>Short links with operational analytics.</h1>
        <p>Generate clean URLs, protect destinations, and track campaign traffic from a production-style dashboard.</p>
      </div>
      <div className="stack">
        <CreateLinkForm onCreated={setCreated} />
        <ShortLinkResult link={created} />
      </div>
    </section>
  );
}
