export interface ProjectRow {
  id: string;
  created_at: string;
  builder_name: string;
  builder_email: string;
  builder_linkedin: string | null;
  builder_bio: string | null;
  project_name: string;
  live_url: string;
  what_you_built: string;
  who_is_it_for: string;
  problem_it_solves: string;
  hardest_thing: string;
  what_surprised_you: string;
  day_number: number | null;
  tags: string[] | null;
  approved: boolean;
}

export interface ProjectInsert {
  builder_name: string;
  builder_email: string;
  builder_linkedin?: string | null;
  builder_bio?: string | null;
  project_name: string;
  live_url: string;
  what_you_built: string;
  who_is_it_for: string;
  problem_it_solves: string;
  hardest_thing: string;
  what_surprised_you: string;
  day_number?: number | null;
  tags?: string[] | null;
  approved?: boolean;
}

export interface AllowedEmailRow {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface OtpSessionRow {
  id: string;
  email: string;
  otp: string;
  expires_at: string;
  created_at: string;
}

export interface OtpSessionInsert {
  email: string;
  otp: string;
  expires_at: string;
}

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: ProjectRow;
        Insert: ProjectInsert;
        Update: Partial<ProjectInsert>;
        Relationships: [];
      };
      allowed_emails: {
        Row: AllowedEmailRow;
        Insert: { email: string; name: string };
        Update: Partial<{ email: string; name: string }>;
        Relationships: [];
      };
      otp_sessions: {
        Row: OtpSessionRow;
        Insert: OtpSessionInsert;
        Update: Partial<OtpSessionInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

// Convenience alias
export type Project = ProjectRow;
