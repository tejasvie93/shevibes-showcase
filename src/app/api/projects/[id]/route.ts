import { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { email, code, ...updates } = body;

  const validCode = process.env.COHORT_CODE;
  if (!validCode || !code || code.trim().toLowerCase() !== validCode.toLowerCase()) {
    return Response.json({ error: "Invalid cohort code" }, { status: 401 });
  }

  if (!email?.trim()) {
    return Response.json({ error: "Email is required" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: existing, error: fetchError } = await supabase
    .from("projects")
    .select("builder_email")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return Response.json({ error: "Project not found" }, { status: 404 });
  }

  if (existing.builder_email.toLowerCase() !== email.toLowerCase().trim()) {
    return Response.json({ error: "Email does not match this project" }, { status: 403 });
  }

  if (updates.live_url) {
    try {
      new URL(updates.live_url);
    } catch {
      return Response.json({ error: "Please enter a valid URL" }, { status: 400 });
    }
  }

  const updateData: Record<string, unknown> = {};
  const stringFields = [
    "builder_name", "builder_linkedin", "builder_bio",
    "project_name", "live_url", "what_you_built", "who_is_it_for",
    "problem_it_solves", "hardest_thing", "what_surprised_you",
  ];

  for (const f of stringFields) {
    if (f in updates) updateData[f] = updates[f]?.trim() || null;
  }
  if ("day_number" in updates) {
    updateData.day_number = updates.day_number ? parseInt(updates.day_number) : null;
  }
  if ("tags" in updates) {
    updateData.tags = Array.isArray(updates.tags) ? updates.tags.filter(Boolean) : null;
  }

  const { data, error } = await supabase
    .from("projects")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Update error:", error);
    return Response.json({ error: "Failed to update project" }, { status: 500 });
  }

  return Response.json({ success: true, project: data });
}
