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
      updated="[TO CONFIRM: date]"
      sections={[
        { h: "Our commitment", p: [`${c.name} respects your privacy. We handle personal and health information in line with the Privacy Act 1988 (Cth), the Australian Privacy Principles and the Health Records and Information Privacy Act 2002 (NSW).`] },
        { h: "What we collect", p: ["When you contact us through this website we collect the details you provide — usually your name, email, phone number and message. Please don't include detailed health information in website enquiries.", "When you become a patient we collect health information needed to provide safe care, such as your medical history, examination findings and treatment records."] },
        { h: "Online booking", p: ["Appointments are booked through Cliniko, a third-party practice management system. Information you enter there is handled under Cliniko's own privacy policy and security practices."] },
        { h: "Maps and third-party services", p: ["Our interactive map only loads from Google when you choose to show it. Google may then set cookies under its own privacy policy.", "[TO CONFIRM: analytics tool, if any, and whether it uses cookies]"] },
        { h: "How we use and disclose information", p: ["We use your information to respond to enquiries, provide and coordinate your care, process payments and claims (for example HICAPS, Medicare, DVA or workers compensation), and meet legal obligations.", "With your consent, we may share relevant information with your GP or other treating practitioners. We do not sell personal information."] },
        { h: "Storage and security", p: ["Records are stored securely with access limited to authorised staff. [TO CONFIRM: storage arrangements and retention period]"] },
        { h: "Access and correction", p: [`You can ask to access or correct your information at any time by contacting us on ${c.phone} or ${c.email}.`] },
        { h: "Complaints", p: ["If you have a concern about how we've handled your information, please contact us first. If you're not satisfied, you can contact the Office of the Australian Information Commissioner (oaic.gov.au) or the NSW Information and Privacy Commission (ipc.nsw.gov.au)."] },
      ]}
    />
  );
}
