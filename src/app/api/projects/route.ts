import { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import type { ProjectRow, ProjectInsert } from "@/lib/database.types";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code, ...projectData } = body;

  // Verify cohort code
  const validCode = process.env.COHORT_CODE;
  if (!validCode || !code || code.trim().toLowerCase() !== validCode.toLowerCase()) {
    return Response.json({ error: "Invalid cohort code" }, { status: 401 });
  }

  // Validate required fields
  const required: (keyof ProjectInsert)[] = [
    "builder_name",
    "builder_email",
    "project_name",
    "live_url",
    "what_you_built",
    "who_is_it_for",
    "problem_it_solves",
  ];

  for (const field of required) {
    if (!projectData[field] || !String(projectData[field]).trim()) {
      return Response.json({ error: `Missing required field: ${field}` }, { status: 400 });
    }
  }

  // Validate URL
  try {
    new URL(projectData.live_url);
  } catch {
    return Response.json(
      { error: "Please enter a valid URL for your live project" },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  const insert: ProjectInsert = {
    builder_name: projectData.builder_name.trim(),
    builder_email: projectData.builder_email.toLowerCase().trim(),
    builder_linkedin: projectData.builder_linkedin?.trim() || null,
    builder_bio: projectData.builder_bio?.trim() || null,
    project_name: projectData.project_name.trim(),
    live_url: projectData.live_url.trim(),
    what_you_built: projectData.what_you_built.trim(),
    who_is_it_for: projectData.who_is_it_for.trim(),
    problem_it_solves: projectData.problem_it_solves.trim(),
    hardest_thing: projectData.hardest_thing?.trim() || "",
    what_surprised_you: projectData.what_surprised_you?.trim() || "",
    linkedin_post_url: projectData.linkedin_post_url?.trim() || null,
    day_number: projectData.day_number ? parseInt(projectData.day_number) : null,
    tags: projectData.tags ? (projectData.tags as string[]).filter(Boolean) : null,
    approved: true,
  };

  const { data, error } = await supabase
    .from("projects")
    .insert(insert)
    .select()
    .single() as { data: ProjectRow | null; error: unknown };

  if (error) {
    console.error("Insert error:", error);
    return Response.json({ error: "Failed to save project. Please try again." }, { status: 500 });
  }

  return Response.json({ success: true, project: data }, { status: 201 });
}
