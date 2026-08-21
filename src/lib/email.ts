import { BUSINESS_NAME } from './constants';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

/**
 * Address the notification emails are sent from. Must be on a domain verified
 * with Resend (yewtreecleaning.co.uk) — free mailbox providers reject mail that
 * claims to come from their domains but is sent by someone else's server.
 */
const DEFAULT_FROM = `${BUSINESS_NAME} <bookings@yewtreecleaning.co.uk>`;

/** Where enquiries land. Overridable so the address can change without a deploy. */
const DEFAULT_TO = 'joy.dowswell@gmail.com';

export interface SendEmailOptions {
  subject: string;
  /** Plain-text body. Rendered into a simple HTML wrapper for the HTML part. */
  body: string;
  /** Customer's address, so replying in the mail client reaches them directly. */
  replyTo?: string;
}

export type SendEmailResult =
  | { ok: true }
  | { ok: false; reason: 'not-configured' | 'send-failed'; detail?: string };

/** Escape user-supplied text before interpolating it into the HTML part. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function toHtml(body: string): string {
  const paragraphs = body
    .trim()
    .split(/\n{2,}/)
    .map(
      (block) =>
        `<p style="margin:0 0 16px;line-height:1.5;">${escapeHtml(block).replace(
          /\n/g,
          '<br />',
        )}</p>`,
    )
    .join('');

  return `<div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;font-size:15px;color:#1f2937;">${paragraphs}</div>`;
}

/**
 * Send a notification email via Resend.
 *
 * Uses fetch rather than the Resend SDK so it runs in the edge runtime the
 * whole site is deployed on. Never throws — callers decide what a failure
 * means for the request they are handling.
 */
export async function sendEmail(
  options: SendEmailOptions,
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn(
      '[email] RESEND_API_KEY is not set — enquiry not emailed:',
      options.subject,
    );
    return { ok: false, reason: 'not-configured' };
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || DEFAULT_FROM,
        to: [process.env.EMAIL_TO || DEFAULT_TO],
        subject: options.subject,
        text: options.body,
        html: toHtml(options.body),
        ...(options.replyTo ? { reply_to: options.replyTo } : {}),
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.error('[email] Resend rejected the message:', response.status, detail);
      return { ok: false, reason: 'send-failed', detail };
    }

    return { ok: true };
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error('[email] Failed to reach Resend:', detail);
    return { ok: false, reason: 'send-failed', detail };
  }
}

/** Format a value for an email body, with a placeholder for empty fields. */
export function field(label: string, value?: string | number | null): string {
  const text =
    value === undefined || value === null || value === '' ? '—' : String(value);
  return `${label}: ${text}`;
}
