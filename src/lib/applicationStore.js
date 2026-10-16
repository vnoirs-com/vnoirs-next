import fs from "fs";
import path from "path";
import { supabaseAdmin } from "./supabase";

const DATA_FILE = path.join(process.cwd(), "src/data/applications-data.json");

const INITIAL_APPLICATIONS = [
  {
    id: "app_bilal_001",
    candidateName: "Bilal Ahmed",
    email: "bilal.ahmed.eng@gmail.com",
    phone: "+92 321 8923412",
    jobId: "whatsapp-cloud-api-lead",
    jobTitle: "Lead WhatsApp Cloud API Engineer",
    department: "Backend & Messaging",
    portfolioUrl: "https://github.com/bilal-cloud-dev",
    coverNote: "4+ years scaling Meta WhatsApp Cloud API webhooks with Node.js, Redis queue pipelines, and PostgreSQL. Built automated order notification workflows handling 100k+ messages daily.",
    resumeUrl: "/uploads/resumes/bilal_ahmed_cv.pdf",
    resumeFilename: "bilal_ahmed_resume.pdf",
    resumeSize: "1.4 MB",
    resumeMimeType: "application/pdf",
    storageProvider: "supabase-storage",
    status: "Reviewing",
    createdAt: "2026-10-01T14:32:00Z",
    interview: null,
  },
  {
    id: "app_sarah_002",
    candidateName: "Sarah Mansoor",
    email: "sarah.mansoor.design@outlook.com",
    phone: "+92 300 4567891",
    jobId: "uiux-product-designer",
    jobTitle: "UI/UX Product Designer & Design Systems",
    department: "Product & Design",
    portfolioUrl: "https://dribbble.com/sarah-designs",
    coverNote: "Senior UI/UX architect passionate about dark mode glassmorphism, design token systems, and high-conversion landing page flows.",
    resumeUrl: "/uploads/resumes/sarah_mansoor_portfolio_cv.pdf",
    resumeFilename: "sarah_mansoor_cv.pdf",
    resumeSize: "1.8 MB",
    resumeMimeType: "application/pdf",
    storageProvider: "supabase-storage",
    status: "Interview Scheduled",
    createdAt: "2026-09-29T10:15:00Z",
    interview: {
      scheduledAt: "2026-10-04T15:00",
      format: "Google Meet",
      meetingLink: "https://meet.google.com/vnoirs-design-eval",
      interviewer: "Founder & Lead Architect",
      notes: "Portfolio walkthrough: review design systems and component tokens.",
      sentAt: "2026-09-30T11:00:00Z",
    },
  },
  {
    id: "app_usman_003",
    candidateName: "Usman Tariq",
    email: "usman.tariq.fullstack@gmail.com",
    phone: "+92 333 7654321",
    jobId: "senior-fullstack-nextjs",
    jobTitle: "Senior Full-Stack Next.js Engineer",
    department: "Web Engineering",
    portfolioUrl: "https://github.com/usmantariq-dev",
    coverNote: "Hands-on experience architecting Next.js 15 App Router applications with Server Components, TypeScript, Tailwind CSS, and edge runtimes.",
    resumeUrl: "/uploads/resumes/usman_tariq_cv.docx",
    resumeFilename: "usman_tariq_fullstack.docx",
    resumeSize: "850 KB",
    resumeMimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    storageProvider: "supabase-storage",
    status: "Pending",
    createdAt: "2026-10-01T22:45:00Z",
    interview: null,
  },
  {
    id: "app_hamza_004",
    candidateName: "Hamza Raza",
    email: "hamza.raza.devops@yahoo.com",
    phone: "+92 345 1122334",
    jobId: "cloud-devops-engineer",
    jobTitle: "Cloud Infrastructure & DevOps Specialist",
    department: "Cloud & Reliability",
    portfolioUrl: "https://github.com/hamza-infra",
    coverNote: "Experienced in Docker containerization, AWS ECS, Cloudflare zero-trust edge tunnels, and automated GitHub Actions deployments.",
    resumeUrl: "/uploads/resumes/hamza_raza_devops.pdf",
    resumeFilename: "hamza_raza_devops_cv.pdf",
    resumeSize: "1.1 MB",
    resumeMimeType: "application/pdf",
    storageProvider: "supabase-storage",
    status: "Shortlisted",
    createdAt: "2026-09-28T16:20:00Z",
    interview: null,
  },
];

function readLocalData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading local applications data:", err);
  }
  // Initialize with initial applications if file doesn't exist
  writeLocalData(INITIAL_APPLICATIONS);
  return INITIAL_APPLICATIONS;
}

function writeLocalData(data) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing local applications data:", err);
  }
}

export async function getApplications() {
  // Attempt to fetch from Supabase if table exists
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("job_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          candidateName: item.candidate_name,
          email: item.email,
          phone: item.phone,
          jobId: item.job_id,
          jobTitle: item.job_title,
          department: item.department || "Engineering",
          portfolioUrl: item.portfolio_url,
          coverNote: item.cover_note,
          resumeUrl: item.resume_url,
          resumeFilename: item.resume_filename,
          resumeSize: item.resume_size || "1.2 MB",
          resumeMimeType: item.resume_mimetype || "application/pdf",
          storageProvider: item.storage_provider || "supabase-storage",
          status: item.status || "Pending",
          createdAt: item.created_at,
          interview: item.interview_data || null,
        }));
      }
    } catch {
      // Fall through to local data
    }
  }

  return readLocalData();
}

export async function getApplicationById(id) {
  const apps = await getApplications();
  return apps.find((a) => a.id === id) || null;
}

export async function saveApplication(appData) {
  const newApp = {
    id: appData.id || `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    candidateName: appData.candidateName,
    email: appData.email,
    phone: appData.phone || "Not provided",
    jobId: appData.jobId || "general",
    jobTitle: appData.jobTitle || "General Engineering Application",
    department: appData.department || "Engineering",
    portfolioUrl: appData.portfolioUrl || "Not provided",
    coverNote: appData.coverNote || "No cover note provided.",
    resumeUrl: appData.resumeUrl,
    resumeFilename: appData.resumeFilename,
    resumeSize: appData.resumeSize,
    resumeMimeType: appData.resumeMimeType,
    storageProvider: "supabase-storage",
    status: "Pending",
    createdAt: new Date().toISOString(),
    interview: null,
  };

  // Try writing to Supabase table
  if (supabaseAdmin) {
    try {
      await supabaseAdmin.from("job_applications").insert([
        {
          id: newApp.id,
          candidate_name: newApp.candidateName,
          email: newApp.email,
          phone: newApp.phone,
          job_id: newApp.jobId,
          job_title: newApp.jobTitle,
          department: newApp.department,
          portfolio_url: newApp.portfolioUrl,
          cover_note: newApp.coverNote,
          resume_url: newApp.resumeUrl,
          resume_filename: newApp.resumeFilename,
          resume_size: newApp.resumeSize,
          resume_mimetype: newApp.resumeMimeType,
          storage_provider: newApp.storageProvider,
          status: newApp.status,
          created_at: newApp.createdAt,
        },
      ]);
    } catch (e) {
      console.warn("Could not insert to Supabase job_applications table (using local store):", e.message);
    }
  }

  // Always update persistent local store
  const current = readLocalData();
  const updated = [newApp, ...current];
  writeLocalData(updated);

  return newApp;
}

export async function updateApplicationStatus(id, newStatus) {
  if (supabaseAdmin) {
    try {
      await supabaseAdmin
        .from("job_applications")
        .update({ status: newStatus })
        .eq("id", id);
    } catch {
      // Fall through
    }
  }

  const current = readLocalData();
  const index = current.findIndex((a) => a.id === id);
  if (index !== -1) {
    current[index].status = newStatus;
    writeLocalData(current);
    return current[index];
  }
  return null;
}

export async function scheduleInterviewOnApplication(id, interviewData) {
  if (supabaseAdmin) {
    try {
      await supabaseAdmin
        .from("job_applications")
        .update({
          status: "Interview Scheduled",
          interview_data: interviewData,
        })
        .eq("id", id);
    } catch {
      // Fall through
    }
  }

  const current = readLocalData();
  const index = current.findIndex((a) => a.id === id);
  if (index !== -1) {
    current[index].status = "Interview Scheduled";
    current[index].interview = interviewData;
    writeLocalData(current);
    return current[index];
  }
  return null;
}
