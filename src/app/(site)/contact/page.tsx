import type { Metadata } from "next";
import { getClinic, fullAddress } from "@/lib/content";
import { BookButton, ButtonLink, Container, Icon, PageHero } from "@/components/ui";
import { Inline } from "@/components/rich";
import { MapEmbed } from "@/components/map-embed";
import { EnquiryForm } from "@/components/enquiry-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Malak Chiropractic at 75 Anderson Avenue, Panania NSW 2213, within Panania Family Doctors. Phone, email, hours, parking and directions.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const c = getClinic();
  return (
    <>
      <PageHero eyebrow="Contact" title="We'd love to hear from you." intro={<p>For appointments, booking online is quickest. For anything else, call, email or send us a message.</p>}>
        <BookButton url={c.bookingUrl} />
      </PageHero>
      <section className="bg-white py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-12 [&>*]:min-w-0">
          <div className="space-y-8 lg:col-span-5">
            {[
              { icon: "pin", t: "Address", v: <>{c.streetAddress}<br />{c.suburb} {c.state} {c.postcode}<br /><span className="text-steel-deep">{c.locationNote}</span></> },
              { icon: "clock", t: "Hours", v: <>{c.hours.filter((h) => h.open).map((h) => <span key={h.day} className="block">{h.day} · {h.note}</span>)}<span className="mt-1 block text-sm text-steel-deep"><Inline text={c.hoursNote} /></span></> },
              { icon: "phone", t: "Phone", v: <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="hover:text-burgundy">{c.phone}</a> },
              { icon: "mail", t: "Email", v: <a href={`mailto:${c.email}`} className="hover:text-burgundy">{c.email}</a> },
              { icon: "book", t: "Parking and access", v: <><Inline text={c.parking} /><span className="mt-1 block text-sm text-steel-deep"><Inline text={c.accessibility} /></span></> },
            ].map((x) => (
              <div key={x.t} className="flex gap-4" data-reveal>
                <Icon name={x.icon} className="h-6 w-6 shrink-0 text-burgundy" />
                <div>
                  <h2 className="text-sm text-steel-deep">{x.t}</h2>
                  <div className="mt-1 font-medium leading-relaxed text-ink">{x.v}</div>
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress(c))}`} external variant="ghost">Get directions</ButtonLink>
            </div>
            <MapEmbed address={fullAddress(c)} className="h-[20rem]" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7" data-reveal>
            <h2 className="font-display text-display-sm text-ink">Send a message</h2>
            <p className="mb-6 mt-2 text-steel-deep">We usually reply within two business days.</p>
            <EnquiryForm phone={c.phone} email={c.email} />
            <p className="mt-6 rounded-xl bg-paper p-4 text-sm leading-relaxed text-[#2b2f34]"><strong className="text-ink">Not for emergencies.</strong> {c.emergencyNotice}</p>
          </div>
        </Container>
      </section>
    </>
  );
}
