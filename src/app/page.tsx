import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Project } from "@/lib/database.types";

async function getProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const projects = await getProjects();

  return (
    <div>
      {/* Hero */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "72px 24px 48px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "var(--gold-dim)",
            border: "1px solid rgba(245,166,35,0.2)",
            borderRadius: 99,
            padding: "5px 14px",
            marginBottom: 24,
            fontSize: 12,
            color: "var(--gold)",
            fontWeight: 600,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--gold)",
              display: "inline-block",
            }}
          />
          SheVibes Cohort 0 · 66 Days
        </div>

        <h1
          style={{
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 900,
            lineHeight: 1.1,
            margin: "0 0 16px",
            letterSpacing: "-1.5px",
          }}
        >
          <span className="gold-text">66 days.</span>
          <br />
          <span style={{ color: "var(--text-primary)" }}>Built with AI.</span>
        </h1>

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: 18,
            lineHeight: 1.6,
            maxWidth: 560,
            margin: "0 auto 32px",
          }}
        >
          Every project here was built from scratch — a real product, a real problem, a real
          woman who built it.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/submit" className="btn-gold">
            Add Your Project →
          </Link>
          <a href="#projects" className="btn-ghost">
            Browse {projects.length} Projects
          </a>
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: "flex",
            gap: 40,
            justifyContent: "center",
            marginTop: 56,
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "Projects shipped", value: projects.length },
            { label: "Days of building", value: 66 },
            { label: "Cohort", value: "Cohort 0" },
            { label: "Programme", value: "SheVibes × PiFo" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "var(--gold)",
                  letterSpacing: "-0.5px",
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "linear-gradient(to right, transparent, var(--border), transparent)",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      />

      {/* Projects grid */}
      <section
        id="projects"
        style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 24px 80px" }}
      >
        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: 32,
              }}
            >
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  margin: 0,
                  color: "var(--text-primary)",
                }}
              >
                All Projects
              </h2>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                {projects.length} submitted
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: 20,
              }}
            >
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/project/${project.id}`} style={{ textDecoration: "none" }}>
      <div
        className="project-card"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "24px",
          cursor: "pointer",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "linear-gradient(135deg, var(--gold-dim), rgba(245,166,35,0.04))",
                border: "1px solid rgba(245,166,35,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                marginBottom: 12,
              }}
            >
              🛠️
            </div>
            <h3
              style={{
                margin: 0,
                fontSize: 17,
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-0.3px",
              }}
            >
              {project.project_name}
            </h3>
          </div>
          {project.day_number && (
            <span className="day-badge">Day {project.day_number}</span>
          )}
        </div>

        {/* Description */}
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          } as React.CSSProperties}
        >
          {project.what_you_built}
        </p>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 12,
            borderTop: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "var(--gold)",
              }}
            >
              {project.builder_name.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              {project.builder_name}
            </span>
          </div>
          <span style={{ fontSize: 12, color: "var(--gold)", fontWeight: 600 }}>View →</span>
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "80px 24px",
        border: "1px dashed var(--border)",
        borderRadius: 16,
        background: "var(--surface)",
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
      <h3 style={{ margin: "0 0 8px", color: "var(--text-primary)", fontSize: 20 }}>
        No projects yet
      </h3>
      <p style={{ color: "var(--text-secondary)", margin: "0 0 24px", fontSize: 14 }}>
        Be the first to showcase what you built during the 66 days.
      </p>
      <Link href="/submit" className="btn-gold">
        Submit Your Project
      </Link>
    </div>
  );
}
