"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  Briefcase,
  FileText,
  Mail,
  Phone,
  Video,
  Send,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  X,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Download,
  Check,
  Plus,
  Trash2,
  Power,
  PowerOff,
  UserPlus,
  Lock,
  LogOut,
  LogIn,
  KeyRound,
  Shield,
  Search,
  Filter,
  Copy,
  ExternalLink,
} from "lucide-react";
import { supabaseAdminClient } from "@/lib/supabase";

const STATUS_CONFIG = {
  Pending: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  Reviewing: {
    label: "Under Review",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    dot: "bg-indigo-500",
  },
  "Interview Scheduled": {
    label: "Interview Scheduled",
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-500",
  },
  Shortlisted: {
    label: "Shortlisted",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  Rejected: {
    label: "Rejected",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    dot: "bg-rose-500",
  },
};

export default function AdminDashboardPage() {
  // Isolated Admin Session (uses 'vnoirs-admin-session' in localStorage)
  const [adminSession, setAdminSession] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Database-only Authorization state (Truth check from Supabase DB raw_app_meta_data)
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminRole, setAdminRole] = useState(null); // strictly 'super_admin' | 'admin' | null
  const [adminProfile, setAdminProfile] = useState(null);
  const [authError, setAuthError] = useState("");

  // DB-only Email & Password Login form state (NO Google login)
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Tabs: "applications" | "users" | "jobs"
  const [activeTab, setActiveTab] = useState("applications");
  const [userDirectorySubTab, setUserDirectorySubTab] = useState("admins"); // "admins" | "candidates"

  // Data states
  const [applications, setApplications] = useState([]);
  const [adminsList, setAdminsList] = useState([]);
  const [candidatesList, setCandidatesList] = useState([]);
  const [jobsList, setJobsList] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewing: 0,
    interviewScheduled: 0,
    shortlisted: 0,
    rejected: 0,
  });

  const [loadingData, setLoadingData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [jobFilter, setJobFilter] = useState("All");
  const [expandedAppId, setExpandedAppId] = useState(null);

  // Toast feedback
  const [toast, setToast] = useState(null);

  // Modals state
  const [interviewModalApp, setInterviewModalApp] = useState(null);
  const [interviewForm, setInterviewForm] = useState({
    scheduledAt: "",
    format: "Google Meet",
    meetingLink: "https://meet.google.com/new",
    interviewer: "Vnoirs Engineering Leadership",
    notes:
      "Technical architecture review, code walkthrough, and team alignment discussion.",
  });
  const [interviewSending, setInterviewSending] = useState(false);

  // Post Job modal state
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [jobSubmitting, setJobSubmitting] = useState(false);
  const [newJobForm, setNewJobForm] = useState({
    title: "",
    department: "Web Engineering",
    location: "Remote",
    type: "Full-Time",
    experience: "3+ Years",
    salary: "Market Competitive",
    summary: "",
    responsibilities: "",
    requirements: "",
    tags: "",
  });

  // Assign Admin modal state (for Super Admin only)
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [adminSubmitting, setAdminSubmitting] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");

  // Password Reset Modal (for Super Admin only)
  const [resetPasswordModal, setResetPasswordModal] = useState(null); // { email, link: null, loading: false }
  const [copiedLink, setCopiedLink] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  /**
   * Database Truth Check: Verifies the token against the Supabase DB raw_app_meta_data
   */
  const verifyDatabaseRole = useCallback(async (token) => {
    if (!token) {
      setIsAuthorized(false);
      setAdminRole(null);
      setIsVerifying(false);
      return;
    }

    setIsVerifying(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (res.ok && data.authorized) {
        setIsAuthorized(true);
        setAdminRole(data.role); // 'super_admin' | 'admin'
        setAdminProfile(data.adminProfile);
        setAuthError("");
      } else {
        setIsAuthorized(false);
        setAdminRole(null);
        setAuthError(
          data.error ||
            "Access denied. Your database account is not configured with an administrator role.",
        );
      }
    } catch (err) {
      console.error("Admin auth check error:", err);
      setIsAuthorized(false);
      setAuthError("Failed to verify authorization with database.");
    } finally {
      setIsVerifying(false);
    }
  }, []);

  /**
   * Initialize isolated admin session on mount
   */
  useEffect(() => {
    if (!supabaseAdminClient) {
      setAuthLoading(false);
      setIsVerifying(false);
      return;
    }

    // 1. Get initial session from 'vnoirs-admin-session'
    supabaseAdminClient.auth.getSession().then(({ data: { session } }) => {
      setAdminSession(session);
      setAdminUser(session?.user ?? null);
      setAuthLoading(false);
      if (session?.access_token) {
        verifyDatabaseRole(session.access_token);
      } else {
        setIsVerifying(false);
      }
    });

    // 2. Listen to auth changes on isolated admin client
    const {
      data: { subscription },
    } = supabaseAdminClient.auth.onAuthStateChange((_event, session) => {
      setAdminSession(session);
      setAdminUser(session?.user ?? null);
      setAuthLoading(false);
      if (session?.access_token) {
        verifyDatabaseRole(session.access_token);
      } else {
        setIsAuthorized(false);
        setAdminRole(null);
        setIsVerifying(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [verifyDatabaseRole]);

  /**
   * Fetch dashboard data using isolated admin token
   */
  const loadDashboardData = useCallback(async () => {
    if (!isAuthorized || !adminSession?.access_token) return;
    setLoadingData(true);
    try {
      const headers = { Authorization: `Bearer ${adminSession.access_token}` };

      // 1. Applications & Stats
      const appsRes = await fetch("/api/admin/applications", { headers });
      const appsData = await appsRes.json();
      if (appsData.success) {
        setApplications(appsData.applications || []);
        if (appsData.stats) setStats(appsData.stats);
      }

      // 2. Users (Separated Admins & Candidates directly from Supabase Auth DB)
      const usersRes = await fetch("/api/admin/users", { headers });
      const usersData = await usersRes.json();
      if (usersData.success) {
        setAdminsList(usersData.admins || []);
        setCandidatesList(usersData.candidates || []);
      }

      // 3. Jobs (Including active & expired)
      const jobsRes = await fetch("/api/admin/jobs", { headers });
      const jobsData = await jobsRes.json();
      if (jobsData.success) {
        setJobsList(jobsData.jobs || []);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      showToast("Failed to load dashboard data.", "error");
    } finally {
      setLoadingData(false);
      setRefreshing(false);
    }
  }, [isAuthorized, adminSession]);

  useEffect(() => {
    if (isAuthorized) {
      loadDashboardData();
    }
  }, [isAuthorized, loadDashboardData]);

  // Handle Admin Database Email/Password Login
  const handleAdminPasswordLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword || !supabaseAdminClient) return;
    setLoginSubmitting(true);
    setAuthError("");

    try {
      const { data, error } = await supabaseAdminClient.auth.signInWithPassword(
        {
          email: loginEmail,
          password: loginPassword,
        },
      );

      if (error) throw error;

      if (data?.session?.access_token) {
        await verifyDatabaseRole(data.session.access_token);
        showToast("Signed in as Administrator.");
      }
    } catch (err) {
      console.error("Admin login error:", err);
      setAuthError(err.message || "Invalid database email or password.");
    } finally {
      setLoginSubmitting(false);
    }
  };

  // Handle Admin Sign Out
  const handleSignOut = async () => {
    if (supabaseAdminClient) {
      await supabaseAdminClient.auth.signOut();
    }
    setAdminSession(null);
    setAdminUser(null);
    setIsAuthorized(false);
    setAdminRole(null);
    setAdminProfile(null);
    showToast("Signed out of Admin Portal.");
  };

  // Handle Status Update
  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/applications/${appId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminSession?.access_token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setApplications((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a)),
        );
        showToast(`Application marked as "${newStatus}"`);
        loadDashboardData();
      } else {
        showToast(data.error || "Failed to update status", "error");
      }
    } catch (err) {
      console.error("Status update error:", err);
      showToast("Network error updating status", "error");
    }
  };

  // Handle Interview Schedule Submission
  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!interviewModalApp) return;

    if (!interviewForm.scheduledAt) {
      showToast("Please choose an interview date and time.", "error");
      return;
    }

    setInterviewSending(true);
    try {
      const res = await fetch("/api/admin/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminSession?.access_token}`,
        },
        body: JSON.stringify({
          applicationId: interviewModalApp.id,
          candidateName: interviewModalApp.candidateName,
          candidateEmail: interviewModalApp.email,
          jobTitle: interviewModalApp.jobTitle,
          ...interviewForm,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(
          `Interview invitation dispatched to ${interviewModalApp.email}`,
        );
        setApplications((prev) =>
          prev.map((a) =>
            a.id === interviewModalApp.id
              ? {
                  ...a,
                  status: "Interview Scheduled",
                  interview: data.interview,
                }
              : a,
          ),
        );
        setInterviewModalApp(null);
        loadDashboardData();
      } else {
        showToast(data.error || "Failed to schedule interview", "error");
      }
    } catch (err) {
      console.error("Interview scheduling error:", err);
      showToast("Error dispatching interview email", "error");
    } finally {
      setInterviewSending(false);
    }
  };

  // Handle Post New Job
  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!newJobForm.title || !newJobForm.department || !newJobForm.summary) {
      showToast("Title, Department, and Summary are required.", "error");
      return;
    }

    setJobSubmitting(true);
    try {
      const res = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminSession?.access_token}`,
        },
        body: JSON.stringify(newJobForm),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`New position "${data.job.title}" published!`);
        setJobsList((prev) => [data.job, ...prev]);
        setIsNewJobModalOpen(false);
        setNewJobForm({
          title: "",
          department: "Web Engineering",
          location: "Remote",
          type: "Full-Time",
          experience: "3+ Years",
          salary: "Market Competitive",
          summary: "",
          responsibilities: "",
          requirements: "",
          tags: "",
        });
      } else {
        showToast(data.error || "Failed to publish job opening", "error");
      }
    } catch (err) {
      console.error("Job creation error:", err);
      showToast("Network error creating job", "error");
    } finally {
      setJobSubmitting(false);
    }
  };

  // Handle Toggle Job Status (Active vs Expired)
  const handleToggleJobStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === "expired" ? "active" : "expired";
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminSession?.access_token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setJobsList((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j)),
        );
        showToast(`Job status updated to "${newStatus}".`);
      } else {
        showToast(data.error || "Failed to update job status", "error");
      }
    } catch (err) {
      console.error("Job toggle error:", err);
      showToast("Network error updating job", "error");
    }
  };

  // Handle Delete Job
  const handleDeleteJob = async (jobId, jobTitle) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete "${jobTitle}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminSession?.access_token}`,
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setJobsList((prev) => prev.filter((j) => j.id !== jobId));
        showToast(`Job position "${jobTitle}" deleted.`);
      } else {
        showToast(data.error || "Failed to delete job", "error");
      }
    } catch (err) {
      console.error("Job deletion error:", err);
      showToast("Network error deleting job", "error");
    }
  };

  // Super Admin Action: Assign Admin (Strictly assigns 'admin', NEVER 'super_admin')
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminEmail || !newAdminEmail.includes("@")) {
      showToast("Please enter a valid user email address.", "error");
      return;
    }

    setAdminSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminSession?.access_token}`,
        },
        body: JSON.stringify({
          email: newAdminEmail,
          requesterEmail: adminUser?.email,
          requesterId: adminUser?.id,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(
          data.message || "User assigned as Administrator in database.",
        );
        setIsAddAdminModalOpen(false);
        setNewAdminEmail("");
        loadDashboardData();
      } else {
        showToast(data.error || "Failed to assign administrator role", "error");
      }
    } catch (err) {
      console.error("Add admin error:", err);
      showToast("Network error adding administrator", "error");
    } finally {
      setAdminSubmitting(false);
    }
  };

  // Super Admin Action: Revoke Admin Access
  const handleRevokeAdmin = async (targetEmail) => {
    if (
      !window.confirm(`Revoke administrator privileges for ${targetEmail}?`)
    ) {
      return;
    }

    try {
      const res = await fetch(
        `/api/admin/users?email=${encodeURIComponent(targetEmail)}&requesterEmail=${encodeURIComponent(
          adminUser?.email || "",
        )}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminSession?.access_token}`,
          },
        },
      );

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Admin access revoked for ${targetEmail}.`);
        loadDashboardData();
      } else {
        showToast(data.error || "Failed to revoke admin access", "error");
      }
    } catch (err) {
      console.error("Revoke admin error:", err);
      showToast("Network error revoking admin access", "error");
    }
  };

  // Super Admin Action: Generate and Send Password Reset Link
  const handleGeneratePasswordReset = async (targetEmail) => {
    setResetPasswordModal({ email: targetEmail, link: null, loading: true });
    setCopiedLink(false);

    try {
      const res = await fetch("/api/admin/users/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminSession?.access_token}`,
        },
        body: JSON.stringify({
          email: targetEmail,
          requesterEmail: adminUser?.email,
          requesterId: adminUser?.id,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResetPasswordModal({
          email: targetEmail,
          link: data.actionLink,
          loading: false,
        });
        showToast(`Password recovery link generated for ${targetEmail}.`);
      } else {
        showToast(
          data.error || "Failed to generate password reset link.",
          "error",
        );
        setResetPasswordModal(null);
      }
    } catch (err) {
      console.error("Password reset error:", err);
      showToast("Network error generating password reset link.", "error");
      setResetPasswordModal(null);
    }
  };

  // Copy password reset link
  const handleCopyResetLink = () => {
    if (resetPasswordModal?.link) {
      navigator.clipboard.writeText(resetPasswordModal.link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  // Filtered applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesStatus =
        statusFilter === "All" || app.status === statusFilter;
      const matchesJob =
        jobFilter === "All" ||
        app.jobId === jobFilter ||
        app.jobTitle === jobFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        app.candidateName?.toLowerCase().includes(q) ||
        app.email?.toLowerCase().includes(q) ||
        app.jobTitle?.toLowerCase().includes(q) ||
        app.phone?.toLowerCase().includes(q);

      return matchesStatus && matchesJob && matchesSearch;
    });
  }, [applications, statusFilter, jobFilter, searchQuery]);

  // Filtered Candidates
  const filteredCandidates = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return candidatesList;
    return candidatesList.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q),
    );
  }, [candidatesList, searchQuery]);

  // Filtered Admins
  const filteredAdmins = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return adminsList;
    return adminsList.filter(
      (a) =>
        a.name?.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q),
    );
  }, [adminsList, searchQuery]);

  // Loading Screen while verifying auth
  if (authLoading || isVerifying) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-slate-700">
        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-4">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">
          Verifying Database Privileges
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Validating Supabase database credentials (raw_app_meta_data.role)...
        </p>
      </div>
    );
  }

  // GATE SCREEN: If user is not logged in OR not authorized in Supabase DB
  if (!adminSession || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-600/20 mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Vnoirs Executive Portal
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Restricted database-authenticated administrative area.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10">
            {/* If user is logged in as a candidate, show Unauthorized Warning */}
            {adminUser && !isAuthorized && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <p className="font-semibold text-rose-900">
                      Access Denied: Admin Role Required
                    </p>
                    <p className="mt-1">
                      Account{" "}
                      <span className="font-mono font-medium">
                        {adminUser.email}
                      </span>{" "}
                      does not have{" "}
                      <code className="bg-rose-100 px-1 py-0.5 rounded text-rose-900 font-mono">
                        raw_app_meta_data: &#123; role: "admin" &#125;
                      </code>{" "}
                      in the database.
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-rose-200/60 text-xs">
                  <button
                    onClick={handleSignOut}
                    className="text-rose-700 hover:text-rose-900 font-semibold underline cursor-pointer"
                  >
                    Sign out to switch account
                  </button>
                </div>
              </div>
            )}

            {/* Email/Password Admin Login ONLY (NO Google login) */}
            <form onSubmit={handleAdminPasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Database Administrator Email
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@vnoirs.com"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Database Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                />
              </div>

              {authError && (
                <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-lg flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loginSubmitting}
                className="w-full py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition cursor-pointer flex items-center justify-center gap-2"
              >
                {loginSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Database Credentials...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Database Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
              <Link href="/" className="hover:text-slate-600 underline">
                Return to Vnoirs Main Site
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isSuperAdmin = adminRole === "super_admin";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border text-sm flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-5 duration-200 ${
            toast.type === "error"
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          {toast.type === "error" ? (
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
          ) : (
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* TOP HEADER: Light Minimalist Executive Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left brand & title */}
            <div className="flex items-center gap-3">
              <Link href="/admin" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  Vnoirs Admin
                </span>
              </Link>
              <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    isSuperAdmin
                      ? "bg-violet-50 text-violet-700 border-violet-200"
                      : "bg-indigo-50 text-indigo-700 border-indigo-200"
                  }`}
                >
                  {isSuperAdmin ? "Super Admin" : "Staff Admin"}
                </span>
                <span className="text-xs text-slate-400 hidden md:inline">
                  • Supabase Database Authenticated
                </span>
              </div>
            </div>

            {/* Right actions & user profile */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setRefreshing(true);
                  loadDashboardData();
                }}
                disabled={refreshing}
                title="Refresh live data"
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin text-indigo-600" : ""}`}
                />
              </button>

              <div className="h-6 w-px bg-slate-200" />

              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-semibold text-slate-900 truncate max-w-[150px]">
                    {adminProfile?.name || adminUser?.email?.split("@")[0]}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                    {adminUser?.email}
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  type="button"
                  title="Sign out of Admin Portal"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI METRIC CARDS */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="text-xs font-medium text-slate-500">
              Total Applications
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {stats.total}
            </div>
            <div className="text-[11px] text-indigo-600 font-medium mt-1">
              Live submissions
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="text-xs font-medium text-slate-500">
              Pending Review
            </div>
            <div className="text-2xl font-bold text-amber-600 mt-1">
              {stats.pending}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Needs inspection
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="text-xs font-medium text-slate-500">In Review</div>
            <div className="text-2xl font-bold text-indigo-600 mt-1">
              {stats.reviewing}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Under evaluation
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="text-xs font-medium text-slate-500">
              Shortlisted
            </div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">
              {stats.shortlisted}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Top candidates
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="text-xs font-medium text-slate-500">Interviews</div>
            <div className="text-2xl font-bold text-sky-600 mt-1">
              {stats.interviewScheduled}
            </div>
            <div className="text-[11px] text-sky-600 font-medium mt-1">
              Invited candidates
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="text-xs font-medium text-slate-500">
              Active Jobs
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {
                jobsList.filter((j) => (j.status || "active") === "active")
                  .length
              }
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {jobsList.length} total positions
            </div>
          </div>
        </section>

        {/* PRIMARY NAVIGATION TABS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <nav className="bg-slate-100 p-1.5 rounded-xl inline-flex gap-1 border border-slate-200/70">
            <button
              onClick={() => setActiveTab("applications")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
                activeTab === "applications"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Applications & CVs ({applications.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
                activeTab === "users"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>
                Directories (Admins: {adminsList.length} • Candidates:{" "}
                {candidatesList.length})
              </span>
            </button>

            <button
              onClick={() => setActiveTab("jobs")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
                activeTab === "jobs"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Job Openings ({jobsList.length})</span>
            </button>
          </nav>

          {/* {activeTab === "users" &&
            isSuperAdmin &&
            userDirectorySubTab === "admins" && (
              <button
                onClick={() => setIsAddAdminModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Assign Administrator</span>
              </button>
            )} */}
        </div>

        {/* ======================================================== */}
        {/* TAB 1: APPLICATIONS & CVs                                */}
        {/* ======================================================== */}
        {activeTab === "applications" && (
          <div className="space-y-6">
            {/* Search and Filters Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by candidate, email, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="flex items-center gap-1 text-xs text-slate-500 mr-1">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Status:</span>
                </div>

                {[
                  "All",
                  "Pending",
                  "Reviewing",
                  "Shortlisted",
                  "Interview Scheduled",
                  "Rejected",
                ].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                      statusFilter === status
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Applications List */}
            {loadingData ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500">
                  Loading candidate records...
                </p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-slate-700">
                  No applications match your filter
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Try adjusting the search query or status filter.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((app) => {
                  const cfg =
                    STATUS_CONFIG[app.status] || STATUS_CONFIG.Pending;
                  const isExpanded = expandedAppId === app.id;

                  return (
                    <div
                      key={app.id}
                      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow overflow-hidden"
                    >
                      {/* Top Card Header */}
                      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h3 className="text-base font-bold text-slate-900">
                              {app.candidateName}
                            </h3>
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                              />
                              {cfg.label}
                            </span>
                            <span className="text-xs text-slate-400">
                              Applied on{" "}
                              {new Date(app.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                            <span className="font-medium text-slate-700">
                              {app.jobTitle}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <a
                                href={`mailto:${app.email}`}
                                className="hover:text-indigo-600"
                              >
                                {app.email}
                              </a>
                            </span>
                            {app.phone && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                                  <a
                                    href={`tel:${app.phone}`}
                                    className="hover:text-indigo-600"
                                  >
                                    {app.phone}
                                  </a>
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Action buttons on card */}
                        <div className="flex flex-wrap items-center gap-2">
                          {/* CV View / Download Button */}
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs transition"
                          >
                            <Download className="w-3.5 h-3.5 text-indigo-600" />
                            <span>View CV</span>
                            {app.resumeSize && (
                              <span className="text-[10px] text-slate-400 font-normal">
                                ({app.resumeSize})
                              </span>
                            )}
                          </a>

                          {/* Schedule Interview Modal Trigger */}
                          <button
                            onClick={() => {
                              setInterviewModalApp(app);
                              setInterviewForm((prev) => ({
                                ...prev,
                                notes: `Technical interview for ${app.jobTitle}.`,
                              }));
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Schedule Interview</span>
                          </button>

                          {/* Quick Status Dropdown */}
                          <select
                            value={app.status}
                            onChange={(e) =>
                              handleUpdateStatus(app.id, e.target.value)
                            }
                            className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                          >
                            <option value="Pending">Mark Pending</option>
                            <option value="Reviewing">Mark In Review</option>
                            <option value="Shortlisted">
                              Mark Shortlisted
                            </option>
                            <option value="Interview Scheduled">
                              Interview Scheduled
                            </option>
                            <option value="Rejected">Mark Rejected</option>
                          </select>

                          {/* Expand Details Toggle */}
                          <button
                            onClick={() =>
                              setExpandedAppId(isExpanded ? null : app.id)
                            }
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Application Details */}
                      {isExpanded && (
                        <div className="bg-slate-50/70 p-5 border-t border-slate-100 space-y-4 text-xs">
                          {app.coverNote && (
                            <div>
                              <span className="font-semibold text-slate-700 block mb-1">
                                Candidate Cover Note / Introduction:
                              </span>
                              <p className="text-slate-600 bg-white p-3 rounded-xl border border-slate-200/60 leading-relaxed whitespace-pre-wrap">
                                {app.coverNote}
                              </p>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                              <span className="text-slate-400 text-[11px] block">
                                Storage Location
                              </span>
                              <span className="font-medium text-slate-700">
                                Supabase Bucket (
                                {app.storageProvider || "resumes"})
                              </span>
                            </div>

                            <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                              <span className="text-slate-400 text-[11px] block">
                                Portfolio / GitHub
                              </span>
                              {app.portfolioUrl &&
                              app.portfolioUrl !== "Not provided" ? (
                                <a
                                  href={app.portfolioUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 hover:underline flex items-center gap-1 font-medium truncate"
                                >
                                  <span>{app.portfolioUrl}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-slate-400">
                                  Not provided
                                </span>
                              )}
                            </div>

                            <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                              <span className="text-slate-400 text-[11px] block">
                                Interview Status
                              </span>
                              <span className="font-medium text-slate-700">
                                {app.interview
                                  ? `${app.interview.format} scheduled for ${app.interview.scheduledAt}`
                                  : "No interview scheduled"}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: USER DIRECTORIES (ADMINS & CANDIDATES SEPARATE)    */}
        {/* ======================================================== */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {/* Sub-Tabs for Admins vs Candidates */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/60">
                <button
                  onClick={() => setUserDirectorySubTab("admins")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
                    userDirectorySubTab === "admins"
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Database Admins ({adminsList.length})</span>
                </button>

                <button
                  onClick={() => setUserDirectorySubTab("candidates")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
                    userDirectorySubTab === "candidates"
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    Registered Candidates & Applicants ({candidatesList.length})
                  </span>
                </button>
              </div>

              <div className="text-xs text-slate-400 hidden sm:block">
                {userDirectorySubTab === "admins"
                  ? "Users with raw_app_meta_data.role: 'admin' or 'super_admin'"
                  : "Standard candidate accounts registered in Supabase"}
              </div>
            </div>

            {/* VIEW A: ADMINS DIRECTORY */}
            {userDirectorySubTab === "admins" && (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Database Administrator Accounts
                    </h3>
                    <p className="text-xs text-slate-500">
                      Users with administrative privileges verified directly
                      through Supabase Auth raw_app_meta_data.
                    </p>
                  </div>
                  {isSuperAdmin && (
                    <button
                      onClick={() => setIsAddAdminModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Assign Admin</span>
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Name & Email</th>
                        <th className="py-3 px-4">Database Role</th>
                        <th className="py-3 px-4">Provider</th>
                        <th className="py-3 px-4">Last Sign In</th>
                        {isSuperAdmin && (
                          <th className="py-3 px-4 text-right">
                            Super Admin Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAdmins.map((adm) => {
                        const isThisSuperAdmin = adm.role === "super_admin";
                        return (
                          <tr
                            key={adm.id || adm.email}
                            className="hover:bg-slate-50/60 transition"
                          >
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-slate-900">
                                {adm.name}
                              </div>
                              <div className="text-slate-400 text-[11px] font-mono">
                                {adm.email}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold text-[11px] border ${
                                  isThisSuperAdmin
                                    ? "bg-violet-50 text-violet-700 border-violet-200"
                                    : "bg-indigo-50 text-indigo-700 border-indigo-200"
                                }`}
                              >
                                {isThisSuperAdmin ? (
                                  <>
                                    <ShieldCheck className="w-3 h-3 text-violet-600" />
                                    <span>Super Administrator</span>
                                  </>
                                ) : (
                                  <>
                                    <Shield className="w-3 h-3 text-indigo-600" />
                                    <span>Administrator</span>
                                  </>
                                )}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-mono text-slate-600 text-[11px] uppercase">
                                {adm.provider || "email"}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-400">
                              {adm.lastSignInAt
                                ? new Date(adm.lastSignInAt).toLocaleString()
                                : "Never"}
                            </td>
                            {isSuperAdmin && (
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Send Password Reset Link */}
                                  <button
                                    onClick={() =>
                                      handleGeneratePasswordReset(adm.email)
                                    }
                                    title="Generate Password Reset Link"
                                    className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition cursor-pointer flex items-center gap-1 text-[11px] font-medium"
                                  >
                                    <KeyRound className="w-3.5 h-3.5" />
                                    <span className="hidden md:inline">
                                      Reset Pass
                                    </span>
                                  </button>

                                  {/* Revoke Admin (Only for non-super_admins and not self) */}
                                  {!isThisSuperAdmin &&
                                    adm.email.toLowerCase() !==
                                      adminUser?.email?.toLowerCase() && (
                                      <button
                                        onClick={() =>
                                          handleRevokeAdmin(adm.email)
                                        }
                                        title="Revoke administrator access"
                                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW B: CANDIDATES DIRECTORY */}
            {userDirectorySubTab === "candidates" && (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Registered Candidates Directory
                    </h3>
                    <p className="text-xs text-slate-500">
                      Users registered in Supabase without administrative roles.
                    </p>
                  </div>
                  <div className="text-xs text-slate-400">
                    Total:{" "}
                    <span className="font-semibold text-slate-800">
                      {candidatesList.length}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Candidate</th>
                        <th className="py-3 px-4">Provider</th>
                        <th className="py-3 px-4">Applications</th>
                        <th className="py-3 px-4">Last Activity</th>
                        {isSuperAdmin && (
                          <th className="py-3 px-4 text-right">
                            Super Admin Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCandidates.map((cand) => (
                        <tr
                          key={cand.id || cand.email}
                          className="hover:bg-slate-50/60 transition"
                        >
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900">
                              {cand.name}
                            </div>
                            <div className="text-slate-400 text-[11px] font-mono">
                              {cand.email}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                              {cand.provider}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900">
                              {cand.applicationsCount} position(s)
                            </div>
                            <div className="text-slate-400 text-[11px] truncate max-w-xs">
                              {cand.applications
                                ?.map((a) => a.title)
                                .join(", ") || "General"}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400">
                            {cand.lastSignInAt
                              ? new Date(cand.lastSignInAt).toLocaleDateString()
                              : "Recent"}
                          </td>
                          {isSuperAdmin && (
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Send Password Reset Link */}
                                <button
                                  onClick={() =>
                                    handleGeneratePasswordReset(cand.email)
                                  }
                                  title="Generate Password Reset Link"
                                  className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition cursor-pointer flex items-center gap-1 text-[11px] font-medium"
                                >
                                  <KeyRound className="w-3.5 h-3.5" />
                                  <span className="hidden md:inline">
                                    Reset Pass
                                  </span>
                                </button>

                                {/* Promote to Admin */}
                                <button
                                  onClick={() => {
                                    setNewAdminEmail(cand.email);
                                    setIsAddAdminModalOpen(true);
                                  }}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[11px] font-semibold transition"
                                >
                                  <UserPlus className="w-3 h-3" />
                                  <span>Assign Admin</span>
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: JOB OPENINGS & EXPIRATION MANAGEMENT             */}
        {/* ======================================================== */}
        {activeTab === "jobs" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Career Positions Management
                </h3>
                <p className="text-xs text-slate-500">
                  Publish new engineering roles, expire filled positions, or
                  delete listings.
                </p>
              </div>

              <button
                onClick={() => setIsNewJobModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
              >
                <Plus className="w-4 h-4" />
                <span>Post New Job</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobsList.map((job) => {
                const isExpired = job.status === "expired";
                const jobApps = applications.filter((a) => a.jobId === job.id);

                return (
                  <div
                    key={job.id}
                    className={`bg-white rounded-2xl border transition p-5 shadow-xs hover:shadow-md flex flex-col justify-between ${
                      isExpired
                        ? "border-amber-200/80 bg-amber-50/15"
                        : "border-slate-200/80"
                    }`}
                  >
                    <div>
                      {/* Top status bar */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-semibold text-slate-500">
                          {job.department}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            isExpired
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isExpired ? "bg-amber-500" : "bg-emerald-500"
                            }`}
                          />
                          {isExpired
                            ? "Expired / Closed"
                            : "Active & Accepting CVs"}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900">
                        {job.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {job.summary}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {job.tags?.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>
                          {job.location} • {job.type}
                        </span>
                        <span className="font-semibold text-indigo-700">
                          {jobApps.length} Applicant(s)
                        </span>
                      </div>
                    </div>

                    {/* Job Actions: Expire/Reactivate & Delete */}
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setJobFilter(job.id);
                          setActiveTab("applications");
                        }}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
                      >
                        View Applicants ({jobApps.length}) →
                      </button>

                      <div className="flex items-center gap-2">
                        {/* Toggle Expire/Activate */}
                        <button
                          onClick={() =>
                            handleToggleJobStatus(job.id, job.status)
                          }
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                            isExpired
                              ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200"
                          }`}
                        >
                          {isExpired ? (
                            <>
                              <Power className="w-3.5 h-3.5" />
                              <span>Reactivate</span>
                            </>
                          ) : (
                            <>
                              <PowerOff className="w-3.5 h-3.5" />
                              <span>Expire Job</span>
                            </>
                          )}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteJob(job.id, job.title)}
                          title="Permanently delete job"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer border border-transparent hover:border-rose-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* MODAL 1: SCHEDULE INTERVIEW CALL                          */}
      {/* ======================================================== */}
      {interviewModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Schedule Candidate Interview
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dispatches an email invitation via Resend
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInterviewModalApp(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-xs space-y-1">
              <div>
                <span className="text-slate-400">Candidate: </span>
                <span className="font-semibold text-slate-800">
                  {interviewModalApp.candidateName}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Position: </span>
                <span className="font-semibold text-slate-800">
                  {interviewModalApp.jobTitle}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Email: </span>
                <span className="font-mono text-slate-700">
                  {interviewModalApp.email}
                </span>
              </div>
            </div>

            <form
              onSubmit={handleScheduleInterview}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={interviewForm.scheduledAt}
                    onChange={(e) =>
                      setInterviewForm((prev) => ({
                        ...prev,
                        scheduledAt: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Interview Format
                  </label>
                  <select
                    value={interviewForm.format}
                    onChange={(e) =>
                      setInterviewForm((prev) => ({
                        ...prev,
                        format: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Google Meet">Google Meet</option>
                    <option value="Zoom">Zoom Meeting</option>
                    <option value="Microsoft Teams">Microsoft Teams</option>
                    <option value="In-Person / On-Site">
                      In-Person (Office)
                    </option>
                    <option value="Phone Screening">Phone Screening</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Meeting Link or Location
                </label>
                <input
                  type="text"
                  required
                  value={interviewForm.meetingLink}
                  onChange={(e) =>
                    setInterviewForm((prev) => ({
                      ...prev,
                      meetingLink: e.target.value,
                    }))
                  }
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Interviewer Name / Title
                </label>
                <input
                  type="text"
                  required
                  value={interviewForm.interviewer}
                  onChange={(e) =>
                    setInterviewForm((prev) => ({
                      ...prev,
                      interviewer: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Agenda & Prep Instructions
                </label>
                <textarea
                  rows={2}
                  value={interviewForm.notes}
                  onChange={(e) =>
                    setInterviewForm((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setInterviewModalApp(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={interviewSending}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold flex items-center gap-1.5 transition"
                >
                  {interviewSending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Invitation...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Interview Invitation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: POST NEW JOB POSITION                            */}
      {/* ======================================================== */}
      {isNewJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Publish New Job Position
                  </h3>
                  <p className="text-xs text-slate-500">
                    Will immediately appear on the public /careers page
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewJobModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Next.js Architect"
                  value={newJobForm.title}
                  onChange={(e) =>
                    setNewJobForm((p) => ({ ...p, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Department *
                  </label>
                  <select
                    value={newJobForm.department}
                    onChange={(e) =>
                      setNewJobForm((p) => ({
                        ...p,
                        department: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Web Engineering">Web Engineering</option>
                    <option value="Backend & Messaging">
                      Backend & Messaging
                    </option>
                    <option value="Cloud & Reliability">
                      Cloud & Reliability
                    </option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Sales & Operations">
                      Sales & Operations
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newJobForm.location}
                    onChange={(e) =>
                      setNewJobForm((p) => ({ ...p, location: e.target.value }))
                    }
                    placeholder="Remote / Hybrid"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Job Type
                  </label>
                  <select
                    value={newJobForm.type}
                    onChange={(e) =>
                      setNewJobForm((p) => ({ ...p, type: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={newJobForm.experience}
                    onChange={(e) =>
                      setNewJobForm((p) => ({
                        ...p,
                        experience: e.target.value,
                      }))
                    }
                    placeholder="3+ Years"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Salary
                  </label>
                  <input
                    type="text"
                    value={newJobForm.salary}
                    onChange={(e) =>
                      setNewJobForm((p) => ({ ...p, salary: e.target.value }))
                    }
                    placeholder="Market Competitive"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Role Summary *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Short, high-impact description of the role..."
                  value={newJobForm.summary}
                  onChange={(e) =>
                    setNewJobForm((p) => ({ ...p, summary: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Responsibilities (one per line)
                </label>
                <textarea
                  rows={2}
                  placeholder="Architect serverless pipelines&#10;Lead core frontend engineering"
                  value={newJobForm.responsibilities}
                  onChange={(e) =>
                    setNewJobForm((p) => ({
                      ...p,
                      responsibilities: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Requirements (one per line)
                </label>
                <textarea
                  rows={2}
                  placeholder="3+ years Next.js 15 App Router experience&#10;Deep proficiency in Tailwind CSS"
                  value={newJobForm.requirements}
                  onChange={(e) =>
                    setNewJobForm((p) => ({
                      ...p,
                      requirements: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Next.js, React, Tailwind CSS, TypeScript"
                  value={newJobForm.tags}
                  onChange={(e) =>
                    setNewJobForm((p) => ({ ...p, tags: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewJobModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={jobSubmitting}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 transition"
                >
                  {jobSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Publish Position</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: ASSIGN ADMINISTRATOR (SUPER ADMIN ONLY)         */}
      {/* ======================================================== */}
      {isAddAdminModalOpen && isSuperAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Assign Administrator
                  </h3>
                  <p className="text-xs text-slate-500">
                    Super Administrator authorization action
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddAdminModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAdmin} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  User Email Address (Must exist in Supabase DB) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="user@vnoirs.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Shield className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Role: Administrator (Staff)</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  This user will be granted standard administrative rights in
                  Supabase. (Note: Super Administrator privileges can never be
                  granted by the app; they can only be designated directly in
                  the database).
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddAdminModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adminSubmitting}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 transition"
                >
                  {adminSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving in Database...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Assign Admin in DB</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: PASSWORD RESET LINK (SUPER ADMIN ONLY)          */}
      {/* ======================================================== */}
      {resetPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Password Reset Recovery Link
                  </h3>
                  <p className="text-xs text-slate-500">
                    Generated for{" "}
                    <span className="font-mono font-medium">
                      {resetPasswordModal.email}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setResetPasswordModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {resetPasswordModal.loading ? (
              <div className="py-8 text-center text-xs text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto mb-2" />
                <span>
                  Contacting Supabase Auth to generate secure recovery token...
                </span>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <p className="text-slate-600 leading-relaxed">
                  A secure, single-use password recovery URL has been generated
                  directly through Supabase. Send this link to the user to allow
                  them to reset their credentials:
                </p>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] text-slate-700 truncate select-all">
                    {resetPasswordModal.link}
                  </span>
                  <button
                    onClick={handleCopyResetLink}
                    className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 shadow-xs transition"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setResetPasswordModal(null)}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
