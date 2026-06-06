import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Project } from "@/lib/database.types";

interface Props {
  params: Promise<{ id: string }>;
}

async function getProject(id: string): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .eq("approved", true)
      .single();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) notFound();

  const sections: { label: string; content: string; emoji: string }[] = [
    { label: "What they built", content: project.what_you_built, emoji: "🛠️" },
    { label: "Who it's for", content: project.who_is_it_for, emoji: "👤" },
    { label: "Problem it solves", content: project.problem_it_solves, emoji: "💡" },
    ...(project.hardest_thing
      ? [{ label: "Hardest part", content: project.hardest_thing, emoji: "🔥" }]
      : []),
    ...(project.what_surprised_you
      ? [{ label: "What surprised them", content: project.what_surprised_you, emoji: "✨" }]
      : []),
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* Back + Edit */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "var(--text-secondary)",
            textDecoration: "none",
            fontSize: 14,
            transition: "color 0.15s",
          }}
        >
          ← Back to Gallery
        </Link>
        <Link
          href={`/project/${project.id}/edit`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "var(--text-muted)",
            textDecoration: "none",
            fontSize: 13,
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "6px 14px",
          }}
        >
          Edit project
        </Link>
      </div>

      {/* Header */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: "32px",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "linear-gradient(135deg, var(--gold-dim), rgba(245,166,35,0.04))",
                border: "1px solid rgba(245,166,35,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
              }}
            >
              🛠️
            </div>
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(22px, 4vw, 30px)",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.5px",
                }}
              >
                {project.project_name}
              </h1>
              {project.day_number && (
                <span className="day-badge" style={{ marginTop: 4, display: "inline-block" }}>
                  Day {project.day_number}
                </span>
              )}
            </div>
          </div>

          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold"
            style={{ whiteSpace: "nowrap" }}
          >
            View Live Project ↗
          </a>
        </div>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
            {project.tags.map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: "var(--border)", margin: "20px 0" }} />

        {/* Builder */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--gold), #f59e0b)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 800,
              color: "#0d1117",
            }}
          >
            {project.builder_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 15 }}>
              {project.builder_name}
            </div>
            {project.builder_bio && (
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                {project.builder_bio}
              </div>
            )}
          </div>
          {project.builder_linkedin && (
            <a
              href={project.builder_linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginLeft: "auto",
                color: "var(--text-muted)",
                fontSize: 12,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 4,
                border: "1px solid var(--border)",
                borderRadius: 6,
                padding: "4px 10px",
                transition: "all 0.15s",
              }}
            >
              LinkedIn ↗
            </a>
          )}
        </div>
      </div>

      {/* Q&A Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {sections.map((section) => (
          <div
            key={section.label}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <span style={{ fontSize: 18 }}>{section.emoji}</span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--gold)",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                {section.label}
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 15,
                color: "var(--text-primary)",
                lineHeight: 1.7,
              }}
            >
              {section.content}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div
        style={{
          marginTop: 40,
          textAlign: "center",
          padding: "32px",
          background: "var(--gold-dim)",
          border: "1px solid rgba(245,166,35,0.2)",
          borderRadius: 12,
        }}
      >
        <p style={{ margin: "0 0 16px", color: "var(--text-secondary)", fontSize: 14 }}>
          Built something during SheVibes? Add it to the showcase.
        </p>
        <Link href="/submit" className="btn-gold">
          Submit Your Project
        </Link>
      </div>
    </div>
  );
}
