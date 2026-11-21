import { ButtonLink, Container, Eyebrow } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="bg-paper py-24 sm:py-32">
      <Container>
        <Eyebrow>Page not found</Eyebrow>
        <h1 className="font-display mt-5 max-w-3xl text-display-lg leading-[1.05] text-ink">This page isn&apos;t here — yet.</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-steel-deep">
          It may have moved, or it may still be in progress. Head back to the homepage, or book online if that&apos;s what you came for.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="https://malak-chiropractic.au4.cliniko.com/bookings" external variant="ghost">
            Book online
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
