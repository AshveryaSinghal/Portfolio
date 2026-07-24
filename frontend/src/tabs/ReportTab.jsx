import { useState } from "react";
import { FileDown } from "lucide-react";
import { api } from "../lib/api";
import { Card, Button, EmptyState } from "../components/shared";

export default function ReportTab({ jdStructured, atsResult, strengthsWeaknesses, roadmapWeeks }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function download() {
    setBusy(true);
    setError("");
    try {
      const blob = await api.reportPdf({
        jd_info: { job_title: jdStructured?.job_title || "Target Role", company: jdStructured?.company || "Target Company" },
        ats_result: atsResult,
        strengths_weaknesses: strengthsWeaknesses,
        roadmap: roadmapWeeks,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ResumeIQ_Report.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!atsResult) {
    return <EmptyState icon={FileDown} title="Nothing to export yet" desc="Run the analysis first — the report bundles your ATS score, keyword gap, strengths/weaknesses, and roadmap into one PDF." />;
  }

  return (
    <div className="animate-fade-up">
      <Card className="p-8 max-w-xl mx-auto text-center">
        <FileDown size={28} className="text-[var(--accent-gold)] mx-auto mb-3" />
        <div className="font-display text-xl mb-2">ATS Compatibility Report</div>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          A polished PDF with your overall score, breakdown, eligibility, keyword gap
          {strengthsWeaknesses ? ", strengths & weaknesses" : ""}
          {roadmapWeeks ? ", and your skill roadmap" : ""} — ready to keep alongside your application notes.
        </p>
        <Button onClick={download} disabled={busy}>
          {busy ? "Building PDF…" : "Download PDF report"}
        </Button>
        {error && <div className="text-sm text-[var(--accent-red)] mt-3">{error}</div>}
      </Card>
    </div>
  );
}
