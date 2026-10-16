import { NextResponse } from "next/server";
import { supabaseAdmin } from "./supabase";

/**
 * Server guard: Validates that the request contains a valid Bearer token
 * for an authorized Administrator (role: 'admin' or 'super_admin' in DB).
 */
export async function requireAdmin(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      authorized: false,
      errorResponse: NextResponse.json(
        { error: "Unauthorized: Missing administrative authorization token." },
        { status: 401 }
      ),
    };
  }

  const token = authHeader.substring(7).trim();
  const user = await getSupabaseUser({ token });

  if (!user) {
    return {
      authorized: false,
      errorResponse: NextResponse.json(
        { error: "Unauthorized: Invalid or expired session." },
        { status: 401 }
      ),
    };
  }

  const role = getAdminRoleFromUser(user);
  if (role !== "admin" && role !== "super_admin") {
    return {
      authorized: false,
      errorResponse: NextResponse.json(
        { error: "Forbidden: Administrative privileges required in database." },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, user, role };
}

/**
 * Server guard: Validates that the request contains a valid Bearer token
 * for a verified Super Administrator (role: 'super_admin' in DB).
 */
export async function requireSuperAdmin(request) {
  const check = await requireAdmin(request);
  if (!check.authorized) return check;

  if (check.role !== "super_admin") {
    return {
      authorized: false,
      errorResponse: NextResponse.json(
        { error: "Forbidden: Super Administrator privileges required in database." },
        { status: 403 }
      ),
    };
  }

  return check;
}

/**
 * Extracts the user from a Bearer token or Supabase Auth identifier
 */
export async function getSupabaseUser({ token, userId, email }) {
  if (!supabaseAdmin) {
    throw new Error("Supabase Admin client is not configured.");
  }

  // 1. Try resolving via JWT token
  if (token) {
    const cleanToken = token.replace(/^Bearer\s+/i, "").trim();
    const { data, error } = await supabaseAdmin.auth.getUser(cleanToken);
    if (!error && data?.user) {
      return data.user;
    }
  }

  // 2. Try resolving via user ID
  if (userId) {
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (!error && data?.user) {
      return data.user;
    }
  }

  // 3. Try resolving via email directly in Supabase DB
  if (email) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (!error && data?.users) {
      const match = data.users.find(
        (u) => u.email?.toLowerCase() === email.toLowerCase().trim()
      );
      if (match) return match;
    }
  }

  return null;
}

/**
 * Validates admin role strictly from Supabase DB `raw_app_meta_data`
 * (mapped to `user.app_metadata` in the JS SDK)
 * 
 * Returns: 'super_admin' | 'admin' | null
 */
export function getAdminRoleFromUser(user) {
  if (!user || !user.app_metadata) return null;
  const role = user.app_metadata.role;

  if (role === "super_admin") return "super_admin";
  if (role === "admin") return "admin";

  return null;
}

/**
 * Check if the user has super_admin role in app_metadata
 */
export function isSuperAdmin(user) {
  return user?.app_metadata?.role === "super_admin";
}

/**
 * Check if the user has admin or super_admin role in app_metadata
 */
export function isAdmin(user) {
  const role = user?.app_metadata?.role;
  return role === "admin" || role === "super_admin";
}

/**
 * Assigns an existing Supabase user the 'admin' role in app_metadata.
 * 
 * SECURITY RULES:
 * 1. ONLY a user with app_metadata.role === 'super_admin' can call this.
 * 2. The app CAN NEVER assign 'super_admin'. It is hardcoded to assign ONLY 'admin'.
 */
export async function assignAdminRole({ requesterUser, targetEmail }) {
  if (!isSuperAdmin(requesterUser)) {
    throw new Error("Forbidden: Only a verified Super Administrator can assign admin privileges.");
  }

  if (!targetEmail) {
    throw new Error("Target user email is required.");
  }

  const cleanEmail = targetEmail.toLowerCase().trim();
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error || !data?.users) {
    throw new Error("Failed to query user database in Supabase.");
  }

  const targetUser = data.users.find(
    (u) => u.email?.toLowerCase() === cleanEmail
  );

  if (!targetUser) {
    throw new Error(`No user found with email ${cleanEmail}. The user must register or exist in Supabase first.`);
  }

  // Prevent modifying an existing super_admin
  if (targetUser.app_metadata?.role === "super_admin") {
    throw new Error("Forbidden: Super Administrator accounts cannot be modified through the application.");
  }

  // Strictly set role to 'admin' (NEVER 'super_admin')
  const updatedAppMetadata = {
    ...targetUser.app_metadata,
    role: "admin",
  };

  const { data: updated, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
    targetUser.id,
    { app_metadata: updatedAppMetadata }
  );

  if (updateError) {
    throw new Error(`Failed to update app_metadata in Supabase: ${updateError.message}`);
  }

  return updated.user;
}

/**
 * Revokes 'admin' role from a user in Supabase.
 * 
 * SECURITY RULES:
 * 1. ONLY a user with app_metadata.role === 'super_admin' can call this.
 * 2. CANNOT remove a super_admin.
 */
export async function revokeAdminRole({ requesterUser, targetEmail }) {
  if (!isSuperAdmin(requesterUser)) {
    throw new Error("Forbidden: Only a verified Super Administrator can revoke admin privileges.");
  }

  if (!targetEmail) {
    throw new Error("Target user email is required.");
  }

  const cleanEmail = targetEmail.toLowerCase().trim();
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error || !data?.users) {
    throw new Error("Failed to query user database in Supabase.");
  }

  const targetUser = data.users.find(
    (u) => u.email?.toLowerCase() === cleanEmail
  );

  if (!targetUser) {
    throw new Error(`No user found with email ${cleanEmail}.`);
  }

  // Strictly prevent removing a super_admin
  if (targetUser.app_metadata?.role === "super_admin") {
    throw new Error("Forbidden: Super Administrator accounts cannot be removed via the application.");
  }

  const updatedAppMetadata = {
    ...targetUser.app_metadata,
    role: "candidate", // Reset to candidate
  };

  const { data: updated, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
    targetUser.id,
    { app_metadata: updatedAppMetadata }
  );

  if (updateError) {
    throw new Error(`Failed to revoke admin role in Supabase: ${updateError.message}`);
  }

  return updated.user;
}

/**
 * Generates a password reset recovery link for a specific user.
 * 
 * SECURITY RULES:
 * 1. ONLY a user with app_metadata.role === 'super_admin' can call this.
 */
export async function generatePasswordResetLink({ requesterUser, targetEmail }) {
  if (!isSuperAdmin(requesterUser)) {
    throw new Error("Forbidden: Only a verified Super Administrator can generate password reset links.");
  }

  if (!targetEmail) {
    throw new Error("Target email is required.");
  }

  const cleanEmail = targetEmail.toLowerCase().trim();

  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: "recovery",
    email: cleanEmail,
  });

  if (error) {
    throw new Error(`Supabase password reset generation failed: ${error.message}`);
  }

  return {
    actionLink: data?.properties?.action_link || null,
    email: cleanEmail,
  };
}
