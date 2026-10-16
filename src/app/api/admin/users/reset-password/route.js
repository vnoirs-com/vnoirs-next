import { NextResponse } from "next/server";
import { requireSuperAdmin, generatePasswordResetLink } from "@/lib/adminAuth";

/**
 * Super Admin action: Send or generate a password reset recovery link
 * for a specific administrator or candidate.
 * Strictly protected: Requires verified Super Administrator token.
 */
export async function POST(request) {
  const auth = await requireSuperAdmin(request);
  if (!auth.authorized) {
    return auth.errorResponse;
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Target user email is required." },
        { status: 400 }
      );
    }

    const result = await generatePasswordResetLink({
      requesterUser: auth.user,
      targetEmail: email,
    });

    return NextResponse.json({
      success: true,
      message: `Password reset recovery link generated for ${email}.`,
      actionLink: result.actionLink,
    });
  } catch (err) {
    console.error("POST /api/admin/users/reset-password error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate password reset link." },
      { status: 500 }
    );
  }
}
