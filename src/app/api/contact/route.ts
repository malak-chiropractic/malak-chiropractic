import { z } from "zod";

/**
 * Enquiry delivery. Requires (see .env.example):
 *   RESEND_API_KEY      — API key from resend.com (free tier is plenty)
 *   CONTACT_TO_EMAIL    — where enquiries are delivered
 *   CONTACT_FROM_EMAIL  — a verified sender on your domain, e.g. "Malak Chiropractic <web@yourdomain>"
 * If these are missing the endpoint returns 503 and the form tells the visitor to call or email instead.
 */

const schema = z.object({
  kind: z.enum(["general", "gp"]),
  name: z.string().trim().min(1, "Please enter your name.").max(120),
  email: z.string().trim().email("Please enter a complete email address.").max(200),
  phone: z.string().trim().max(40).optional().default(""),
  topic: z.string().trim().max(80).optional().default(""),
  practice: z.string().trim().max(160).optional().default(""),
  message: z.string().trim().min(10, "Please add a short message.").max(3000),
  ack: z.literal("yes", { error: "Please tick the confirmation box." }),
  website: z.string().max(0).optional().default(""), // honeypot must be empty
  elapsedMs: z.number().optional(),
});

// Simple per-instance rate limit (5 per 10 minutes per IP)
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) return Response.json({ ok: false, error: "Too many messages in a short time. Please try again later." }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return Response.json({ ok: false, error: "Please check the highlighted fields.", fieldErrors }, { status: 422 });
  }
  const d = parsed.data;
  // Bots: filled honeypot or submitted implausibly fast. Respond as success, send nothing.
  if (d.website || (d.elapsedMs !== undefined && d.elapsedMs < 2500)) return Response.json({ ok: true });

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !to || !from) {
    console.error("[contact] Delivery not configured: set RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL");
    return Response.json({ ok: false, error: "Online enquiries aren't connected yet." }, { status: 503 });
  }

  const subject = d.kind === "gp" ? `GP enquiry — ${d.name} (${d.practice})` : `Website enquiry — ${d.topic || "General"} — ${d.name}`;
  const rows = [
    ["Type", d.kind === "gp" ? "Healthcare professional" : "General"],
    ["Name", d.name],
    ["Email", d.email],
    ["Phone", d.phone || "—"],
    ...(d.kind === "gp" ? [["Practice", d.practice]] : [["Topic", d.topic || "General enquiry"]]),
  ];
  const html = `<table cellpadding="6">${rows.map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${esc(v)}</td></tr>`).join("")}</table><p style="white-space:pre-wrap">${esc(d.message)}</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], reply_to: d.email, subject, html }),
  });
  if (!res.ok) {
    console.error("[contact] Resend error", res.status, await res.text().catch(() => ""));
    return Response.json({ ok: false, error: "Our email service didn't accept the message." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
