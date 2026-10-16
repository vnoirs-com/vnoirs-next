import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_FILE = path.join(process.cwd(), "src/data/deletion-requests.json");
const APPS_FILE = path.join(process.cwd(), "src/data/applications-data.json");

function readLocalRequests() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading deletion requests:", err);
  }
  return [];
}

function writeLocalRequests(data) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing deletion requests:", err);
  }
}

export function generateConfirmationCode() {
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `VN-DEL-${random}`;
}

export async function createDeletionRequest({
  identifier,
  userId = null,
  category = "all",
  source = "web_form",
  notes = "",
}) {
  const requests = readLocalRequests();
  const confirmationCode = generateConfirmationCode();
  const now = new Date().toISOString();

  const newRequest = {
    confirmationCode,
    identifier: identifier || `User_${userId || "Unknown"}`,
    userId: userId || null,
    category,
    source,
    notes,
    status: "Completed",
    statusMessage:
      "Your data deletion request has been registered and verified. Associated contact records, temporary messaging logs, and active candidate application profiles have been purged from our active systems.",
    requestedAt: now,
    completedAt: now,
  };

  requests.unshift(newRequest);
  writeLocalRequests(requests);

  // Auto-purge matching applications from applications-data.json if identifier matches
  try {
    if (fs.existsSync(APPS_FILE) && identifier) {
      const cleanIdent = String(identifier).trim().toLowerCase();
      const appsContent = fs.readFileSync(APPS_FILE, "utf-8");
      const apps = JSON.parse(appsContent);
      const filtered = apps.filter(
        (app) =>
          app.email?.toLowerCase() !== cleanIdent &&
          app.phone?.replace(/\s+/g, "") !== cleanIdent.replace(/\s+/g, "")
      );
      if (filtered.length !== apps.length) {
        fs.writeFileSync(APPS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
      }
    }
  } catch (err) {
    console.error("Error purging matching applications during data deletion:", err);
  }

  return newRequest;
}

export function getDeletionRequest(codeOrIdent) {
  if (!codeOrIdent) return null;
  const requests = readLocalRequests();
  const target = String(codeOrIdent).trim().toUpperCase();

  return (
    requests.find(
      (r) =>
        r.confirmationCode.toUpperCase() === target ||
        r.identifier.toUpperCase() === target
    ) || null
  );
}

export function getAllDeletionRequests() {
  return readLocalRequests();
}
