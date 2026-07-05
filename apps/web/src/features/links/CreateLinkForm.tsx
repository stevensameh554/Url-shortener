import { useState } from "react";
import { Link2 } from "lucide-react";
import { createLink } from "./linkApi";
import type { LinkDto } from "../../types/api";

export function CreateLinkForm({ onCreated }: { onCreated: (link: LinkDto) => void }) {
  const [form, setForm] = useState({ originalUrl: "", customAlias: "", expiresAt: "" });
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("Creating link...");
    try {
      const link = await createLink({
        originalUrl: form.originalUrl,
        customAlias: form.customAlias || undefined,
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined
      });
      onCreated(link);
      setForm({ originalUrl: "", customAlias: "", expiresAt: "" });
      setMessage("Short link ready.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create link");
    }
  }

  return (
    <form className="panel form-panel" onSubmit={submit}>
      <h2>Shorten a URL</h2>
      <label>
        Destination
        <input required type="url" value={form.originalUrl} onChange={(e) => setForm({ ...form, originalUrl: e.target.value })} placeholder="https://example.com/launch" />
      </label>
      <div className="form-row">
        <label>
          Alias
          <input value={form.customAlias} onChange={(e) => setForm({ ...form, customAlias: e.target.value })} placeholder="launch" />
        </label>
        <label>
          Expiration
          <input type="datetime-local" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
        </label>
      </div>
      <button type="submit"><Link2 size={18} /> Create link</button>
      {message && <p className="message">{message}</p>}
    </form>
  );
}
