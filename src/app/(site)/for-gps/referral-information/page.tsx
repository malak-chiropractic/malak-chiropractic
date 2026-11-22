import type { Metadata } from "next";
import { getClinic, getGp } from "@/lib/content";
import { Container } from "@/components/ui";
import { Lockup } from "@/components/brand";
import { Inline } from "@/components/rich";
import { PrintButton } from "@/components/print-button";

export const metadata: Metadata = {
  title: "Referral Information Sheet",
  description: "A one-page referral information sheet for GPs referring to Malak Chiropractic, Panania.",
  alternates: { canonical: "/for-gps/referral-information" },
};

export default function ReferralSheet() {
  const gp = getGp();
  const c = getClinic();
  return (
    <section className="bg-paper py-10 print:bg-white print:py-0">
      <Container className="max-w-[860px]">
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-steel-deep">Print or save as PDF to keep on file.</p>
          <PrintButton />
        </div>
        <article className="rounded-[18px] bg-white p-8 ring-1 ring-line sm:p-12 print:rounded-none print:p-0 print:ring-0">
          <header className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
            <Lockup className="h-auto w-56" />
            <div className="text-right text-sm text-[#2b2f34]">
              <p className="font-semibold text-ink">Referral information for GPs</p>
              <p>{c.streetAddress}, {c.suburb} {c.state} {c.postcode}</p>
              <p>{c.locationNote}</p>
              <p>{c.phone} · {c.email}</p>
            </div>
          </header>
          <div className="mt-6 grid gap-6 text-[0.92rem] leading-relaxed text-[#2b2f34] sm:grid-cols-2">
            <section>
              <h2 className="font-semibold text-ink">Practitioner</h2>
              <p>Dr Jasmine Malak, Chiropractor — BChiroSc, MChiro (Macquarie). AHPRA registration CHI0002895179.</p>
              <h2 className="mt-4 font-semibold text-ink">Clinic hours</h2>
              <p>{c.hours.filter((h) => h.open).map((h) => `${h.day} ${h.note}`).join(" · ")}</p>
              <h2 className="mt-4 font-semibold text-ink">Scope</h2>
              <ul className="list-disc pl-5">{gp.scope.slice(0, 6).map((s) => <li key={s}>{s}</li>)}</ul>
            </section>
            <section>
              <h2 className="font-semibold text-ink">Referral pathways</h2>
              <p><Inline text={gp.referrals} /></p>
              <h2 className="mt-4 font-semibold text-ink">Funding</h2>
              <p><Inline text={gp.medicare} /></p>
              <h2 className="mt-4 font-semibold text-ink">Secure referral</h2>
              <p><Inline text={gp.secureReferral} /></p>
              <h2 className="mt-4 font-semibold text-ink">Communication</h2>
              <p>Written report after the initial assessment and at discharge, with patient consent.</p>
            </section>
          </div>
        </article>
      </Container>
    </section>
  );
}
