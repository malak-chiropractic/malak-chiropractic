import { getClinic } from "@/lib/content";
import { BookButton, ButtonLink, Container } from "./ui";

export function BookingBand({
  title = "Ready when you are.",
  text = "Book online in a minute, or get in touch if you'd like to ask a question first.",
}: {
  title?: string;
  text?: string;
}) {
  const clinic = getClinic();
  return (
    <section className="bg-paper py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-[28px] bg-ink px-7 py-12 text-white sm:px-12 sm:py-14" data-reveal>
          <svg aria-hidden viewBox="0 0 600 200" className="pointer-events-none absolute -right-16 bottom-0 h-full w-[60%] opacity-20" preserveAspectRatio="none">
            <path d="M0 150 C 150 60, 300 190, 600 40" stroke="#f5e7a8" strokeWidth="2" fill="none" />
            <path d="M0 175 C 160 90, 320 210, 600 80" stroke="#dcecf5" strokeWidth="1" fill="none" />
          </svg>
          <div className="relative grid items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h2 className="font-display text-display-md leading-tight">{title}</h2>
              <p className="mt-3 max-w-xl text-lg text-white/75">{text}</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
              <BookButton url={clinic.bookingUrl} variant="light" />
              <ButtonLink href="/contact" variant="ghost" className="!border-white/30 !text-white hover:!bg-white/10">
                Contact us
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
