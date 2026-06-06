"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Project } from "@/lib/database.types";

type Step = "verify" | "form" | "success";

interface FormData {
  builder_name: string;
  builder_bio: string;
  builder_linkedin: string;
  project_name: string;
  live_url: string;
  what_you_built: string;
  who_is_it_for: string;
  problem_it_solves: string;
  hardest_thing: string;
  what_surprised_you: string;
  day_number: string;
  tags: string;
}

export default function EditForm({ project }: { project: Project }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("verify");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormData>({
    builder_name: project.builder_name,
    builder_bio: project.builder_bio ?? "",
    builder_linkedin: project.builder_linkedin ?? "",
    project_name: project.project_name,
    live_url: project.live_url,
    what_you_built: project.what_you_built,
    who_is_it_for: project.who_is_it_for,
    problem_it_solves: project.problem_it_solves,
    hardest_thing: project.hardest_thing ?? "",
    what_surprised_you: project.what_surprised_you ?? "",
    day_number: project.day_number ? String(project.day_number) : "",
    tags: project.tags ? project.tags.join(", ") : "",
  });

  const updateForm = (key: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStep("form");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const tagsArray = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tags: tagsArray, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStep("success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px 80px" }}>
      <Link
        href={`/project/${project.id}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: "var(--text-secondary)",
          textDecoration: "none",
          fontSize: 14,
          marginBottom: 32,
        }}
      >
        ← Back to project
      </Link>

      <div style={{ marginBottom: 40 }}>
        <div
          style={{
            display: "inline-block",
            background: "var(--gold-dim)",
            border: "1px solid rgba(245,166,35,0.2)",
            borderRadius: 99,
            padding: "4px 12px",
            fontSize: 11,
            color: "var(--gold)",
            fontWeight: 600,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Edit project
        </div>
        <h1
          style={{
            margin: "0 0 8px",
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: 800,
            letterSpacing: "-0.7px",
            color: "var(--text-primary)",
          }}
        >
          Update {project.project_name}
        </h1>
        <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.6 }}>
          Verify your identity to edit your project details.
        </p>
      </div>

      <StepIndicator step={step} />

      {error && (
        <div
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 8,
            padding: "12px 16px",
            marginBottom: 20,
            color: "#f87171",
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      {step === "verify" && (
        <form onSubmit={handleVerify}>
          <Card>
            <FormRow>
              <Label required>SheVibes cohort code</Label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your cohort code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                autoFocus
                style={{ letterSpacing: "2px" }}
              />
            </FormRow>
            <button
              type="submit"
              className="btn-gold"
              disabled={loading || !code.trim()}
              style={{ marginTop: 8, width: "100%" }}
            >
              {loading ? "Verifying..." : "Unlock editor →"}
            </button>
          </Card>
        </form>
      )}

      {step === "form" && (
        <form onSubmit={handleSave}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: 8,
              marginBottom: 24,
              fontSize: 13,
              color: "#4ade80",
            }}
          >
            ✓ Code verified — edit your project below
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Card title="About you">
              <FormRow>
                <Label required>Your name</Label>
                <input
                  type="text"
                  className="form-input"
                  value={form.builder_name}
                  onChange={(e) => updateForm("builder_name", e.target.value)}
                  required
                />
              </FormRow>
              <FormRow>
                <Label>One-line bio</Label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Product manager turned builder"
                  value={form.builder_bio}
                  onChange={(e) => updateForm("builder_bio", e.target.value)}
                />
              </FormRow>
              <FormRow>
                <Label>LinkedIn URL</Label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://linkedin.com/in/yourhandle"
                  value={form.builder_linkedin}
                  onChange={(e) => updateForm("builder_linkedin", e.target.value)}
                />
              </FormRow>
            </Card>

            <Card title="Project basics">
              <FormRow>
                <Label required>Project name</Label>
                <input
                  type="text"
                  className="form-input"
                  value={form.project_name}
                  onChange={(e) => updateForm("project_name", e.target.value)}
                  required
                />
              </FormRow>
              <FormRow>
                <Label required>Live project URL</Label>
                <input
                  type="url"
                  className="form-input"
                  value={form.live_url}
                  onChange={(e) => updateForm("live_url", e.target.value)}
                  required
                />
              </FormRow>
              <FormRow>
                <Label>Which day did you ship?</Label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 62"
                  min={1}
                  max={66}
                  value={form.day_number}
                  onChange={(e) => updateForm("day_number", e.target.value)}
                />
              </FormRow>
              <FormRow>
                <Label>Tags (comma-separated)</Label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. AI, Health, Productivity"
                  value={form.tags}
                  onChange={(e) => updateForm("tags", e.target.value)}
                />
              </FormRow>
            </Card>

            <Card title="Your build story">
              {([
                { key: "what_you_built", label: "What did you build?", required: true },
                { key: "who_is_it_for", label: "Who is it for?", required: true },
                { key: "problem_it_solves", label: "What problem does it solve?", required: true },
                { key: "hardest_thing", label: "What was the hardest part?", required: false },
                { key: "what_surprised_you", label: "What surprised you?", required: false },
              ] as { key: keyof FormData; label: string; required: boolean }[]).map(({ key, label, required }) => (
                <FormRow key={key}>
                  <Label required={required}>{label}</Label>
                  <textarea
                    className="form-input"
                    value={form[key]}
                    onChange={(e) => updateForm(key, e.target.value)}
                    required={required}
                    rows={3}
                  />
                </FormRow>
              ))}
            </Card>

            <button
              type="submit"
              className="btn-gold"
              disabled={loading}
              style={{ width: "100%", padding: "14px", fontSize: 15 }}
            >
              {loading ? "Saving..." : "Save changes →"}
            </button>
          </div>
        </form>
      )}

      {step === "success" && (
        <Card>
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <h2 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 800, color: "var(--text-primary)" }}>
              Project updated!
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 15, margin: "0 0 28px", lineHeight: 1.6 }}>
              Your changes to {form.project_name} are live.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn-gold" onClick={() => router.push(`/project/${project.id}`)}>
                View project →
              </button>
              <button className="btn-ghost" onClick={() => router.push("/")}>
                Back to gallery
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

function StepIndicator({ step }: { step: Step }) {
  const steps = [
    { id: "verify", label: "Verify identity" },
    { id: "form", label: "Edit project" },
    { id: "success", label: "Done!" },
  ];
  const currentIdx = steps.findIndex((s) => s.id === step);
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
      {steps.map((s, i) => (
        <div key={s.id} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : undefined }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 24, height: 24, borderRadius: "50%",
                background: i <= currentIdx ? "var(--gold)" : "var(--surface-2)",
                border: `1px solid ${i <= currentIdx ? "var(--gold)" : "var(--border)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700,
                color: i <= currentIdx ? "#0d1117" : "var(--text-muted)",
                flexShrink: 0,
              }}
            >
              {i < currentIdx ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 12, color: i === currentIdx ? "var(--text-primary)" : "var(--text-muted)", fontWeight: i === currentIdx ? 600 : 400, whiteSpace: "nowrap" }}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: 1, background: i < currentIdx ? "var(--gold)" : "var(--border)", margin: "0 8px" }} />
          )}
        </div>
      ))}
    </div>
  );
}

function Card({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "24px" }}>
      {title && (
        <h3 style={{ margin: "0 0 20px", fontSize: 13, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

function FormRow({ children }: { children: React.ReactNode }) {
  return <div style={{ marginBottom: 16 }}>{children}</div>;
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
      {children}
      {required && <span style={{ color: "var(--gold)", marginLeft: 3 }}>*</span>}
    </label>
  );
}
