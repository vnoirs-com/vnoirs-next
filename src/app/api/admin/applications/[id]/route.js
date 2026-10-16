import { NextResponse } from "next/server";
import { updateApplicationStatus } from "@/lib/applicationStore";
import { requireAdmin } from "@/lib/adminAuth";

export async function PATCH(req, { params }) {
  const auth = await requireAdmin(req);
  if (!auth.authorized) {
    return auth.errorResponse;
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Missing status field." }, { status: 400 });
    }

    const updated = await updateApplicationStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Status updated to ${status}`,
      application: updated,
    });
  } catch (err) {
    console.error("Admin application status PATCH error:", err);
    return NextResponse.json(
      { error: "Failed to update application status." },
      { status: 500 }
    );
  }
}
