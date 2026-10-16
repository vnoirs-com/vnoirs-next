import { NextResponse } from "next/server";
import { getJobs } from "@/lib/jobStore";

/**
 * GET /api/jobs (Public Careers Endpoint)
 * Strictly public: Returns only active job positions for prospective candidates.
 * Expired and internal positions are never exposed here.
 */
export async function GET() {
  try {
    const jobs = await getJobs({ onlyActive: true });

    return NextResponse.json({
      success: true,
      jobs,
      total: jobs.length,
    });
  } catch (err) {
    console.error("GET /api/jobs error:", err);
    return NextResponse.json(
      { error: "Failed to fetch active job openings." },
      { status: 500 }
    );
  }
}
