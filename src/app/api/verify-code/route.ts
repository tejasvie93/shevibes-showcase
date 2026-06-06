import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { code } = await request.json();

  if (!code || typeof code !== "string") {
    return Response.json({ error: "Code is required" }, { status: 400 });
  }

  const validCode = process.env.COHORT_CODE;

  if (!validCode) {
    return Response.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  if (code.trim().toLowerCase() !== validCode.toLowerCase()) {
    return Response.json(
      { error: "Incorrect code. Check with your SheVibes cohort." },
      { status: 401 }
    );
  }

  return Response.json({ success: true });
}
