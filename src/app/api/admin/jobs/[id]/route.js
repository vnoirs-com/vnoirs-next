import { NextResponse } from "next/server";
import { setJobStatus, deleteJob } from "@/lib/jobStore";
import { requireAdmin } from "@/lib/adminAuth";

export async function PATCH(request, { params }) {
  const auth = await requireAdmin(request);
  if (!auth.authorized) {
    return auth.errorResponse;
  }

  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.status || !["active", "expired"].includes(body.status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'active' or 'expired'." },
        { status: 400 }
      );
    }

    const updatedJob = await setJobStatus(id, body.status);

    return NextResponse.json({
      success: true,
      job: updatedJob,
      message: `Job position marked as ${body.status}.`,
    });
  } catch (err) {
    console.error("PATCH /api/admin/jobs/[id] error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update job status." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const auth = await requireAdmin(request);
  if (!auth.authorized) {
    return auth.errorResponse;
  }

  try {
    const { id } = await params;

    const result = await deleteJob(id);

    return NextResponse.json({
      success: true,
      message: "Job position permanently deleted from database.",
      deletedId: result.deletedId,
    });
  } catch (err) {
    console.error("DELETE /api/admin/jobs/[id] error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete job position." },
      { status: 500 }
    );
  }
}
