import { NextResponse } from "next/server";
import { getSupabaseUser, getAdminRoleFromUser } from "@/lib/adminAuth";

/**
 * Verifies if the authenticated session user has administrative privileges.
 * Strictly verifies against Supabase DB raw_app_meta_data (user.app_metadata).
 * NO local authentication, NO environment variable fallbacks.
 */
export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }

    const body = await request.json().catch(() => ({}));
    const { token: bodyToken, userId, email } = body;

    const resolvedToken = token || bodyToken;

    if (!resolvedToken && !userId && !email) {
      return NextResponse.json(
        { authorized: false, error: "Authentication credentials required." },
        { status: 401 }
      );
    }

    // Query Supabase directly
    const user = await getSupabaseUser({
      token: resolvedToken,
      userId,
      email,
    });

    if (!user) {
      return NextResponse.json(
        { authorized: false, error: "User account not found in database." },
        { status: 404 }
      );
    }

    // Role is strictly read from user.app_metadata.role (Supabase raw_app_meta_data)
    const role = getAdminRoleFromUser(user);

    if (!role) {
      return NextResponse.json(
        {
          authorized: false,
          role: null,
          error: "Access denied. Your database account does not have an administrative role (app_metadata.role).",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      authorized: true,
      role, // 'admin' | 'super_admin'
      adminProfile: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email?.split("@")[0],
        role,
        lastSignInAt: user.last_sign_in_at,
        provider: user.app_metadata?.provider || "email",
        providers: user.app_metadata?.providers || ["email"],
      },
    });
  } catch (err) {
    console.error("POST /api/admin/auth/verify error:", err);
    return NextResponse.json(
      { authorized: false, error: "Internal error verifying database admin status." },
      { status: 500 }
    );
  }
}
