import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Project } from "@/lib/database.types";
import EditForm from "./EditForm";

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

export default async function EditPage({ params }: Props) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();
  return <EditForm project={project} />;
}
