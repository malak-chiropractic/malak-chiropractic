import type { Metadata } from "next";
import { getClinic } from "@/lib/content";
import { LegalPage } from "@/components/legal";

export const metadata: Metadata = { title: "Privacy Policy", description: "How Malak Chiropractic collects, uses and protects personal and health information.", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  const c = getClinic();
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy policy"
      updated="21 November 2026 [TO CONFIRM: date this policy is adopted]"
      sections={[
        { h: "Our commitment", p: [`${c.name} respects your privacy. We handle personal and health information in line with the Privacy Act 1988 (Cth), including the Australian Privacy Principles, and the Health Records and Information Privacy Act 2002 (NSW).`] },
        { h: "What we collect", p: ["Website enquiries: the details you choose to give us — usually your name, email, phone number and message. Please don't include detailed health information in website enquiries.", "As a patient: your contact details, date of birth, health fund or claim details where relevant, your medical history, examination findings, treatment notes and correspondence with other practitioners. We collect this information directly from you wherever possible, or with your consent from your GP or other treating practitioners."] },
        { h: "Why we collect it", p: ["To respond to enquiries; to assess, treat and manage your care safely; to communicate with other practitioners involved in your care (with your consent); to process payments and claims such as HICAPS, Medicare, DVA and workers compensation; and to meet our legal and professional obligations. If you don't provide the information we need, we may not be able to provide care safely."] },
        { h: "Online booking and records", p: ["Appointments are booked, and clinical records are kept, in Cliniko, a practice management system. Information you enter when booking is handled under Cliniko's privacy policy and security practices. [TO CONFIRM: that the clinic's Cliniko account stores data in Australia]"] },
        { h: "This website, cookies and analytics", p: ["This website does not currently use analytics, advertising or tracking cookies. If that changes, we'll update this policy and ask for consent where required.", "Our interactive map only loads from Google when you choose to show it; Google may then set its own cookies. The booking button takes you to Cliniko's website.", "Website enquiries are delivered to the clinic by email through a secure email service and are not stored on this website."] },
        { h: "Who we share information with", p: ["We only disclose your information for the purpose it was collected, for a directly related purpose you would reasonably expect, with your consent, or where required or permitted by law. This may include your GP or other treating practitioners, health funds, Medicare, DVA, SIRA and insurers for claims, and service providers who help us run the clinic (such as our practice management and payment systems). We do not sell personal information, and we do not send it overseas except where a service provider stores data offshore. [TO CONFIRM]"] },
        { h: "Storage, security and retention", p: ["Records are stored electronically with password protection and access limited to authorised practitioners. Paper records, if any, are kept securely.", "Under NSW law we keep adult health records for at least 7 years after the last visit, and records of patients seen under 18 until they turn 25. After that, records are securely destroyed."] },
        { h: "Access and correction", p: [`You can ask to see or correct the information we hold about you by contacting us on ${c.phone} or ${c.email}. We'll respond within a reasonable time — usually 30 days. We may charge a reasonable fee for copying records, and we'll tell you beforehand.`] },
        { h: "Data breaches", p: ["If a data breach is likely to cause you serious harm, we'll notify you and the Office of the Australian Information Commissioner, as required by the Notifiable Data Breaches scheme."] },
        { h: "Complaints", p: [`If you have a concern about how we've handled your information, please contact us first on ${c.phone} or ${c.email}. If you're not satisfied with our response, you can contact the Office of the Australian Information Commissioner (oaic.gov.au, 1300 363 992) or the NSW Information and Privacy Commission (ipc.nsw.gov.au, 1800 472 679).`] },
      ]}
    />
  );
}
