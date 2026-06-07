"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "code" | "form" | "success";

interface FormData {
  builder_name: string;
  builder_email: string;
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

const INITIAL_FORM: FormData = {
  builder_name: "",
  builder_email: "",
  builder_bio: "",
  builder_linkedin: "",
  project_name: "",
  live_url: "",
  what_you_built: "",
  who_is_it_for: "",
  problem_it_solves: "",
  hardest_thing: "",
  what_surprised_you: "",
  day_number: "",
  tags: "",
};

export default function SubmitPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("code");
  const [code, setCode] = useState("");
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submittedId, setSubmittedId] = useState("");

  async function handleVerifyCode(e: React.FormEvent) {
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

  async function handleSubmitProject(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const tagsArray = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tags: tagsArray, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSubmittedId(data.project.id);
      setStep("success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  }

  const updateForm = (key: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px 80px" }}>
      {/* Header */}
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
          Submit your project
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
          Add your build to the showcase
        </h1>
        <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.6 }}>
          Use your SheVibes cohort code to unlock the submission form.
        </p>
      </div>

      {/* Step indicator */}
      <StepIndicator step={step} />

      {/* Error */}
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

      {/* Step: Code */}
      {step === "code" && (
        <form onSubmit={handleVerifyCode}>
          <Card>
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
            <p style={{ marginTop: 8, fontSize: 12, color: "var(--text-muted)" }}>
              The code was shared with all SheVibes Cohort 0 participants.
            </p>
            <button
              type="submit"
              className="btn-gold"
              disabled={loading || !code.trim()}
              style={{ marginTop: 20, width: "100%" }}
            >
              {loading ? "Checking..." : "Continue →"}
            </button>
          </Card>
        </form>
      )}

      {/* Step: Project form */}
      {step === "form" && (
        <form onSubmit={handleSubmitProject}>
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
            ✓ Code verified — fill in your project details below
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Card title="About you">
              <FormRow>
                <Label required>Your name</Label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Priya Sharma"
                  value={form.builder_name}
                  onChange={(e) => updateForm("builder_name", e.target.value)}
                  required
                />
              </FormRow>
              <FormRow>
                <Label required>Your email</Label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={form.builder_email}
                  onChange={(e) => updateForm("builder_email", e.target.value)}
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
                  placeholder="e.g. Nourish, Gharelu, StyleAI..."
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
                  placeholder="https://yourproject.vercel.app"
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
              {[
                {
                  key: "what_you_built" as const,
                  label: "What did you build?",
                  placeholder: "Describe your project in a few sentences...",
                  required: true,
                },
                {
                  key: "who_is_it_for" as const,
                  label: "Who is it for?",
                  placeholder: "Who is your target user?",
                  required: true,
                },
                {
                  key: "problem_it_solves" as const,
                  label: "What problem does it solve?",
                  placeholder: "What pain point or gap does this address?",
                  required: true,
                },
                {
                  key: "hardest_thing" as const,
                  label: "What was the hardest part?",
                  placeholder: "The moment you almost gave up, or the bug that took hours...",
                  required: false,
                },
                {
                  key: "what_surprised_you" as const,
                  label: "What surprised you?",
                  placeholder: "Something unexpected — good or bad — from the build...",
                  required: false,
                },
              ].map(({ key, label, placeholder, required }) => (
                <FormRow key={key}>
                  <Label required={required}>{label}</Label>
                  <textarea
                    className="form-input"
                    placeholder={placeholder}
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
              {loading ? "Submitting..." : "Submit project to showcase →"}
            </button>
          </div>
        </form>
      )}

      {/* Step: Success */}
      {step === "success" && (
        <Card>
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            {/* Check circle */}
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "var(--gold)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="#0d1117"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2
              style={{
                margin: "0 0 8px",
                fontSize: 28,
                fontWeight: 900,
                color: "var(--text-primary)",
                letterSpacing: "-0.5px",
              }}
            >
              Done!
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: 15,
                margin: "0 0 28px",
                lineHeight: 1.6,
              }}
            >
              {form.builder_name
                ? `${form.builder_name}, your`
                : "Your"}{" "}
              build is now part of the SheVibes showcase. 66 days — and your project is one of them.
            </p>
            <div
              style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}
            >
              <button
                className="btn-gold"
                onClick={() => router.push(`/project/${submittedId}`)}
              >
                View your project →
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
    { id: "code", label: "Enter code" },
    { id: "form", label: "Your project" },
    { id: "success", label: "Done!" },
  ];
  const currentIdx = steps.findIndex((s) => s.id === step);

  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
      {steps.map((s, i) => (
        <div
          key={s.id}
          style={{
            display: "flex",
            alignItems: "center",
            flex: i < steps.length - 1 ? 1 : undefined,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: i <= currentIdx ? "var(--gold)" : "var(--surface-2)",
                border: `1px solid ${i <= currentIdx ? "var(--gold)" : "var(--border)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                color: i <= currentIdx ? "#0d1117" : "var(--text-muted)",
                flexShrink: 0,
              }}
            >
              {i < currentIdx ? "✓" : i + 1}
            </div>
            <span
              style={{
                fontSize: 12,
                color: i === currentIdx ? "var(--text-primary)" : "var(--text-muted)",
                fontWeight: i === currentIdx ? 600 : 400,
                whiteSpace: "nowrap",
              }}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              style={{
                flex: 1,
                height: 1,
                background: i < currentIdx ? "var(--gold)" : "var(--border)",
                margin: "0 8px",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function Card({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "24px",
      }}
    >
      {title && (
        <h3
          style={{
            margin: "0 0 20px",
            fontSize: 13,
            fontWeight: 700,
            color: "var(--gold)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
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
    <label
      style={{
        display: "block",
        fontSize: 13,
        fontWeight: 600,
        color: "var(--text-secondary)",
        marginBottom: 6,
      }}
    >
      {children}
      {required && <span style={{ color: "var(--gold)", marginLeft: 3 }}>*</span>}
    </label>
  );
}
