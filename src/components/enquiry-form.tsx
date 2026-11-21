"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type Kind = "general" | "gp";
type Errors = Partial<Record<string, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Enquiry form. Validates in the browser and again on the server (/api/contact).
 * If delivery fails or isn't configured, the visitor is told clearly and given
 * the phone number and email — submissions are never silently discarded.
 */
export function EnquiryForm({ kind = "general", phone, email }: { kind?: Kind; phone: string; email: string }) {
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [failMsg, setFailMsg] = useState("");
  const started = useRef(0);
  useEffect(() => {
    started.current = Date.now();
  }, []);
  const formRef = useRef<HTMLFormElement>(null);

  function validate(d: Record<string, string>): Errors {
    const e: Errors = {};
    if (!d.name?.trim()) e.name = "Please enter your name.";
    if (!d.email?.trim()) e.email = "Please enter your email address.";
    else if (!EMAIL.test(d.email.trim())) e.email = "Please enter a complete email address, like name@example.com.";
    if (kind === "gp" && !d.practice?.trim()) e.practice = "Please enter your practice name.";
    if (!d.message?.trim() || d.message.trim().length < 10) e.message = "Please add a short message (at least 10 characters).";
    if (d.message && d.message.length > 3000) e.message = "Please keep your message under 3,000 characters.";
    if (!d.ack) e.ack = kind === "gp" ? "Please confirm this enquiry contains no identifiable patient information." : "Please confirm you understand this form is for general enquiries.";
    return e;
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    const d = Object.fromEntries(Array.from(fd.entries()).map(([k, v]) => [k, String(v)]));
    const e = validate(d);
    setErrors(e);
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...d, kind, elapsedMs: Date.now() - started.current }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) {
        setState("sent");
        formRef.current?.reset();
      } else {
        if (json?.fieldErrors) setErrors(json.fieldErrors);
        setFailMsg(json?.error ?? "We couldn't send your message just now.");
        setState("failed");
      }
    } catch {
      setFailMsg("We couldn't send your message just now.");
      setState("failed");
    }
  }

  const field = "min-h-12 w-full rounded-xl border bg-paper px-4 text-ink outline-none transition focus:border-burgundy focus:bg-white focus:ring-4 focus:ring-burgundy/10";
  const border = (k: string) => (errors[k] ? "border-burgundy bg-white" : "border-line-strong");

  if (state === "sent") {
    return (
      <div role="status" className="rounded-[22px] bg-white p-8 ring-1 ring-line">
        <p className="font-display text-2xl text-ink">Thank you — your message is on its way.</p>
        <p className="mt-2 leading-relaxed text-steel-deep">We&apos;ll reply as soon as we can, usually within two business days. If it&apos;s about an appointment, the quickest option is to book online.</p>
        <button type="button" onClick={() => setState("idle")} className="mt-5 text-sm font-semibold text-burgundy underline underline-offset-4">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-5 rounded-[22px] bg-white p-6 ring-1 ring-line sm:grid-cols-2 sm:p-8">
      <p className="rounded-xl bg-sky/60 p-4 text-sm leading-relaxed text-[#2b2f34] sm:col-span-2">
        {kind === "gp" ? (
          <>
            <strong className="text-ink">Please don&apos;t include patient-identifying or clinical information.</strong> This form is for professional enquiries only. Send referrals through the secure pathway listed above.
          </>
        ) : (
          <>
            <strong className="text-ink">Please don&apos;t include detailed health information.</strong> This form isn&apos;t monitored for emergencies — if you need urgent help, call 000.
          </>
        )}
      </p>
      {/* Honeypot: hidden from people, tempting to bots */}
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor={`${kind}-name`} className="text-sm font-semibold text-ink">{kind === "gp" ? "Your name and title" : "Full name"}</label>
        <input id={`${kind}-name`} name="name" autoComplete="name" className={`${field} ${border("name")}`} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-err" : undefined} />
        <FieldError errors={errors} k="name" />
      </div>
      {kind === "gp" ? (
        <div className="flex flex-col gap-2">
          <label htmlFor="gp-practice" className="text-sm font-semibold text-ink">Practice</label>
          <input id="gp-practice" name="practice" autoComplete="organization" className={`${field} ${border("practice")}`} aria-invalid={!!errors.practice} aria-describedby={errors.practice ? "practice-err" : undefined} />
          <FieldError errors={errors} k="practice" />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <label htmlFor="general-topic" className="text-sm font-semibold text-ink">Topic</label>
          <select id="general-topic" name="topic" className={`${field} border-line-strong`}>
            <option>General enquiry</option>
            <option>Appointments and availability</option>
            <option>Fees, rebates and claims</option>
            <option>Products</option>
          </select>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <label htmlFor={`${kind}-email`} className="text-sm font-semibold text-ink">Email</label>
        <input id={`${kind}-email`} name="email" type="email" autoComplete="email" className={`${field} ${border("email")}`} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-err" : undefined} />
        <FieldError errors={errors} k="email" />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor={`${kind}-phone`} className="text-sm font-semibold text-ink">
          Phone <span className="font-normal text-steel-deep">(optional)</span>
        </label>
        <input id={`${kind}-phone`} name="phone" type="tel" autoComplete="tel" className={`${field} border-line-strong`} />
      </div>
      <div className="flex flex-col gap-2 sm:col-span-2">
        <label htmlFor={`${kind}-message`} className="text-sm font-semibold text-ink">Message</label>
        <textarea id={`${kind}-message`} name="message" rows={5} className={`${field} ${border("message")} py-3`} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-err" : undefined} />
        <FieldError errors={errors} k="message" />
      </div>
      <div className="flex flex-col gap-2 sm:col-span-2">
        <label className="flex items-start gap-3 text-sm text-[#2b2f34]">
          <input type="checkbox" name="ack" value="yes" className="mt-0.5 h-5 w-5 shrink-0 accent-burgundy" aria-invalid={!!errors.ack} />
          {kind === "gp" ? "I confirm this enquiry contains no identifiable patient information." : "I understand this form is for general enquiries and isn't monitored for emergencies."}
        </label>
        <FieldError errors={errors} k="ack" />
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" disabled={state === "sending"} className="inline-flex min-h-11 items-center rounded-full bg-burgundy px-6 font-semibold text-white transition hover:bg-burgundy-deep disabled:opacity-60">
          {state === "sending" ? "Sending…" : "Send enquiry"}
        </button>
        <p className="text-xs text-steel-deep">
          We use your details only to respond. See our{" "}
          <a href="/privacy" className="underline underline-offset-2">privacy policy</a>.
        </p>
      </div>
      {state === "failed" && (
        <div role="alert" className="rounded-xl border border-burgundy/40 bg-white p-4 text-sm leading-relaxed text-ink sm:col-span-2">
          <strong>Your message wasn&apos;t sent.</strong> {failMsg} Please call us on{" "}
          <a className="font-semibold text-burgundy underline" href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a> or email{" "}
          <a className="font-semibold text-burgundy underline" href={`mailto:${email}`}>{email}</a>.
        </div>
      )}
    </form>
  );
}

function FieldError({ errors, k }: { errors: Errors; k: string }) {
  return errors[k] ? (
    <p id={`${k}-err`} className="text-sm font-medium text-burgundy">
      {errors[k]}
    </p>
  ) : null;
}
