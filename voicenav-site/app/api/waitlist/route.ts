import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import {
  validateName,
  validateEmail,
  validateMobile,
  type WaitlistSource,
  VALID_SOURCES,
} from "@/lib/waitlist";

/* ───── Types ───── */

interface WaitlistRequestBody {
  name?: string;
  email?: string;
  mobile?: string;
  source?: string;
}

interface WaitlistSuccessResponse {
  success: true;
}

interface WaitlistErrorResponse {
  success: false;
  message: string;
}

type WaitlistResponse = WaitlistSuccessResponse | WaitlistErrorResponse;

/* ───── In-memory rate limiter ───── */

interface RateLimitEntry {
  timestamps: number[];
}

const RATE_LIMIT_MAP = new Map<string, RateLimitEntry>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function cleanupRateLimitMap() {
  const now = Date.now();
  for (const [ip, entry] of RATE_LIMIT_MAP.entries()) {
    entry.timestamps = entry.timestamps.filter(
      (t) => now - t < RATE_LIMIT_WINDOW_MS
    );
    if (entry.timestamps.length === 0) {
      RATE_LIMIT_MAP.delete(ip);
    }
  }
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT_MAP.get(ip);

  if (!entry) {
    RATE_LIMIT_MAP.set(ip, { timestamps: [now] });
    return false;
  }

  // Clean old entries for this IP
  entry.timestamps = entry.timestamps.filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );

  if (entry.timestamps.length >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.timestamps.push(now);
  return false;
}

// Periodic cleanup every 10 minutes
if (typeof globalThis !== "undefined") {
  const CLEANUP_KEY = "__waitlist_cleanup_interval__";
  const g = globalThis as Record<string, unknown>;
  if (!g[CLEANUP_KEY]) {
    g[CLEANUP_KEY] = setInterval(cleanupRateLimitMap, 10 * 60 * 1000);
  }
}

/* ───── Google Sheets Auth ───── */

function getServiceAccountAuth() {
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  if (!serviceAccountJson) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_JSON environment variable is not set."
    );
  }

  let credentials: { client_email: string; private_key: string };

  try {
    credentials = JSON.parse(serviceAccountJson);
  } catch {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON contains invalid JSON.");
  }

  return new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

/* ───── Helpers ───── */

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

function isValidSource(source: string): source is WaitlistSource {
  return VALID_SOURCES.includes(source as WaitlistSource);
}

/* ───── POST Handler ───── */

export async function POST(
  request: NextRequest
): Promise<NextResponse<WaitlistResponse>> {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!sheetId) {
      console.error("GOOGLE_SHEET_ID environment variable is not set.");
      return NextResponse.json(
        { success: false as const, message: "Server configuration error." },
        { status: 500 }
      );
    }

    /* ── Rate limiting ── */
    const clientIP = getClientIP(request);

    if (isRateLimited(clientIP)) {
      return NextResponse.json(
        {
          success: false as const,
          message: "Too many requests. Please try again later.",
        },
        { status: 429 }
      );
    }

    /* ── Parse body ── */
    let body: WaitlistRequestBody;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false as const, message: "Invalid request body." },
        { status: 400 }
      );
    }

    const { name: rawName, email: rawEmail, mobile: rawMobile, source: rawSource } = body;

    /* ── Validate name ── */
    const nameValidation = validateName(rawName);

    if (!nameValidation.valid) {
      return NextResponse.json(
        { success: false as const, message: nameValidation.message },
        { status: 400 }
      );
    }

    /* ── Validate email ── */
    const emailValidation = validateEmail(rawEmail);

    if (!emailValidation.valid) {
      return NextResponse.json(
        { success: false as const, message: emailValidation.message },
        { status: 400 }
      );
    }

    /* ── Validate mobile ── */
    const mobileValidation = validateMobile(rawMobile);

    if (!mobileValidation.valid) {
      return NextResponse.json(
        { success: false as const, message: mobileValidation.message },
        { status: 400 }
      );
    }

    const validName = nameValidation.value;
    const validEmail = emailValidation.value;
    const validMobile = mobileValidation.value;

    /* ── Validate source ── */
    const source: WaitlistSource =
      rawSource && isValidSource(rawSource) ? rawSource : "landing-page";

    /* ── Google Sheets ── */
    const auth = getServiceAccountAuth();
    const sheets = google.sheets({ version: "v4", auth });

    /* ── Duplicate check (by email) ── */
    const existingData = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Sheet1!B:B",
    });

    const rows = existingData.data.values;
    if (rows) {
      const emailExists = rows.some(
        (row) =>
          row[0] && row[0].toString().toLowerCase() === validEmail
      );

      if (emailExists) {
        return NextResponse.json(
          { success: false as const, message: "Email already registered." },
          { status: 409 }
        );
      }
    }

    /* ── Append row ── */
    // Columns: Name | Email | Mobile | Timestamp | Source | Status
    const timestamp = new Date().toISOString();
    const status = "Pending";

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Sheet1!A:F",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [[validName, validEmail, validMobile, timestamp, source, status]],
      },
    });

    return NextResponse.json({ success: true as const }, { status: 200 });
  } catch (error) {
    console.error("Waitlist API error:", error);

    // Never expose internal error details to clients
    return NextResponse.json(
      { success: false as const, message: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
