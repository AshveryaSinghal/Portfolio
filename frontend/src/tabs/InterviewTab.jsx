import { useState } from "react";
import { MessagesSquare } from "lucide-react";
import { api } from "../lib/api";
import { Card, Button, Spinner, EmptyState, EngineBadge } from "../components/shared";

const GROUPS = [
  { key: "hr_questions", label: "HR / Behavioral" },
  { key: "technical_questions", label: "Technical" },
  { key: "project_questions", label: "Project-specific" },
];

export default function InterviewTab({ resumeText, jdText }) {
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    setBusy(true);
    setError("");
    try {
      const result = await api.interviewQuestions({ resume_text: resumeText, jd_text: jdText });
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="animate-fade-up space-y-5">
      <div className="flex justify-end">
        <Button onClick={run} disabled={busy} variant="secondary">
          {busy ? "Preparing questions…" : "Generate interview questions"}
        </Button>
      </div>
      {busy && <Spinner label="Reviewing resume + JD…" />}
      {error && <div className="text-sm text-[var(--accent-red)]">{error}</div>}
      {!data && !busy && (
        <EmptyState icon={MessagesSquare} title="No questions yet" desc="Generate a tailored set of HR, technical, and project-specific interview questions based on your resume and this JD." />
      )}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GROUPS.map((g) => (
            <Card key={g.key} className="p-5">
              <div className="font-mono text-[11px] tracking-wide uppercase text-[var(--text-muted)] mb-3">{g.label}</div>
              <ul className="space-y-3">
                {(data[g.key] || []).map((q, i) => (
                  <li key={i} className="text-sm text-[var(--text-secondary)] border-l-2 border-[var(--accent-teal)]/40 pl-3">
                    {q}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
          <div className="md:col-span-3"><EngineBadge engine={data._engine} /></div>
        </div>
      )}
    </div>
  );
}
