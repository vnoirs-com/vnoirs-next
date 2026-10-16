"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Send,
  Zap,
} from "lucide-react";
import { getJobs } from "@/data/jobs";
import JobApplicationModal from "@/components/JobApplicationModal";
import { useAuth } from "@/context/AuthContext";

export default function CareersPage() {
  const [allJobs, setAllJobs] = useState(() => getJobs({ onlyActive: true }));
  const { user, requireAuth } = useAuth();
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [modalJob, setModalJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (data?.jobs) {
          setAllJobs(data.jobs);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch live jobs, using cached data:", err);
      });
  }, []);

  const departments = useMemo(() => {
    const deps = new Set(allJobs.map((j) => j.department));
    return ["All", ...Array.from(deps)];
  }, [allJobs]);

  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      const matchesDept = selectedDepartment === "All" || job.department === selectedDepartment;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.summary.toLowerCase().includes(q) ||
        job.tags.some((t) => t.toLowerCase().includes(q));
      return matchesDept && matchesSearch;
    });
  }, [allJobs, selectedDepartment, searchQuery]);

  const handleOpenModal = (job = null) => {
    const jobTitle = job ? job.title : "our engineering positions";
    requireAuth({
      message: `Please sign in with Google or your email to apply for ${jobTitle}.`,
      onSuccess: () => {
        setModalJob(job);
        setIsModalOpen(true);
      },
    });
  };

  const toggleExpand = (id) => {
    setExpandedJobId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Header */}
      <section className="relative py-24 bg-gradient-to-b from-[#0e1424] to-[#090d16] border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-900/40 border border-violet-500/30 text-violet-300 text-xs sm:text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Join Our Engineering Collective</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6">
            Build Mission-Critical Web & <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              WhatsApp Messaging Systems
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We are looking for self-driven engineers, cloud architects, and product designers who value clean code, deep ownership, and real-world impact.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#positions"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-violet-600/30 transition text-sm"
            >
              <span>Explore Open Positions</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={() => handleOpenModal(null)}
              type="button"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold px-7 py-3.5 rounded-xl backdrop-blur-md transition text-sm"
            >
              <Send className="w-4 h-4 text-emerald-400" />
              <span>Submit General CV</span>
            </button>
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/15 rounded-full blur-[100px] pointer-events-none" />
      </section>

      {/* Engineering Culture Pillars */}
      <section className="py-20 bg-[#060911] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Why Engineers Thrive at Vnoirs
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Autonomy, modern stacks, and direct problem solving—free from bureaucratic bloat.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "100% Remote-First",
                desc: "Work from wherever you are most productive. We evaluate output and code quality, not clocked hours.",
                icon: MapPin,
              },
              {
                title: "Production Tech Stacks",
                desc: "Next.js 15, React 19, Meta WhatsApp Cloud API, Redis queues, and Edge Serverless. No ancient legacy frameworks.",
                icon: Cpu,
              },
              {
                title: "Direct Client Impact",
                desc: "Your code deploys straight to production for real businesses, handling millions of live messaging payloads.",
                icon: Zap,
              },
              {
                title: "Supabase CV Storage",
                desc: "Your resume is uploaded securely to our private Supabase Storage bucket and evaluated exclusively by technical founders.",
                icon: Layers,
              },
            ].map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className="glass-card rounded-2xl p-6 border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{pillar.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="positions" className="py-24 bg-[#090d16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading & Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-2">
                Current Opportunities
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Available Positions
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Showing {filteredJobs.length} open {filteredJobs.length === 1 ? "role" : "roles"}
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by role or skill..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              />
            </div>
          </div>

          {/* Department Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 text-xs font-medium no-scrollbar">
            {departments.map((dept) => {
              const active = selectedDepartment === dept;
              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-4 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
                    active
                      ? "bg-violet-600 text-white font-semibold shadow-md shadow-violet-600/30"
                      : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5"
                  }`}
                >
                  {dept}
                </button>
              );
            })}
          </div>

          {/* Jobs Listing */}
          {filteredJobs.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-2xl border border-white/10 p-8">
              <Briefcase className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No positions found</h3>
              <p className="text-gray-400 text-sm mb-6">
                We couldn&apos;t find any roles matching your current filter. You can still send a general CV!
              </p>
              <button
                type="button"
                onClick={() => handleOpenModal(null)}
                className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-2.5 rounded-xl transition text-sm"
              >
                Submit General Application
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredJobs.map((job) => {
                const isExpanded = expandedJobId === job.id;

                return (
                  <div
                    key={job.id}
                    className="glass-card rounded-3xl border border-white/10 hover:border-violet-500/40 transition-all duration-300 overflow-hidden"
                  >
                    {/* Job Card Header */}
                    <div className="p-6 sm:p-8">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="space-y-3 max-w-3xl">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-900/40 border border-violet-500/30 text-violet-300">
                              {job.department}
                            </span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 text-gray-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {job.location}
                            </span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {job.type}
                            </span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                              {job.salary}
                            </span>
                          </div>

                          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                            {job.title}
                          </h3>

                          <p className="text-gray-300 text-sm leading-relaxed">
                            {job.summary}
                          </p>

                          {/* Skill Tags */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {job.tags.map((t) => (
                              <span
                                key={t}
                                className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/5 text-gray-300 border border-white/5"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex lg:flex-col items-center gap-3 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenModal(job)}
                            className="w-full sm:w-auto lg:w-44 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-violet-600/30 transition text-sm cursor-pointer"
                          >
                            <span>Apply for Role</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleExpand(job.id)}
                            className="w-full sm:w-auto lg:w-44 inline-flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-medium px-4 py-3 rounded-xl border border-white/10 transition text-sm cursor-pointer"
                          >
                            <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Accordion Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-white/10 bg-[#060911]/60 p-6 sm:p-8 space-y-6 animate-in slide-in-from-top-2 duration-200">
                        <div className="grid md:grid-cols-2 gap-8">
                          {/* Responsibilities */}
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-3">
                              Key Responsibilities:
                            </h4>
                            <ul className="space-y-2">
                              {job.responsibilities.map((resp, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300 leading-relaxed">
                                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                  <span>{resp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Requirements */}
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-3">
                              Candidate Requirements:
                            </h4>
                            <ul className="space-y-2">
                              {job.requirements.map((req, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300 leading-relaxed">
                                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0 mt-2" />
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="pt-4 flex items-center justify-between border-t border-white/10">
                          <span className="text-xs text-gray-400">
                            Experience target: <strong className="text-white">{job.experience}</strong>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenModal(job)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition"
                          >
                            <span>Ready to apply? Click here to upload CV &rarr;</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* General Open Application Card */}
          <div className="mt-16 glass-card rounded-3xl p-8 sm:p-12 border border-violet-500/30 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Don&apos;t see an exact match?
            </h3>
            <p className="text-gray-300 max-w-xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
              We are constantly seeking brilliant software craftsmen. Upload your CV directly into our Supabase Storage hopper and tell us how you can contribute.
            </p>
            <button
              type="button"
              onClick={() => handleOpenModal(null)}
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3.5 rounded-xl transition shadow-lg shadow-violet-600/30 text-sm cursor-pointer"
            >
              <span>Submit General Application</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Application Modal */}
      {isModalOpen && (
        <JobApplicationModal
          job={modalJob}
          availableJobs={allJobs}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
