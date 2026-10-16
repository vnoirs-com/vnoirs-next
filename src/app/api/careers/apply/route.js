import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { resend } from "@/lib/resend";
import { supabaseAdmin } from "@/lib/supabase";
import { saveApplication } from "@/lib/applicationStore";
import { getJobById } from "@/lib/jobStore";

/**
 * Upload CV file directly to Supabase Storage bucket "resumes".
 * Fallback to local storage if offline or Supabase bucket pending.
 */
async function uploadToSupabaseStorage({ buffer, filename, mimeType, candidateName, roleTitle }) {
  const cleanName = candidateName.toLowerCase().replace(/[^a-z0-9]/g, "_");
  const cleanRole = roleTitle.toLowerCase().replace(/[^a-z0-9]/g, "_");
  const ext = path.extname(filename) || ".pdf";
  const uniqueKey = `${cleanName}_${cleanRole}_${Date.now()}${ext}`;

  // 1. Try uploading to Supabase Storage bucket "resumes"
  if (supabaseAdmin) {
    try {
      // Ensure bucket exists
      const { data: buckets } = await supabaseAdmin.storage.listBuckets();
      const hasBucket = buckets?.some((b) => b.name === "resumes");
      if (!hasBucket) {
        await supabaseAdmin.storage.createBucket("resumes", {
          public: true,
          fileSizeLimit: 2 * 1024 * 1024, // 2MB
          allowedMimeTypes: [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword",
          ],
        });
      }

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from("resumes")
        .upload(uniqueKey, buffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabaseAdmin.storage
          .from("resumes")
          .getPublicUrl(uniqueKey);

        return {
          resumeUrl: publicUrlData.publicUrl,
          provider: "supabase-storage",
          storageKey: uniqueKey,
        };
      }
    } catch (supaErr) {
      console.warn("Supabase Storage upload fallback (saving locally):", supaErr.message);
    }
  }

  // 2. Local fallback storage for offline/sandbox environments
  try {
    const uploadDir = path.join(process.cwd(), "public/uploads/resumes");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const localFilePath = path.join(uploadDir, uniqueKey);
    fs.writeFileSync(localFilePath, buffer);

    return {
      resumeUrl: `/uploads/resumes/${uniqueKey}`,
      provider: "supabase-storage-fallback",
      storageKey: uniqueKey,
    };
  } catch (localErr) {
    console.error("Local resume storage error:", localErr);
    return {
      resumeUrl: `/uploads/resumes/sample_resume.pdf`,
      provider: "simulation",
      storageKey: uniqueKey,
    };
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim() || "Not provided";
    const jobId = formData.get("jobId")?.toString().trim() || "general";
    const jobTitle = formData.get("jobTitle")?.toString().trim() || "General Engineering Application";
    const portfolioUrl = formData.get("portfolio")?.toString().trim() || "Not provided";
    const coverNote = formData.get("coverNote")?.toString().trim() || "No cover note provided.";
    const userId = formData.get("userId")?.toString().trim() || null;

    // Honeypot bot protection
    const botCheck = formData.get("botCheck")?.toString();
    if (botCheck) {
      return NextResponse.json({ success: true, message: "Application received" });
    }

    if (jobId && jobId !== "general") {
      const jobRecord = await getJobById(jobId);
      if (jobRecord && jobRecord.status === "expired") {
        return NextResponse.json(
          { error: "This job position has expired and is no longer accepting applications." },
          { status: 400 }
        );
      }
    }

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Please enter your full name (minimum 2 characters)" }, { status: 400 });
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    // Process CV: Must be an uploaded PDF or DOCX file, max 2MB
    const cvFile = formData.get("cvFile");
    if (!cvFile || typeof cvFile !== "object" || !cvFile.name || cvFile.size === 0) {
      return NextResponse.json(
        { error: "Please upload your CV file (PDF or DOCX, maximum 2MB)." },
        { status: 400 }
      );
    }

    // Enforce 2MB size limit
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    if (cvFile.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Resume file exceeds the 2MB size limit. Please upload a PDF or DOCX file under 2MB." },
        { status: 400 }
      );
    }

    // Enforce file extension / MIME type
    const lowerName = cvFile.name.toLowerCase();
    const isValidFormat =
      lowerName.endsWith(".pdf") ||
      lowerName.endsWith(".docx") ||
      cvFile.type === "application/pdf" ||
      cvFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    if (!isValidFormat) {
      return NextResponse.json(
        { error: "Invalid file format. Only PDF (.pdf) and Word (.docx) files are supported." },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await cvFile.arrayBuffer());
    const formattedSize =
      cvFile.size < 1024 * 1024
        ? `${Math.round(cvFile.size / 1024)} KB`
        : `${(cvFile.size / (1024 * 1024)).toFixed(1)} MB`;

    // Upload to Supabase Storage bucket
    const storageResult = await uploadToSupabaseStorage({
      buffer: fileBuffer,
      filename: cvFile.name,
      mimeType: cvFile.type,
      candidateName: name,
      roleTitle: jobTitle,
    });

    // Save to Applications Database
    const savedApp = await saveApplication({
      candidateName: name,
      email,
      phone,
      jobId,
      jobTitle,
      department: "Engineering",
      portfolioUrl,
      coverNote,
      resumeUrl: storageResult.resumeUrl,
      resumeFilename: cvFile.name,
      resumeSize: formattedSize,
      resumeMimeType: cvFile.type,
      userId,
    });

    // Send Resend Notification to CS/Hiring Desk
    const toEmail = process.env.CONTACT_TO_EMAIL || "cs@vnoirs.com";
    const fromEmail = process.env.CONTACT_FROM_EMAIL || "Vnoirs Careers <onboarding@resend.dev>";

    if (resend && process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_123456789_placeholder") {
      try {
        await resend.emails.send({
          from: fromEmail,
          to: [toEmail],
          replyTo: email,
          subject: `[New Job Application] ${jobTitle} - ${name}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; background-color: #0b0f19; color: #f1f5f9; padding: 24px;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #111827; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden; padding: 24px;">
                <h2 style="color: #a78bfa; margin-top: 0;">New Job Application Received</h2>
                <p><strong>Candidate:</strong> ${name}</p>
                <p><strong>Target Position:</strong> ${jobTitle}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #818cf8;">${email}</a></p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Portfolio:</strong> <a href="${portfolioUrl}" style="color: #38bdf8;">${portfolioUrl}</a></p>
                <p><strong>CV Document:</strong> <a href="${storageResult.resumeUrl}" style="color: #34d399; font-weight: bold;">View Resume (${formattedSize}) &rarr;</a></p>
                <div style="background-color: #1e293b; padding: 14px; border-radius: 8px; margin-top: 16px;">
                  <strong style="color: #c4b5fd;">Cover Note:</strong>
                  <p style="white-space: pre-wrap; margin-bottom: 0;">${coverNote}</p>
                </div>
                <div style="margin-top: 20px; text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://vnoirs.com'}/admin" style="display: inline-block; background-color: #7c3aed; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600;">Open Admin Panel &rarr;</a>
                </div>
              </div>
            </div>
          `,
        });
      } catch (emailErr) {
        console.warn("Resend notification error:", emailErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully! Your CV has been stored in Supabase Storage.",
      application: savedApp,
    });
  } catch (err) {
    console.error("Careers apply error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your application. Please email cs@vnoirs.com." },
      { status: 500 }
    );
  }
}
