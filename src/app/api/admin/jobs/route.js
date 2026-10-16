import { NextResponse } from "next/server";
import { getJobs, createJob } from "@/lib/jobStore";
import { requireAdmin } from "@/lib/adminAuth";

/**
 * GET /api/admin/jobs
 * Strictly protected: Requires verified database administrator token.
 */
export async function GET(request) {
  const auth = await requireAdmin(request);
  if (!auth.authorized) {
    return auth.errorResponse;
  }

  try {
    const jobs = await getJobs({ onlyActive: false });
    return NextResponse.json({
      success: true,
      jobs,
      total: jobs.length,
    });
  } catch (err) {
    console.error("GET /api/admin/jobs error:", err);
    return NextResponse.json(
      { error: "Failed to fetch jobs from database." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/jobs
 * Strictly protected: Requires verified database administrator token.
 */
export async function POST(request) {
  const auth = await requireAdmin(request);
  if (!auth.authorized) {
    return auth.errorResponse;
  }

  try {
    const body = await request.json();

    if (!body.title || !body.department || !body.summary) {
      return NextResponse.json(
        { error: "Title, Department, and Summary are required." },
        { status: 400 }
      );
    }

    const newJob = await createJob(body);

    return NextResponse.json({
      success: true,
      job: newJob,
      message: "Job position published successfully in Supabase database.",
    });
  } catch (err) {
    console.error("POST /api/admin/jobs error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create job position." },
      { status: 500 }
    );
  }
}
