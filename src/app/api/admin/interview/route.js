import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { scheduleInterviewOnApplication } from "@/lib/applicationStore";
import { requireAdmin } from "@/lib/adminAuth";

export async function POST(req) {
  const auth = await requireAdmin(req);
  if (!auth.authorized) {
    return auth.errorResponse;
  }

  try {
    const body = await req.json();
    const {
      applicationId,
      candidateName,
      candidateEmail,
      jobTitle,
      scheduledAt,
      format,
      meetingLink,
      interviewer,
      notes,
    } = body;

    if (!applicationId || !candidateEmail || !scheduledAt) {
      return NextResponse.json(
        { error: "Missing required fields: applicationId, candidateEmail, and scheduledAt are required." },
        { status: 400 }
      );
    }

    const interviewData = {
      scheduledAt,
      format: format || "Google Meet",
      meetingLink: meetingLink || "https://meet.google.com",
      interviewer: interviewer || "Vnoirs Engineering Leadership",
      notes: notes || "Technical discussion and architecture walkthrough.",
      sentAt: new Date().toISOString(),
    };

    // Format human-friendly date string
    const dateObj = new Date(scheduledAt);
    const formattedDate = !isNaN(dateObj.getTime())
      ? dateObj.toLocaleString("en-US", {
          dateStyle: "full",
          timeStyle: "short",
        })
      : scheduledAt;

    // Send Interview Call Email via Resend
    let emailSent = false;
    let emailError = null;

    if (resend && process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_123456789_placeholder") {
      const fromEmail = process.env.CONTACT_FROM_EMAIL || "Vnoirs Careers <onboarding@resend.dev>";
      const replyToEmail = process.env.CONTACT_TO_EMAIL || "cs@vnoirs.com";

      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Interview Invitation - Vnoirs</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f1f5f9; padding: 24px; margin: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #111827; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden;">
    <tr>
      <td style="padding: 28px 24px; background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);">
        <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">Vnoirs &bull; Interview Invitation</h1>
        <p style="margin: 6px 0 0 0; color: #e0e7ff; font-size: 14px;">Position: ${jobTitle}</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 28px 24px;">
        <p style="font-size: 15px; color: #f8fafc; line-height: 1.6; margin-top: 0;">
          Dear <strong>${candidateName}</strong>,
        </p>
        <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
          Thank you for applying for the <strong>${jobTitle}</strong> position at Vnoirs. Our engineering leadership reviewed your CV and would love to invite you for a technical discussion.
        </p>

        <!-- Interview Details Box -->
        <table width="100%" cellpadding="10" cellspacing="0" style="margin: 20px 0; background-color: #1e293b; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); font-size: 14px;">
          <tr>
            <td width="35%" style="color: #94a3b8; font-weight: 600; border-bottom: 1px solid #334155;">Date & Time:</td>
            <td style="color: #38bdf8; font-weight: 700; border-bottom: 1px solid #334155;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; font-weight: 600; border-bottom: 1px solid #334155;">Interview Format:</td>
            <td style="color: #ffffff; font-weight: 600; border-bottom: 1px solid #334155;">${interviewData.format}</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; font-weight: 600; border-bottom: 1px solid #334155;">Meeting Link:</td>
            <td style="border-bottom: 1px solid #334155;">
              <a href="${interviewData.meetingLink}" style="color: #a78bfa; text-decoration: underline; font-weight: 600;">${interviewData.meetingLink}</a>
            </td>
          </tr>
          <tr>
            <td style="color: #94a3b8; font-weight: 600;">Interviewer:</td>
            <td style="color: #ffffff;">${interviewData.interviewer}</td>
          </tr>
        </table>

        <!-- Meeting CTA Button -->
        <div style="text-align: center; margin: 28px 0;">
          <a href="${interviewData.meetingLink}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%); color: #ffffff; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);">
            Join Interview Session &rarr;
          </a>
        </div>

        <!-- Instructions / Notes -->
        ${
          interviewData.notes
            ? `
          <div style="background-color: #0f172a; padding: 16px; border-radius: 8px; border-left: 4px solid #8b5cf6; margin-top: 20px;">
            <strong style="color: #c4b5fd; font-size: 13px;">Preparation & Agenda Notes:</strong>
            <p style="margin: 6px 0 0 0; font-size: 13px; color: #94a3b8; line-height: 1.5; white-space: pre-wrap;">${interviewData.notes}</p>
          </div>
        `
            : ""
        }

        <p style="font-size: 13px; color: #94a3b8; line-height: 1.6; margin-top: 24px;">
          If you need to reschedule or have questions ahead of time, simply reply directly to this email or reach us via WhatsApp at <strong>+92 320 2453000</strong>.
        </p>

        <p style="font-size: 13px; color: #f1f5f9; margin-bottom: 0;">
          Best regards,<br>
          <strong>Vnoirs Engineering Talent Desk</strong>
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 24px; background-color: #090d16; text-align: center; font-size: 12px; color: #64748b;">
        Vnoirs &bull; Official WhatsApp Cloud API & High-Performance Web Solutions &bull; https://vnoirs.com
      </td>
    </tr>
  </table>
</body>
</html>
      `;

      try {
        const { error: sendError } = await resend.emails.send({
          from: fromEmail,
          to: [candidateEmail],
          replyTo: replyToEmail,
          subject: `[Interview Invitation] ${jobTitle} - Vnoirs Engineering`,
          html: htmlContent,
          text: `Dear ${candidateName},\n\nYou are invited to interview for ${jobTitle} at Vnoirs.\nDate & Time: ${formattedDate}\nFormat: ${interviewData.format}\nMeeting Link: ${interviewData.meetingLink}\n\nNotes:\n${interviewData.notes}\n\nBest regards,\nVnoirs Team`,
        });

        if (sendError) {
          console.error("Resend interview email error:", sendError);
          emailError = sendError.message;
        } else {
          emailSent = true;
        }
      } catch (e) {
        console.error("Resend execution error:", e);
        emailError = e.message;
      }
    } else {
      console.log("-----------------------------------------");
      console.log("📨 [SIMULATION: Interview Email Dispatched via Resend]");
      console.log(`To: ${candidateName} <${candidateEmail}>`);
      console.log(`Role: ${jobTitle}`);
      console.log(`Time: ${formattedDate}`);
      console.log(`Link: ${interviewData.meetingLink}`);
      console.log("-----------------------------------------");
      emailSent = true;
    }

    // Update Application status in persistent store & Supabase
    const updatedApp = await scheduleInterviewOnApplication(applicationId, interviewData);

    return NextResponse.json({
      success: true,
      message: emailSent
        ? `Interview invitation successfully dispatched to ${candidateEmail}!`
        : `Interview recorded. (Email warning: ${emailError})`,
      interview: interviewData,
      application: updatedApp,
    });
  } catch (err) {
    console.error("Interview scheduling endpoint error:", err);
    return NextResponse.json(
      { error: "Failed to schedule interview and send invitation email." },
      { status: 500 }
    );
  }
}
