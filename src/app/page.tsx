import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Project } from "@/lib/database.types";

const PER_PAGE = 5;

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

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function GalleryPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const allProjects = await getProjects();
  const totalPages = Math.max(1, Math.ceil(allProjects.length / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const projects = allProjects.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  return (
    <div>
      {/* Hero */}
      <section
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "72px 24px 56px",
        }}
      >
        {/* Label */}
        <p
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: "var(--gold)",
            margin: "0 0 24px",
          }}
        >
          SheVibes Cohort 0
        </p>

        {/* Heading */}
        <h1
          style={{
            fontSize: "clamp(40px, 7vw, 72px)",
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-2px",
            margin: "0 0 28px",
            color: "var(--text-primary)",
          }}
        >
          66 days.{" "}
          <span className="gold-text">One<br />woman</span>{" "}
          behind<br />every build.
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.65,
            margin: "0 0 40px",
            maxWidth: 560,
          }}
        >
          <span style={{ color: "var(--text-secondary)" }}>No demos, no dummies. </span>
          <span className="gold-text">A real problem, a real product, and the woman who shipped it</span>
          <span style={{ color: "var(--text-secondary)" }}> — built from scratch with AI over 66 days.</span>
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <Link
            href="/submit"
            className="btn-gold"
            style={{ borderRadius: 99, padding: "14px 32px", fontSize: 16 }}
          >
            Add your project →
          </Link>
          <a
            href="#builders"
            className="btn-ghost"
            style={{ borderRadius: 99, padding: "14px 32px", fontSize: 16 }}
          >
            Meet the builders
          </a>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: 56,
            marginTop: 64,
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "Builders shipped", value: allProjects.length },
            { label: "Days of building", value: 66 },
          ].map((stat) => (
            <div key={stat.label}>
              <div
                style={{
                  fontSize: "clamp(40px, 6vw, 64px)",
                  fontWeight: 900,
                  color: "var(--text-primary)",
                  letterSpacing: "-2px",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  marginTop: 6,
                }}
              >
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
          maxWidth: 800,
          margin: "0 auto",
        }}
      />

      {/* Builders directory */}
      <section
        id="builders"
        style={{ maxWidth: 800, margin: "0 auto", padding: "56px 24px 0" }}
      >
        <h2
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: "var(--gold)",
            margin: "0 0 28px",
          }}
        >
          Meet the builders
        </h2>

        {allProjects.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No builders yet — be the first.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {allProjects.map((project, i) => (
              <BuilderRow key={project.id} project={project} index={i + 1} />
            ))}
          </div>
        )}

        {/* Browse Projects pill */}
        <div style={{ marginTop: 40, paddingBottom: 56 }}>
          <a
            href="#projects"
            className="btn-ghost"
            style={{ borderRadius: 99, padding: "12px 28px", fontSize: 15 }}
          >
            Browse Projects
          </a>
        </div>
      </section>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "linear-gradient(to right, transparent, var(--border), transparent)",
          maxWidth: 800,
          margin: "0 auto",
        }}
      />

      {/* Project list */}
      <section
        id="projects"
        style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 80px" }}
      >
        {allProjects.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* List header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <h2
                style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}
              >
                All Projects
              </h2>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                {(safePage - 1) * PER_PAGE + 1}–
                {Math.min(safePage * PER_PAGE, allProjects.length)} of {allProjects.length}
              </span>
            </div>

            {/* Project rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {projects.map((project, i) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  index={(safePage - 1) * PER_PAGE + i + 1}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  marginTop: 40,
                }}
              >
                {safePage > 1 && (
                  <Link
                    href={`/?page=${safePage - 1}#projects`}
                    className="btn-ghost"
                    style={{ padding: "8px 18px", fontSize: 13 }}
                  >
                    ← Previous
                  </Link>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/?page=${p}#projects`}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: p === safePage ? 700 : 400,
                      textDecoration: "none",
                      background: p === safePage ? "var(--gold)" : "var(--surface)",
                      color: p === safePage ? "#0d1117" : "var(--text-secondary)",
                      border: `1px solid ${p === safePage ? "var(--gold)" : "var(--border)"}`,
                      transition: "all 0.15s",
                    }}
                  >
                    {p}
                  </Link>
                ))}

                {safePage < totalPages && (
                  <Link
                    href={`/?page=${safePage + 1}#projects`}
                    className="btn-ghost"
                    style={{ padding: "8px 18px", fontSize: 13 }}
                  >
                    Next →
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

function BuilderRow({ project, index }: { project: Project; index: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "16px 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Index */}
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "var(--text-muted)",
          width: 20,
          flexShrink: 0,
          textAlign: "right",
        }}
      >
        {index}
      </span>

      {/* Avatar */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "var(--gold-dim)",
          border: "1px solid rgba(245,166,35,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          fontWeight: 800,
          color: "var(--gold)",
          flexShrink: 0,
        }}
      >
        {project.builder_name.charAt(0).toUpperCase()}
      </div>

      {/* Name + LinkedIn */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "var(--text-primary)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {project.builder_name}
          {project.builder_linkedin && (
            <a
              href={project.builder_linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                marginLeft: 8,
                fontSize: 11,
                fontWeight: 600,
                color: "var(--text-muted)",
                textDecoration: "none",
                border: "1px solid var(--border)",
                borderRadius: 4,
                padding: "1px 6px",
                letterSpacing: "0.3px",
                verticalAlign: "middle",
              }}
            >
              LinkedIn ↗
            </a>
          )}
        </div>
      </div>

      {/* What they built */}
      <Link
        href={`/project/${project.id}`}
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "var(--gold)",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: 4,
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        {project.project_name} ↗
      </Link>
    </div>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <Link href={`/project/${project.id}`} style={{ textDecoration: "none" }}>
      <div
        className="project-card"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          cursor: "pointer",
        }}
      >
        {/* Index number */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            color: "var(--text-muted)",
            flexShrink: 0,
          }}
        >
          {index}
        </div>

        {/* Project info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.2px",
              marginBottom: 4,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {project.project_name}
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "var(--gold-dim)",
                border: "1px solid rgba(245,166,35,0.2)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 700,
                color: "var(--gold)",
                flexShrink: 0,
              }}
            >
              {project.builder_name.charAt(0).toUpperCase()}
            </span>
            Built by {project.builder_name}
          </div>
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {project.day_number && (
            <span className="day-badge">Day {project.day_number}</span>
          )}
          <span style={{ fontSize: 13, color: "var(--gold)", fontWeight: 600 }}>
            View →
          </span>
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
