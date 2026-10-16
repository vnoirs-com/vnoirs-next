import { NextResponse } from "next/server";
import { getApplications } from "@/lib/applicationStore";
import { requireAdmin } from "@/lib/adminAuth";

/**
 * GET /api/admin/applications
 * Strictly protected: Requires verified database administrator token.
 */
export async function GET(request) {
  const auth = await requireAdmin(request);
  if (!auth.authorized) {
    return auth.errorResponse;
  }

  try {
    const applications = await getApplications();

    const stats = {
      total: applications.length,
      pending: applications.filter((a) => a.status === "Pending").length,
      reviewing: applications.filter((a) => a.status === "Reviewing").length,
      interviewScheduled: applications.filter((a) => a.status === "Interview Scheduled").length,
      shortlisted: applications.filter((a) => a.status === "Shortlisted").length,
      rejected: applications.filter((a) => a.status === "Rejected").length,
    };

    return NextResponse.json({
      success: true,
      applications,
      stats,
    });
  } catch (err) {
    console.error("Admin applications GET error:", err);
    return NextResponse.json(
      { error: "Failed to retrieve candidate applications." },
      { status: 500 }
    );
  }
}
