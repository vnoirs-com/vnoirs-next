"use client";

import { useState, useRef } from "react";
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function JobApplicationModal({ job, onClose, availableJobs = [] }) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    phone: user?.user_metadata?.phone || "",
    jobId: job ? job.id : "general",
    jobTitle: job ? job.title : "General Engineering Application",
    portfolio: "",
    coverNote: "",
    botCheck: "",
  });

  const [cvFile, setCvFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedData, setSubmittedData] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "jobId") {
      const selected = availableJobs.find((j) => j.id === value);
      setFormData((prev) => ({
        ...prev,
        jobId: value,
        jobTitle: selected ? selected.title : "General Engineering Application",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateFile = (file) => {
    if (!file) return false;
    const lowerName = file.name.toLowerCase();
    const isValidFormat =
      lowerName.endsWith(".pdf") ||
      lowerName.endsWith(".docx") ||
      file.type === "application/pdf" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    if (!isValidFormat) {
      setErrorMessage("Only PDF (.pdf) and Word (.docx) files are supported.");
      return false;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("File exceeds 2MB limit. Please select a PDF or DOCX file under 2MB.");
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (validateFile(file)) {
        setCvFile(file);
        setErrorMessage("");
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (validateFile(file)) {
        setCvFile(file);
        setErrorMessage("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cvFile) {
      setErrorMessage("Please upload your CV file (PDF or DOCX, maximum 2MB).");
      return;
    }

    setStatus("uploading");
    setErrorMessage("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("jobId", formData.jobId);
      data.append("jobTitle", formData.jobTitle);
      data.append("portfolio", formData.portfolio);
      data.append("coverNote", formData.coverNote);
      data.append("botCheck", formData.botCheck);
      data.append("cvFile", cvFile);

      if (user?.id) {
        data.append("userId", user.id);
      }

      const res = await fetch("/api/careers/apply", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to submit application. Please try again.");
      }

      setSubmittedData(result.application);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0e1424] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-white/10 bg-[#090d16]/80">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-1">
              Careers Application Desk
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Apply for {formData.jobTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
          {status === "success" ? (
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white">Application Received!</h3>
              <p className="text-gray-300 text-sm max-w-md mx-auto leading-relaxed">
                Thank you for applying, <span className="text-white font-semibold">{submittedData?.candidateName}</span>. Your CV has been successfully uploaded to Supabase Storage and routed to our hiring leads.
              </p>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-w-md mx-auto text-left text-xs space-y-2 text-gray-300">
                <div>
                  <strong className="text-violet-400">Position:</strong> {submittedData?.jobTitle}
                </div>
                <div>
                  <strong className="text-violet-400">CV Storage:</strong> Supabase Storage Bucket (resumes)
                </div>
                <div>
                  <strong className="text-violet-400">File:</strong> {submittedData?.resumeFilename} ({submittedData?.resumeSize})
                </div>
                <div>
                  <strong className="text-violet-400">Status:</strong> Under initial technical review
                </div>
              </div>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-2.5 rounded-xl transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Authenticated candidate badge */}
              {user && (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-violet-950/40 border border-violet-500/30 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-gray-300">
                      Signed in as: <strong className="text-white">{user.user_metadata?.full_name || user.email}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Verified Candidate
                  </span>
                </div>
              )}

              {status === "error" && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>{errorMessage}</div>
                </div>
              )}

              {/* Honeypot field */}
              <div className="hidden" aria-hidden="true">
                <input
                  name="botCheck"
                  type="text"
                  tabIndex={-1}
                  value={formData.botCheck}
                  onChange={handleInputChange}
                />
              </div>

              {/* Position selector if modal opened with multiple options */}
              {availableJobs.length > 0 && (
                <div>
                  <label htmlFor="modalJobSelect" className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                    Target Position <span className="text-violet-400">*</span>
                  </label>
                  <select
                    id="modalJobSelect"
                    name="jobId"
                    value={formData.jobId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#111827] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
                  >
                    {availableJobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.title} &bull; {j.department}
                      </option>
                    ))}
                    <option value="general">
                      General Application / Other Discipline
                    </option>
                  </select>
                </div>
              )}

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="candidateName"
                    className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5"
                  >
                    Full Name <span className="text-violet-400">*</span>
                  </label>
                  <input
                    id="candidateName"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Daniyal Khan"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="candidateEmail"
                    className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5"
                  >
                    Email Address <span className="text-violet-400">*</span>
                  </label>
                  <input
                    id="candidateEmail"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="daniyal@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>

              {/* Phone & Portfolio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="candidatePhone"
                    className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5"
                  >
                    Phone / WhatsApp Number
                  </label>
                  <input
                    id="candidatePhone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+92 300 1234567"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="candidatePortfolio"
                    className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5"
                  >
                    GitHub / LinkedIn / Portfolio
                  </label>
                  <input
                    id="candidatePortfolio"
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>

              {/* CV Upload Section - Supabase Storage (Max 2MB PDF / DOCX) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Resume / CV (Max 2MB &bull; PDF or DOCX) <span className="text-violet-400">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-violet-400">
                    Supabase Storage
                  </span>
                </div>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {cvFile ? (
                    <div className="p-4 rounded-xl bg-violet-950/40 border border-violet-500/40 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-violet-400" />
                        <div>
                          <div className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
                            {cvFile.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {(cvFile.size / 1024).toFixed(1)} KB &bull; Ready for Supabase Storage
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCvFile(null)}
                        className="text-xs text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-500/10 transition cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/20 hover:border-violet-500/50 rounded-2xl p-6 text-center cursor-pointer hover:bg-white/5 transition duration-200 group"
                    >
                      <UploadCloud className="w-10 h-10 text-violet-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-sm font-semibold text-white mb-1">
                        Click to select or drag & drop your CV
                      </div>
                      <p className="text-xs text-gray-400">
                        Strictly PDF or DOCX only &bull; Maximum file size: 2MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Cover note */}
              <div>
                <label
                  htmlFor="candidateNote"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5"
                >
                  Brief Introduction & Relevant Highlights
                </label>
                <textarea
                  id="candidateNote"
                  name="coverNote"
                  rows={3}
                  value={formData.coverNote}
                  onChange={handleInputChange}
                  placeholder="Share a short summary of your background, relevant projects, tech stack experience, or why you want to work with Vnoirs..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              {/* Footer Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <ShieldCheck className="w-4 h-4 text-violet-400" />
                  <span>Confidential candidate review process</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-1/2 sm:w-auto px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={status === "uploading"}
                    className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-violet-600/30 transition text-sm cursor-pointer"
                  >
                    {status === "uploading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading CV (2MB)...</span>
                      </>
                    ) : (
                      <span>Submit Application</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
