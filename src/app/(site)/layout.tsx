import { SiteHeader } from "@/components/header";
import { SiteFooter } from "@/components/footer";
import { RevealObserver } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { getClinic, SITE_URL, fullAddress } from "@/lib/content";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const clinic = getClinic();
  const business = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": `${SITE_URL}/#clinic`,
    name: clinic.name,
    url: SITE_URL,
    telephone: clinic.phone,
    email: clinic.email,
    medicalSpecialty: "Chiropractic",
    address: {
      "@type": "PostalAddress",
      streetAddress: clinic.streetAddress,
      addressLocality: clinic.suburb,
      addressRegion: clinic.state,
      postalCode: clinic.postcode,
      addressCountry: "AU",
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress(clinic))}`,
    areaServed: ["Panania", "Revesby", "Padstow", "Picnic Point", "East Hills", "Bankstown", "Canterbury-Bankstown"],
    openingHoursSpecification: clinic.hours
      .filter((h) => h.open && /\d/.test(h.note))
      .map((h) => {
        const [o, c] = h.note.split(/[–-]/).map((s) => s.trim());
        const to24 = (t: string) => {
          const m = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
          if (!m) return t;
          let hr = Number(m[1]) % 12;
          if (m[3].toUpperCase() === "PM") hr += 12;
          return `${String(hr).padStart(2, "0")}:${m[2]}`;
        };
        return { "@type": "OpeningHoursSpecification", dayOfWeek: h.day, opens: to24(o), closes: to24(c) };
      }),
    potentialAction: { "@type": "ReserveAction", target: clinic.bookingUrl },
  };

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SiteHeader bookingUrl={clinic.bookingUrl} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter clinic={clinic} />
      <RevealObserver />
      <JsonLd data={business} />
    </>
  );
}
