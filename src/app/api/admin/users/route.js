import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getApplications } from "@/lib/applicationStore";
import {
  requireAdmin,
  requireSuperAdmin,
  assignAdminRole,
  revokeAdminRole,
} from "@/lib/adminAuth";

/**
 * GET: Lists Admins (super_admin + admin) and Candidates separately from Supabase Auth DB
 * Strictly protected: Requires verified database administrator token.
 */
export async function GET(request) {
  const auth = await requireAdmin(request);
  if (!auth.authorized) {
    return auth.errorResponse;
  }

  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase Admin client not configured." },
        { status: 500 }
      );
    }

    const applications = await getApplications();
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      return NextResponse.json(
        { error: `Database error querying users: ${error.message}` },
        { status: 500 }
      );
    }

    const allUsers = data?.users || [];
    const admins = [];
    const candidates = [];

    allUsers.forEach((u) => {
      const role = u.app_metadata?.role;
      const userApps = applications.filter(
        (a) => a.email?.toLowerCase() === u.email?.toLowerCase()
      );

      const userInfo = {
        id: u.id,
        email: u.email,
        name: u.user_metadata?.full_name || u.email?.split("@")[0],
        role: role || "candidate",
        createdAt: u.created_at,
        lastSignInAt: u.last_sign_in_at,
        provider: u.app_metadata?.provider || "email",
        providers: u.app_metadata?.providers || [u.app_metadata?.provider || "email"],
        applicationsCount: userApps.length,
        applications: userApps.map((a) => ({
          id: a.id,
          title: a.jobTitle,
          status: a.status,
        })),
      };

      if (role === "super_admin" || role === "admin") {
        admins.push(userInfo);
      } else {
        candidates.push(userInfo);
      }
    });

    // Also include any candidates from applications who applied directly
    const registeredEmails = new Set(allUsers.map((u) => u.email?.toLowerCase()));
    applications.forEach((app) => {
      const appEmail = app.email?.toLowerCase();
      if (!registeredEmails.has(appEmail)) {
        registeredEmails.add(appEmail);
        candidates.push({
          id: `cand_${app.id}`,
          email: app.email,
          name: app.candidateName,
          phone: app.phone,
          role: "candidate",
          createdAt: app.createdAt,
          lastSignInAt: app.createdAt,
          provider: "direct-applicant",
          providers: ["email"],
          applicationsCount: 1,
          applications: [{ id: app.id, title: app.jobTitle, status: app.status }],
        });
      }
    });

    return NextResponse.json({
      success: true,
      admins,
      candidates,
      totalAdmins: admins.length,
      totalCandidates: candidates.length,
    });
  } catch (err) {
    console.error("GET /api/admin/users error:", err);
    return NextResponse.json(
      { error: "Failed to retrieve users from database." },
      { status: 500 }
    );
  }
}

/**
 * POST: Super Admin action to assign 'admin' role in Supabase app_metadata
 * Strictly protected: Requires verified Super Administrator.
 * The app will NEVER create a super_admin.
 */
export async function POST(request) {
  const auth = await requireSuperAdmin(request);
  if (!auth.authorized) {
    return auth.errorResponse;
  }

  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Target email address is required." },
        { status: 400 }
      );
    }

    const updatedUser = await assignAdminRole({
      requesterUser: auth.user,
      targetEmail: email,
    });

    return NextResponse.json({
      success: true,
      message: `User ${email} assigned as Administrator in database.`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.app_metadata?.role,
      },
    });
  } catch (err) {
    console.error("POST /api/admin/users error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to assign administrator role." },
      { status: 400 }
    );
  }
}

/**
 * DELETE: Super Admin action to revoke 'admin' role in Supabase
 * Strictly protected: Requires verified Super Administrator.
 */
export async function DELETE(request) {
  const auth = await requireSuperAdmin(request);
  if (!auth.authorized) {
    return auth.errorResponse;
  }

  try {
    const { searchParams } = new URL(request.url);
    const targetEmail = searchParams.get("email");

    if (!targetEmail) {
      return NextResponse.json(
        { error: "Target email query parameter is required." },
        { status: 400 }
      );
    }

    const updatedUser = await revokeAdminRole({
      requesterUser: auth.user,
      targetEmail,
    });

    return NextResponse.json({
      success: true,
      message: `Admin privileges for ${targetEmail} revoked in database.`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.app_metadata?.role,
      },
    });
  } catch (err) {
    console.error("DELETE /api/admin/users error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to revoke admin privileges." },
      { status: 400 }
    );
  }
}
