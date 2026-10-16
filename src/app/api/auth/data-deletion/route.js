import { NextResponse } from "next/server";
import crypto from "crypto";
import { createDeletionRequest, getDeletionRequest } from "@/lib/deletionStore";
import { resend } from "@/lib/resend";

function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf-8");
}

function parseSignedRequest(signedRequest, secret) {
  try {
    const parts = signedRequest.split(".");
    if (parts.length !== 2) return null;

    const [encodedSig, payloadStr] = parts;
    const payload = JSON.parse(base64UrlDecode(payloadStr));

    // If an app secret is configured, optionally verify HMAC signature
    if (secret) {
      const expectedSig = crypto
        .createHmac("sha256", secret)
        .update(payloadStr)
        .digest("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");

      if (encodedSig !== expectedSig) {
        console.warn("Meta signed_request signature mismatch.");
      }
    }

    return payload;
  } catch (err) {
    console.error("Error parsing signed_request:", err);
    return null;
  }
}

export async function POST(req) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vnoirs.com";
    const appSecret =
      process.env.META_APP_SECRET ||
      process.env.FACEBOOK_APP_SECRET ||
      process.env.META_CLIENT_SECRET ||
      "";

    let signedRequest = null;
    let identifier = null;
    let category = "all";
    let notes = "";
    let source = "meta_callback";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      signedRequest = formData.get("signed_request");
      identifier = formData.get("identifier") || formData.get("email") || null;
      category = formData.get("category") || "all";
      notes = formData.get("notes") || "";
    } else if (contentType.includes("application/json")) {
      const body = await req.json();
      signedRequest = body.signed_request || null;
      identifier = body.identifier || body.email || body.phone || null;
      category = body.category || "all";
      notes = body.notes || "";
      if (body.source) source = body.source;
    } else {
      // Fallback text or query
      const url = new URL(req.url);
      signedRequest = url.searchParams.get("signed_request");
    }

    let userId = null;

    // Handle Meta signed_request if present
    if (signedRequest) {
      const parsed = parseSignedRequest(signedRequest, appSecret);
      if (parsed && parsed.user_id) {
        userId = parsed.user_id;
        identifier = `Meta_User_${parsed.user_id}`;
        source = "meta_callback";
      }
    }

    if (!identifier && !userId) {
      return NextResponse.json(
        {
          error:
            "Missing identifier or signed_request. Please provide an email, phone, or Meta user identifier.",
        },
        { status: 400 }
      );
    }

    // Process and register deletion
    const request = await createDeletionRequest({
      identifier,
      userId,
      category,
      source,
      notes,
    });

    const statusUrl = `${baseUrl}/data-deletion?code=${request.confirmationCode}`;

    // Optionally notify admin via Resend
    if (
      resend &&
      process.env.RESEND_API_KEY &&
      process.env.RESEND_API_KEY !== "re_123456789_placeholder"
    ) {
      try {
        await resend.emails.send({
          from: process.env.CONTACT_FROM_EMAIL || "Vnoirs Privacy <onboarding@resend.dev>",
          to: [process.env.CONTACT_TO_EMAIL || "cs@vnoirs.com"],
          subject: `[Data Deletion] Code: ${request.confirmationCode} (${identifier})`,
          text: `A user data deletion request was received and processed.\n\nConfirmation Code: ${request.confirmationCode}\nIdentifier: ${identifier}\nCategory: ${category}\nSource: ${source}\nStatus URL: ${statusUrl}`,
        });
      } catch (emailErr) {
        console.error("Failed to send data deletion notification email:", emailErr);
      }
    }

    // Return the exact JSON format mandated by Meta:
    // { url: "<status_url>", confirmation_code: "<code_string>" }
    return NextResponse.json({
      url: statusUrl,
      confirmation_code: request.confirmationCode,
    });
  } catch (error) {
    console.error("Data Deletion Endpoint Error:", error);
    return NextResponse.json(
      { error: "Internal server error processing deletion request." },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({
      service: "Vnoirs Meta Data Deletion Callback API",
      status: "active",
      supported_methods: ["POST", "GET"],
      documentation: "https://vnoirs.com/data-deletion",
    });
  }

  const record = getDeletionRequest(code);
  if (!record) {
    return NextResponse.json(
      { error: "Deletion request record not found for the provided code." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    confirmation_code: record.confirmationCode,
    status: record.status,
    status_message: record.statusMessage,
    requested_at: record.requestedAt,
    completed_at: record.completedAt,
  });
}
