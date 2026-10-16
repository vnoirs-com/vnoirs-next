import fs from "fs";
import path from "path";
import { supabaseAdmin } from "./supabase";

const DATA_FILE = path.join(process.cwd(), "src/data/jobs-data.json");

function readLocalJobs() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading local jobs cache:", err);
  }
  return [];
}

function writeLocalJobs(jobs) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(jobs, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing local jobs cache:", err);
    return false;
  }
}

/**
 * Normalizes a raw Supabase jobs row to application standard format
 */
function normalizeJob(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    department: row.department,
    location: row.location || "Remote",
    type: row.type || "Full-Time",
    experience: row.experience || "1+ Years",
    salary: row.salary || "Market Competitive",
    postedDate: row.posted_date || row.postedDate || "Recent",
    status: row.status || "active",
    summary: row.summary || "",
    responsibilities: Array.isArray(row.responsibilities)
      ? row.responsibilities
      : typeof row.responsibilities === "string"
      ? JSON.parse(row.responsibilities || "[]")
      : [],
    requirements: Array.isArray(row.requirements)
      ? row.requirements
      : typeof row.requirements === "string"
      ? JSON.parse(row.requirements || "[]")
      : [],
    tags: Array.isArray(row.tags)
      ? row.tags
      : typeof row.tags === "string"
      ? JSON.parse(row.tags || "[]")
      : [],
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  };
}

/**
 * Get all jobs directly from Supabase DB
 * @param {Object} options
 * @param {boolean} options.onlyActive - If true, returns only jobs with status 'active'
 */
export async function getJobs({ onlyActive = false } = {}) {
  // 1. Query Supabase Database directly
  if (supabaseAdmin) {
    try {
      let query = supabaseAdmin
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (onlyActive) {
        query = query.eq("status", "active");
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        const normalized = data.map(normalizeJob);
        // Sync local cache
        if (!onlyActive) writeLocalJobs(normalized);
        return normalized;
      }

      // If Supabase table exists but is empty, seed it with the default initial jobs
      if (!error && data && data.length === 0) {
        const seedJobs = readLocalJobs();
        if (seedJobs.length > 0) {
          try {
            await supabaseAdmin.from("jobs").insert(
              seedJobs.map((j) => ({
                id: j.id,
                title: j.title,
                department: j.department,
                location: j.location,
                type: j.type,
                experience: j.experience,
                salary: j.salary,
                posted_date: j.postedDate,
                status: j.status || "active",
                summary: j.summary,
                responsibilities: j.responsibilities || [],
                requirements: j.requirements || [],
                tags: j.tags || [],
              }))
            );
            return onlyActive
              ? seedJobs.filter((j) => (j.status || "active") === "active")
              : seedJobs;
          } catch (seedErr) {
            console.warn("Could not auto-seed jobs into Supabase:", seedErr.message);
          }
        }
      }
    } catch (supaErr) {
      console.warn("Supabase jobs fetch error:", supaErr.message);
    }
  }

  // Fallback to local cache if offline or database table pending
  const localJobs = readLocalJobs();
  if (onlyActive) {
    return localJobs.filter((j) => (j.status || "active") === "active");
  }
  return localJobs;
}

export async function getJobById(id) {
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("jobs")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!error && data) {
        return normalizeJob(data);
      }
    } catch (err) {
      console.warn("Supabase getJobById fallback:", err.message);
    }
  }

  const jobs = readLocalJobs();
  return jobs.find((j) => j.id === id) || null;
}

/**
 * Create a new job opening securely in Supabase DB
 */
export async function createJob(jobData) {
  const id =
    jobData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Math.random().toString(36).substring(2, 6);

  const formattedJob = {
    id,
    title: jobData.title.trim(),
    department: jobData.department.trim(),
    location: jobData.location?.trim() || "Remote",
    type: jobData.type?.trim() || "Full-Time",
    experience: jobData.experience?.trim() || "1+ Years",
    salary: jobData.salary?.trim() || "Market Competitive",
    posted_date:
      jobData.postedDate ||
      new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    status: "active",
    summary: jobData.summary?.trim() || "",
    responsibilities: Array.isArray(jobData.responsibilities)
      ? jobData.responsibilities
      : typeof jobData.responsibilities === "string"
      ? jobData.responsibilities
          .split("\n")
          .map((s) => s.trim().replace(/^[-•*]\s*/, ""))
          .filter(Boolean)
      : [],
    requirements: Array.isArray(jobData.requirements)
      ? jobData.requirements
      : typeof jobData.requirements === "string"
      ? jobData.requirements
          .split("\n")
          .map((s) => s.trim().replace(/^[-•*]\s*/, ""))
          .filter(Boolean)
      : [],
    tags: Array.isArray(jobData.tags)
      ? jobData.tags
      : typeof jobData.tags === "string"
      ? jobData.tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
    created_at: new Date().toISOString(),
  };

  // 1. Insert directly into Supabase DB
  let createdJob = null;
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("jobs")
        .insert([formattedJob])
        .select()
        .single();

      if (!error && data) {
        createdJob = normalizeJob(data);
      } else if (error) {
        console.warn("Supabase insert job error:", error.message);
      }
    } catch (err) {
      console.warn("Supabase insert exception:", err.message);
    }
  }

  const finalJob = createdJob || normalizeJob(formattedJob);

  // 2. Sync to local cache
  const localJobs = readLocalJobs();
  localJobs.unshift(finalJob);
  writeLocalJobs(localJobs);

  return finalJob;
}

/**
 * Update job status (e.g. 'active' or 'expired') in Supabase DB
 */
export async function setJobStatus(id, status) {
  const validStatus = status === "expired" ? "expired" : "active";

  // 1. Update in Supabase DB
  let updatedRecord = null;
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("jobs")
        .update({ status: validStatus })
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        updatedRecord = normalizeJob(data);
      }
    } catch (err) {
      console.warn("Supabase setJobStatus exception:", err.message);
    }
  }

  // 2. Sync to local cache
  const localJobs = readLocalJobs();
  const index = localJobs.findIndex((j) => j.id === id);
  if (index !== -1) {
    localJobs[index].status = validStatus;
    localJobs[index].updatedAt = new Date().toISOString();
    writeLocalJobs(localJobs);
    if (!updatedRecord) updatedRecord = localJobs[index];
  }

  if (!updatedRecord) {
    throw new Error(`Job with ID ${id} not found.`);
  }

  return updatedRecord;
}

/**
 * Delete a job permanently from Supabase DB
 */
export async function deleteJob(id) {
  // 1. Delete from Supabase DB
  if (supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin.from("jobs").delete().eq("id", id);
      if (error) {
        console.warn("Supabase deleteJob error:", error.message);
      }
    } catch (err) {
      console.warn("Supabase deleteJob exception:", err.message);
    }
  }

  // 2. Sync to local cache
  let localJobs = readLocalJobs();
  localJobs = localJobs.filter((j) => j.id !== id);
  writeLocalJobs(localJobs);

  return { success: true, deletedId: id };
}
