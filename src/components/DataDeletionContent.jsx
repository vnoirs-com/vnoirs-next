"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Trash2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  ExternalLink,
  MessageSquare,
  Mail,
  Phone,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

export default function DataDeletionContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || searchParams.get("id") || "";

  // Form state
  const [identifier, setIdentifier] = useState("");
  const [category, setCategory] = useState("all");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitResult, setSubmitResult] = useState(null);

  // Status lookup state
  const [lookupCode, setLookupCode] = useState(initialCode);
  const [lookingUp, setLookingUp] = useState(false);
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState("");

  // Auto-fetch if initialCode is provided in URL
  useEffect(() => {
    if (initialCode) {
      handleLookupCode(initialCode);
    }
  }, [initialCode]);

  const handleLookupCode = async (codeToLookup) => {
    if (!codeToLookup.trim()) return;
    setLookingUp(true);
    setLookupError("");
    setLookupResult(null);

    try {
      const res = await fetch(`/api/auth/data-deletion?code=${encodeURIComponent(codeToLookup.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No deletion record found for this confirmation code.");
      }

      setLookupResult(data);
    } catch (err) {
      setLookupError(err.message || "Failed to lookup deletion request.");
    } finally {
      setLookingUp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setSubmitError("Please enter your email, phone number, or Meta User ID.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    setSubmitResult(null);

    try {
      const res = await fetch("/api/auth/data-deletion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: identifier.trim(),
          category,
          notes: notes.trim(),
          source: "web_self_service",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process data deletion request.");
      }

      setSubmitResult(data);
      setLookupCode(data.confirmation_code);
      setIdentifier("");
      setNotes("");
    } catch (err) {
      setSubmitError(err.message || "An unexpected error occurred. Please try again or email cs@vnoirs.com.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Header */}
      <section className="relative py-20 bg-gradient-to-b from-[#0e1424] to-[#090d16] border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-900/40 border border-violet-500/30 text-violet-300 text-xs sm:text-sm font-medium mb-6">
            <Trash2 className="w-4 h-4 text-violet-400" />
            <span>Meta Developer Compliance & User Rights</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            User Data Deletion Request & Instructions
          </h1>

          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            In compliance with Meta Platform Terms, GDPR, and modern privacy regulations, Vnoirs provides transparent instructions and automated tools for you to request the permanent deletion of your data.
          </p>

          <div className="mt-6 inline-block text-xs text-gray-500 font-mono">
            Compliance Standard: Meta Graph API & WhatsApp Cloud API Policies &bull; Effective: October 2026
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
      </section>

      {/* Main Content Area */}
      <section className="py-16 bg-[#090d16]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Quick Notice Banner */}
          <div className="p-5 rounded-2xl bg-violet-950/40 border border-violet-500/30 flex items-start gap-3.5 text-violet-200">
            <Sparkles className="w-5 h-5 flex-shrink-0 text-violet-400 mt-0.5" />
            <div className="text-sm">
              <span className="font-semibold text-white">Your Right to Erasure: </span>
              You have the right to request the deletion of all personal data, contact submissions, candidate application files, and WhatsApp messaging logs associated with your identity. Deletion requests are processed automatically or within 24 to 48 business hours.
            </div>
          </div>

          {/* Section: Status Check Tool */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Search className="w-5 h-5 text-violet-400" />
              <span>Track Existing Deletion Request</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400">
              If you submitted a deletion request or triggered an automated request via Facebook, enter your Confirmation Code (e.g., <code className="text-violet-300 font-mono">VN-DEL-XXXXXX</code>) to view its verification status.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLookupCode(lookupCode);
              }}
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              <input
                type="text"
                value={lookupCode}
                onChange={(e) => setLookupCode(e.target.value)}
                placeholder="e.g. VN-DEL-8A3B9C12"
                className="flex-grow px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm font-mono"
              />
              <button
                type="submit"
                disabled={lookingUp || !lookupCode.trim()}
                className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition text-sm cursor-pointer shadow-md shadow-violet-600/25"
              >
                {lookingUp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Check Status</span>
                  </>
                )}
              </button>
            </form>

            {lookupError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{lookupError}</span>
              </div>
            )}

            {lookupResult && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2 font-semibold text-sm text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Request Status: {lookupResult.status}</span>
                </div>
                <p className="text-gray-300 text-xs leading-relaxed">
                  {lookupResult.status_message}
                </p>
                <div className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px] text-gray-400">
                  <div>Confirmation Code: <span className="text-violet-300">{lookupResult.confirmation_code}</span></div>
                  <div>Completed At: <span className="text-gray-300">{new Date(lookupResult.completed_at || lookupResult.requested_at).toUTCString()}</span></div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Interactive Self-Service Deletion Form */}
          <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-1">
                Method 1 &bull; Instant Online Request
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Submit an Automated Deletion Request
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Provide the email address, phone number, or Meta User ID associated with your interactions. Our system will immediately process the erasure of corresponding records.
              </p>
            </div>

            {submitResult && (
              <div className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-sm space-y-3">
                <div className="flex items-center gap-2 font-bold text-white">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Deletion Request Submitted Successfully!</span>
                </div>
                <p className="text-xs text-gray-300">
                  Your request has been registered and associated active data has been marked for purge. Save your confirmation details below:
                </p>
                <div className="p-3.5 rounded-xl bg-[#060911] border border-white/10 font-mono text-xs space-y-1.5">
                  <div className="text-gray-400">Confirmation Code: <span className="text-emerald-400 font-bold">{submitResult.confirmation_code}</span></div>
                  <div className="text-gray-400">Status URL: <a href={submitResult.url} className="text-violet-400 underline break-all">{submitResult.url}</a></div>
                </div>
              </div>
            )}

            {submitError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                  Email Address, Phone Number, or Meta User ID <span className="text-violet-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. name@example.com, +923202453000, or Meta UID"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                  Scope of Records to Delete
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#111827] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm cursor-pointer"
                >
                  <option value="all">All Associated Records & Data (Full Erasure)</option>
                  <option value="whatsapp">WhatsApp Cloud API Messaging & Phone Logs Only</option>
                  <option value="careers">Candidate Applications, CV Files & Profiles Only</option>
                  <option value="contact">Website Contact Form Submissions Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                  Additional Notes or Verification Details (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any specific reference IDs or clarifications..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-violet-600/30 transition text-sm cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing deletion request...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Submit Deletion Request</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-gray-500 text-center">
                Submissions trigger automated removal from active databases in full compliance with Meta Data Deletion protocols.
              </p>
            </form>
          </div>

          {/* Section: Step-by-Step Instructions */}
          <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8 text-gray-300 text-sm">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-1">
                Method 2 &bull; Meta & Facebook Platform Instructions
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                How to Delete Your Data via Facebook App Settings
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                If you interacted with Vnoirs via Facebook Login or a Meta-connected service, follow these standard steps:
              </p>
            </div>

            <ol className="space-y-4 list-decimal pl-5 text-xs sm:text-sm leading-relaxed">
              <li>
                <strong className="text-white">Open Facebook Settings:</strong> Log in to your Facebook account, click your profile avatar in the upper right, and go to <span className="text-violet-300">Settings & Privacy</span> &gt; <span className="text-violet-300">Settings</span>.
              </li>
              <li>
                <strong className="text-white">Locate Connected Apps:</strong> In the left sidebar, navigate to the <span className="text-violet-300">Apps and Websites</span> section.
              </li>
              <li>
                <strong className="text-white">Select Vnoirs:</strong> Find <span className="text-white font-semibold">Vnoirs</span> in your active applications list.
              </li>
              <li>
                <strong className="text-white">Click Remove:</strong> Click the <span className="text-rose-400 font-semibold">Remove</span> button. Check the option to delete history/interactions, then confirm.
              </li>
              <li>
                <strong className="text-white">Automated Deletion Callback:</strong> Facebook will automatically dispatch a secure signed request to our automated callback endpoint (<code className="text-violet-300 font-mono">/api/auth/data-deletion</code>), which purges your connected identifiers and registers your deletion confirmation code.
              </li>
            </ol>

            {/* WhatsApp Deletion Protocol */}
            <div className="border-t border-white/10 pt-6 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <span>WhatsApp Cloud API Instant Unsubscribe & Erasure</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400">
                If you have received notifications or automated messages from Vnoirs or our client implementations on WhatsApp:
              </p>
              <ul className="space-y-2 pl-2 text-xs sm:text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Reply with <strong className="text-white font-mono">&quot;STOP&quot;</strong>, <strong className="text-white font-mono">&quot;UNSUBSCRIBE&quot;</strong>, or <strong className="text-white font-mono">&quot;DELETE DATA&quot;</strong> to our verified WhatsApp number (<a href="https://wa.me/923202453000" className="text-emerald-400 underline">+92 320 2453000</a>).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Our webhook listener instantly halts automated campaigns, revokes message permissions, and schedules your temporary chat payload logs for purge.
                  </span>
                </li>
              </ul>
            </div>

            {/* Scope of Data Deleted */}
            <div className="border-t border-white/10 pt-6 space-y-3">
              <h3 className="text-white font-bold text-base">What Data Is Erased?</h3>
              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-white font-semibold mb-1">Permanently Deleted</div>
                  <ul className="text-gray-400 space-y-1">
                    <li>&bull; Contact names, emails, and phone numbers</li>
                    <li>&bull; Resumes / CV files in Supabase Storage</li>
                    <li>&bull; Inbound contact form message contents</li>
                    <li>&bull; Meta user IDs and OAuth session tokens</li>
                  </ul>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-white font-semibold mb-1">Compliance Retained</div>
                  <ul className="text-gray-400 space-y-1">
                    <li>&bull; Anonymized deletion confirmation audit code</li>
                    <li>&bull; Suppression markers (to prevent re-messaging)</li>
                    <li>&bull; Legally mandated financial invoices (if contracted)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Manual Direct Request */}
            <div className="border-t border-white/10 pt-6 space-y-3">
              <h3 className="text-white font-bold text-base">Direct Privacy Desk Contact</h3>
              <p className="text-xs sm:text-sm text-gray-400">
                You can also submit an offline or manual erasure request directly to our Data Protection Officer:
              </p>
              <div className="p-4 rounded-xl bg-[#060911] border border-white/10 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-violet-400" />
                  <span className="text-white">Email:</span>
                  <a href="mailto:cs@vnoirs.com?subject=Data%20Deletion%20Request" className="text-violet-400 hover:underline">
                    cs@vnoirs.com (Subject: &quot;Data Deletion Request&quot;)
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-violet-400" />
                  <span className="text-white">WhatsApp Helpline:</span>
                  <a href="https://wa.me/923202453000" className="text-emerald-400 hover:underline">
                    +92 320 2453000
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4 text-violet-400" />
                  <span>SLA Turnaround: Within 24-48 business hours with written confirmation.</span>
                </div>
              </div>
            </div>

            {/* Cross Links */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 text-gray-400">
                <HelpCircle className="w-4 h-4 text-violet-400" />
                <span>Learn more about our data handling policies:</span>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/privacy-policy" className="text-violet-400 hover:underline">
                  Privacy Policy
                </Link>
                <span className="text-white/20">&bull;</span>
                <Link href="/terms-of-service" className="text-violet-400 hover:underline">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
