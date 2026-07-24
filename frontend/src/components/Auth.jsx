import { useState } from "react";
import { Radar } from "lucide-react";
import { api } from "../lib/api";
import { Button } from "./shared";

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState("signin"); // signin | signup
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = mode === "signin"
        ? await api.login(username, password)
        : await api.signup(username, password);
      localStorage.setItem("resumeiq_token", result.token);
      onAuth(result.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function continueAsGuest() {
    localStorage.removeItem("resumeiq_token");
    onAuth({ username: "guest", guest: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-[420px] animate-fade-up">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-full bg-[var(--accent-gold-soft)] border border-[var(--accent-gold)]/30 flex items-center justify-center">
            <Radar size={18} className="text-[var(--accent-gold)]" />
          </div>
          <div>
            <div className="font-display text-2xl leading-none">ResumeIQ</div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--text-muted)]">
              AI Career Copilot
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-7 shadow-[var(--shadow-lift)]">
          <div className="flex text-sm font-medium mb-6 bg-white/5 rounded-full p-1">
            {["signin", "signup"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-full transition-all ${
                  mode === m ? "bg-[var(--accent-gold)] text-[#1A1206]" : "text-[var(--text-secondary)]"
                }`}
              >
                {m === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1.5 block">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--accent-gold)]/50"
                placeholder="e.g. alex"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1.5 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--accent-gold)]/50"
                placeholder="At least 6 characters"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
              />
            </div>
            {error && <div className="text-xs text-[var(--accent-red)] bg-[var(--accent-red-soft)] rounded-[var(--radius-sm)] px-3 py-2">{error}</div>}
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-[var(--border-subtle)]" />
            <span className="text-[11px] text-[var(--text-muted)]">or</span>
            <div className="h-px flex-1 bg-[var(--border-subtle)]" />
          </div>

          <Button variant="secondary" onClick={continueAsGuest} className="w-full">
            Continue as guest
          </Button>
          <p className="text-[11px] text-[var(--text-muted)] text-center mt-3">
            Guest mode runs full analysis but won't save history or resume versions.
          </p>
        </div>
      </div>
    </div>
  );
}
