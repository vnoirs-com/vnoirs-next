import { NextResponse } from "next/server";
import { z } from "zod";
import { resend } from "@/lib/resend";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(30).optional().default(""),
  service: z.string().min(1, "Please select an inquiry topic"),
  message: z.string().min(10, "Message must be at least 10 characters").max(3000),
});

export async function POST(req) {
  try {
    const body = await req.json();

    const parseResult = contactSchema.safeParse(body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { name, email, phone, service, message } = parseResult.data;

    const toEmail = process.env.CONTACT_TO_EMAIL || "cs@vnoirs.com";
    const fromEmail = process.env.CONTACT_FROM_EMAIL || "Vnoirs <onboarding@resend.dev>";
    const timestamp = new Date().toLocaleString("en-US", { timeZone: "UTC" });

    // If Resend API Key is configured, send the real email via Resend
    if (resend && process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_123456789_placeholder") {
      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Website Inquiry - Vnoirs</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f1f5f9; padding: 24px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #111827; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden;">
    <tr>
      <td style="padding: 24px; background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);">
        <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700;">Vnoirs &bull; New Client Inquiry</h1>
        <p style="margin: 4px 0 0 0; color: #e0e7ff; font-size: 13px;">Received via vnoirs.com</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px;">
        <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px; color: #e2e8f0; margin-bottom: 20px;">
          <tr>
            <td width="30%" style="font-weight: 600; color: #94a3b8; border-bottom: 1px solid #1f2937;">Client Name:</td>
            <td style="border-bottom: 1px solid #1f2937; color: #ffffff;">${name}</td>
          </tr>
          <tr>
            <td style="font-weight: 600; color: #94a3b8; border-bottom: 1px solid #1f2937;">Email:</td>
            <td style="border-bottom: 1px solid #1f2937;"><a href="mailto:${email}" style="color: #a78bfa; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="font-weight: 600; color: #94a3b8; border-bottom: 1px solid #1f2937;">Phone/WhatsApp:</td>
            <td style="border-bottom: 1px solid #1f2937; color: #ffffff;">${phone || "Not provided"}</td>
          </tr>
          <tr>
            <td style="font-weight: 600; color: #94a3b8; border-bottom: 1px solid #1f2937;">Inquiry Topic:</td>
            <td style="border-bottom: 1px solid #1f2937; color: #a78bfa; font-weight: 600;">${service}</td>
          </tr>
          <tr>
            <td style="font-weight: 600; color: #94a3b8;">Timestamp:</td>
            <td style="color: #94a3b8;">${timestamp} UTC</td>
          </tr>
        </table>

        <div style="background-color: #1e293b; padding: 16px; border-radius: 8px; border-left: 4px solid #8b5cf6;">
          <h3 style="margin-top: 0; margin-bottom: 8px; font-size: 14px; color: #c4b5fd;">Client Message:</h3>
          <p style="margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #f8fafc;">${message}</p>
        </div>

        <div style="margin-top: 24px; text-align: center;">
          <a href="mailto:${email}?subject=Re:%20Inquiry%20from%20Vnoirs%20(${encodeURIComponent(service)})" 
             style="display: inline-block; background-color: #7c3aed; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600;">
            Reply directly to ${name}
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 24px; background-color: #0b0f19; text-align: center; font-size: 12px; color: #64748b;">
        Delivered to ${toEmail} &bull; Vnoirs Web Solutions & WhatsApp Cloud API Integrations
      </td>
    </tr>
  </table>
</body>
</html>
      `;

      const plainText = `
New Inquiry from Vnoirs Website
----------------------------------------
Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Topic: ${service}
Timestamp: ${timestamp} UTC

Message:
${message}
----------------------------------------
Reply to: ${email}
      `;

      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [toEmail],
        replyTo: email,
        subject: `[Vnoirs Inquiry] ${service} - from ${name}`,
        html: emailHtml,
        text: plainText,
      });

      if (error) {
        console.error("Resend API Error:", error);
        return NextResponse.json(
          { error: `Email service error: ${error.message}` },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, messageId: data?.id });
    }

    // In local development or when API key isn't added yet, log inquiry safely
    console.log("-----------------------------------------");
    console.log("📥 [Vnoirs Contact Form Simulation - RESEND_API_KEY pending]");
    console.log(`From: ${name} (${email}, ${phone})`);
    console.log(`Topic: ${service}`);
    console.log(`Message: ${message}`);
    console.log("-----------------------------------------");

    return NextResponse.json({
      success: true,
      simulation: true,
      note: "Submission logged. Add your RESEND_API_KEY in .env.local to activate live delivery.",
    });
  } catch (error) {
    console.error("Contact API Route Error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try contacting cs@vnoirs.com directly." },
      { status: 500 }
    );
  }
}
