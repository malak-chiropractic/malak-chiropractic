import { Monogram, Words } from "./brand";

export const NAV = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Our Services" },
  { href: "/education", label: "Patient Education" },
  { href: "/for-gps", label: "For GPs" },
  { href: "/new-patients", label: "New Patients" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
];


/** Header/footer logo: the interlocked MC monogram with the MALAK / CHIROPRACTIC words. */
export function Wordmark({ className = "", tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <Monogram tone={tone} className="h-12 w-auto" title="" />
      <Words tone={tone} stacked={false} className="hidden h-[0.95rem] w-auto sm:block" />
      <span className="sr-only">Malak Chiropractic</span>
    </span>
  );
}

