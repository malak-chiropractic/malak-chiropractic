import type { Metadata } from "next";
import { LegalPage } from "@/components/legal";

export const metadata: Metadata = { title: "Website Terms", description: "Terms of use for the Malak Chiropractic website.", alternates: { canonical: "/website-terms" } };

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Website terms"
      title="Website terms of use"
      updated="[TO CONFIRM: date]"
      sections={[
        { h: "General information only", p: ["Content on this website is general information about musculoskeletal health and our services. It is not a substitute for individual assessment or advice from a registered health practitioner, and it isn't intended to diagnose or treat any condition."] },
        { h: "No guarantee of outcomes", p: ["Every person is different. Treatment is provided only where clinically appropriate and with informed consent, and individual results vary."] },
        { h: "Emergencies", p: ["This website and our forms are not monitored for emergencies. In an emergency, call 000."] },
        { h: "Accuracy", p: ["We review our educational content regularly, including a clinical review before publication, but health information changes. Each article shows when it was last reviewed."] },
        { h: "External links", p: ["Links to other websites, including our booking provider, are provided for convenience. We aren't responsible for their content or privacy practices."] },
        { h: "Intellectual property", p: ["The Malak Chiropractic name, logo, text and original illustrations on this site belong to Malak Chiropractic. Product names and images belong to their owners and are used with permission."] },
        { h: "Contact", p: ["Questions about these terms? Contact us using the details on our Contact page."] },
      ]}
    />
  );
}
