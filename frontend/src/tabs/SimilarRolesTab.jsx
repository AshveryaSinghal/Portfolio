import { useState } from "react";
import { Compass } from "lucide-react";
import { api } from "../lib/api";
import { Card, Button, Spinner, EmptyState, EngineBadge } from "../components/shared";

export default function SimilarRolesTab({ jdStructured }) {
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    setBusy(true);
    setError("");
    try {
      const r = await api.similarRoles({ jd_structured: jdStructured });
      setData(r);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!jdStructured) {
    return <EmptyState icon={Compass} title="Load a job description first" desc="We'll suggest comparable roles at other companies based on this JD's title, skills, and responsibilities." />;
  }

  return (
    <div className="animate-fade-up space-y-5">
      <div className="flex justify-end">
        <Button onClick={run} disabled={busy} variant="secondary">
          {busy ? "Searching…" : "Suggest similar roles"}
        </Button>
      </div>
      {busy && <Spinner label="Thinking of comparable roles…" />}
      {error && <div className="text-sm text-[var(--accent-red)]">{error}</div>}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(data.similar_roles || []).map((r, i) => (
            <Card key={i} className="p-5">
              <div className="text-sm font-semibold text-[var(--text-primary)]">{r.role_title}</div>
              <div className="text-xs text-[var(--accent-teal)] mb-2">{r.company}</div>
              <p className="text-sm text-[var(--text-secondary)]">{r.why_similar}</p>
            </Card>
          ))}
          <div className="md:col-span-2"><EngineBadge engine={data._engine} /></div>
        </div>
      )}
    </div>
  );
}
