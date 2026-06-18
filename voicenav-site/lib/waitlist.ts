import { google } from "googleapis";

/* ═══════════════════════════════════════════════
   Waitlist Utilities
   ─ Validation, analytics, and email scaffolding
   ═══════════════════════════════════════════════ */

/* ───── Source Tracking ───── */

export const VALID_SOURCES = [
  "landing-page",
  "pricing-page",
  "documentation-page",
  "hero-cta",
] as const;

export type WaitlistSource = (typeof VALID_SOURCES)[number];

/* ───── Validation Types ───── */

interface ValidationSuccess<T = string> {
  valid: true;
  value: T;
}

interface ValidationError {
  valid: false;
  message: string;
}

type ValidationResult<T = string> = ValidationSuccess<T> | ValidationError;

/* ───── Name Validation ───── */

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 100;

export function validateName(name: unknown): ValidationResult {
  if (!name || typeof name !== "string") {
    return { valid: false, message: "Full name is required." };
  }

  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return { valid: false, message: "Full name is required." };
  }

  if (trimmed.length < NAME_MIN_LENGTH) {
    return {
      valid: false,
      message: `Name must be at least ${NAME_MIN_LENGTH} characters.`,
    };
  }

  if (trimmed.length > NAME_MAX_LENGTH) {
    return {
      valid: false,
      message: `Name must be ${NAME_MAX_LENGTH} characters or fewer.`,
    };
  }

  return { valid: true, value: trimmed };
}

/* ───── Email Validation ───── */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_MAX_LENGTH = 255;

export function validateEmail(email: unknown): ValidationResult {
  if (!email || typeof email !== "string") {
    return { valid: false, message: "Email address is required." };
  }

  const trimmed = email.trim().toLowerCase();

  if (trimmed.length === 0) {
    return { valid: false, message: "Email address is required." };
  }

  if (trimmed.length > EMAIL_MAX_LENGTH) {
    return {
      valid: false,
      message: `Email must be ${EMAIL_MAX_LENGTH} characters or fewer.`,
    };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return {
      valid: false,
      message: "Please provide a valid email address.",
    };
  }

  return { valid: true, value: trimmed };
}

/* ───── Mobile Validation ───── */

const MOBILE_DIGITS_REGEX = /^\+?\d{10,15}$/;

export function validateMobile(mobile: unknown): ValidationResult {
  if (!mobile || typeof mobile !== "string") {
    return { valid: false, message: "Mobile number is required." };
  }

  // Strip spaces, dashes, and parentheses for validation
  const cleaned = mobile.trim().replace(/[\s\-()]/g, "");

  if (cleaned.length === 0) {
    return { valid: false, message: "Mobile number is required." };
  }

  if (!MOBILE_DIGITS_REGEX.test(cleaned)) {
    return {
      valid: false,
      message: "Please provide a valid mobile number (10–15 digits).",
    };
  }

  return { valid: true, value: cleaned };
}

/* ───── Google Sheets Auth (server-only) ───── */

function getServiceAccountAuth() {
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  if (!serviceAccountJson) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_JSON environment variable is not set."
    );
  }

  const credentials = JSON.parse(serviceAccountJson);

  return new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheetsClient() {
  const auth = getServiceAccountAuth();
  return google.sheets({ version: "v4", auth });
}

function getSheetId(): string {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    throw new Error("GOOGLE_SHEET_ID environment variable is not set.");
  }
  return sheetId;
}

/* ───── Admin Analytics ───── */

export interface WaitlistAnalytics {
  totalCount: number;
  todaySignups: number;
  weeklySignups: number;
  sourceBreakdown: Record<string, number>;
}

/**
 * Get waitlist analytics from the Google Sheet.
 * Intended for admin dashboard use — NOT for client-side consumption.
 *
 * Columns: Name | Email | Mobile | Timestamp | Source | Status
 */
export async function getWaitlistAnalytics(): Promise<WaitlistAnalytics> {
  const sheets = getSheetsClient();
  const sheetId = getSheetId();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "Sheet1!A:F",
  });

  const rows = response.data.values || [];

  // Skip header row if present
  const dataRows =
    rows.length > 0 && rows[0][0]?.toString().toLowerCase() === "name"
      ? rows.slice(1)
      : rows;

  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);

  let todaySignups = 0;
  let weeklySignups = 0;
  const sourceBreakdown: Record<string, number> = {};

  for (const row of dataRows) {
    // Timestamp is in column D (index 3)
    const timestamp = row[3] ? new Date(row[3].toString()) : null;

    if (timestamp) {
      if (timestamp >= todayStart) todaySignups++;
      if (timestamp >= weekStart) weeklySignups++;
    }

    // Source is in column E (index 4)
    const source = row[4]?.toString() || "unknown";
    sourceBreakdown[source] = (sourceBreakdown[source] || 0) + 1;
  }

  return {
    totalCount: dataRows.length,
    todaySignups,
    weeklySignups,
    sourceBreakdown,
  };
}

/**
 * Get total waitlist count.
 */
export async function getWaitlistCount(): Promise<number> {
  const sheets = getSheetsClient();
  const sheetId = getSheetId();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "Sheet1!A:A",
  });

  const rows = response.data.values || [];

  // Skip header row if present
  const hasHeader =
    rows.length > 0 && rows[0][0]?.toString().toLowerCase() === "name";

  return hasHeader ? rows.length - 1 : rows.length;
}

/**
 * Get today's signup count.
 */
export async function getTodaySignups(): Promise<number> {
  const analytics = await getWaitlistAnalytics();
  return analytics.todaySignups;
}

/**
 * Get this week's signup count.
 */
export async function getWeeklySignups(): Promise<number> {
  const analytics = await getWaitlistAnalytics();
  return analytics.weeklySignups;
}

/* ───── Email Notification (Future Ready) ───── */

/**
 * Email notification interface.
 * Implement this with Resend, SendGrid, or any transactional email provider.
 *
 * Usage:
 *   import { sendWaitlistConfirmation } from "@/lib/waitlist";
 *   await sendWaitlistConfirmation("Prasanna", "user@example.com");
 */

export interface EmailProvider {
  sendEmail(options: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void>;
}

// Placeholder — swap in Resend/SendGrid when ready
let emailProvider: EmailProvider | null = null;

/**
 * Register an email provider for waitlist notifications.
 *
 * Example with Resend:
 * ```
 * import { Resend } from "resend";
 * import { setEmailProvider } from "@/lib/waitlist";
 *
 * const resend = new Resend(process.env.RESEND_API_KEY);
 *
 * setEmailProvider({
 *   async sendEmail({ to, subject, html }) {
 *     await resend.emails.send({
 *       from: "VoiceNav <noreply@azuo.dev>",
 *       to,
 *       subject,
 *       html,
 *     });
 *   },
 * });
 * ```
 */
export function setEmailProvider(provider: EmailProvider): void {
  emailProvider = provider;
}

/**
 * Send a waitlist confirmation email.
 * No-ops if no email provider is registered.
 */
export async function sendWaitlistConfirmation(
  name: string,
  email: string
): Promise<void> {
  if (!emailProvider) {
    console.log(
      `[Waitlist] Email provider not configured. Skipping confirmation to: ${email}`
    );
    return;
  }

  try {
    await emailProvider.sendEmail({
      to: email,
      subject: "You're on the VoiceNav waitlist!",
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h1 style="font-size: 24px; color: #2C2A35; margin-bottom: 16px;">
            Welcome to the VoiceNav waitlist, ${name}! 🎉
          </h1>
          <p style="font-size: 16px; color: #5C5968; line-height: 1.6;">
            Thanks for signing up! You'll be among the first to get access
            when VoiceNav launches.
          </p>
          <p style="font-size: 16px; color: #5C5968; line-height: 1.6; margin-top: 16px;">
            We'll keep you updated on our progress. In the meantime, feel free
            to reply to this email with any questions.
          </p>
          <p style="font-size: 14px; color: #8A8694; margin-top: 32px;">
            — The AZUO VoiceNav Team
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error(`[Waitlist] Failed to send confirmation to ${email}:`, error);
  }
}
