import type { Metadata } from "next";
import { getExplorerData } from "@/lib/explorer";
import { Container, PageHero } from "@/components/ui";
import { SpineExplorer } from "@/components/spine-explorer";
import { BookingBand } from "@/components/booking-band";

export const metadata: Metadata = {
  title: "Explore the Spine",
  description: "An interactive guide to the cervical, thoracic and lumbar spine, sacrum and pelvis — anatomy, function and when to seek assessment.",
  alternates: { canonical: "/education/spine" },
};

export default function SpinePage() {
  const explorer = getExplorerData();
  return (
    <>
      <PageHero eyebrow="Patient education · Interactive" title="Explore the spine." intro={<p>Select a region to learn how it&apos;s built, what it does, and when it&apos;s worth having something checked. Use the arrow keys to move between regions.</p>} />
      <section className="bg-paper py-14 sm:py-20">
        <Container>
          <SpineExplorer regions={explorer.regions} intro={explorer.intro} />
        </Container>
      </section>
      <BookingBand />
    </>
  );
}
