"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV, Wordmark } from "./nav";

export function SiteHeader({ bookingUrl }: { bookingUrl: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const first = menuRef.current?.querySelector<HTMLElement>("a,button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab" && menuRef.current) {
        const items = menuRef.current.querySelectorAll<HTMLElement>("a,button");
        const firstEl = items[0];
        const lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          toggleRef.current?.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          toggleRef.current?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  return (
    <header
      className={`sticky top-0 z-50 transition-[background,box-shadow] duration-300 ${
        scrolled || open ? "bg-paper/92 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md" : "bg-paper"
      }`}
      style={{ height: "var(--header-h)" }}
    >
      <div className="mx-auto flex h-full max-w-[1240px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <Link href="/" aria-label="Malak Chiropractic — home" className="shrink-0">
          <Wordmark />
        </Link>

        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`relative rounded-full px-3 py-2 text-[0.9rem] font-medium transition-colors hover:text-burgundy ${
                    isActive(item.href) ? "text-burgundy" : "text-ink"
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span aria-hidden className="absolute inset-x-3 -bottom-0.5 h-px bg-burgundy" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-burgundy px-4 text-[0.9rem] font-semibold text-white transition-colors hover:bg-burgundy-deep sm:px-5"
          >
            Book online
            <span className="sr-only"> (opens Cliniko booking in a new tab)</span>
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-ink transition-colors hover:border-ink xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden className="relative block h-3 w-4">
              <span
                className={`absolute left-0 h-px w-4 bg-current transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 top-1.5 h-px w-4 bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`absolute left-0 h-px w-4 bg-current transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        ref={menuRef}
        hidden={!open}
        className="fixed inset-x-0 bottom-0 overflow-y-auto bg-paper xl:hidden"
        style={{ top: "var(--header-h)" }}
      >
        <nav aria-label="Mobile" onClick={(e) => { if ((e.target as HTMLElement).closest("a")) setOpen(false); }} className="mx-auto flex min-h-full max-w-[1240px] flex-col px-5 pb-10 pt-4 sm:px-8">
          <ul className="border-t border-line">
            {[{ href: "/", label: "Home" }, ...NAV].map((item, i) => (
              <li key={item.href} className="border-b border-line">
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="rise flex items-baseline justify-between py-4"
                  style={{ animationDelay: `${i * 35}ms` }}
                >
                  <span className="font-display text-[1.75rem] text-ink">{item.label}</span>
                  <span className="text-xs font-semibold text-steel-deep">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-[22px] bg-ink p-6 text-white">
            <p className="text-sm text-white/70">Appointments</p>
            <p className="font-display mt-1 text-2xl">Book in under a minute.</p>
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-11 items-center rounded-full bg-white px-5 font-semibold text-ink"
            >
              Book online<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
