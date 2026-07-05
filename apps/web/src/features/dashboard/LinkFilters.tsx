export function LinkFilters({ query, onQuery }: { query: string; onQuery: (value: string) => void }) {
  return (
    <div className="toolbar">
      <input value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Search links" />
      <select defaultValue="createdAt">
        <option value="createdAt">Newest</option>
        <option value="clickCount">Clicks</option>
        <option value="expiresAt">Expiration</option>
      </select>
    </div>
  );
}
