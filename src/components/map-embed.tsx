"use client";

import { useState } from "react";

/**
 * Privacy-friendly Google Map: nothing loads from Google until the visitor
 * chooses to show the map. No API key is required for this embed.
 */
export function MapEmbed({ address, className = "" }: { address: string; className?: string }) {
  const [show, setShow] = useState(false);
  const q = encodeURIComponent(address);
  return (
    <div className={`relative overflow-hidden rounded-[22px] bg-[#e7eaec] ${className}`}>
      {show ? (
        <iframe
          title={`Map showing ${address}`}
          src={`https://www.google.com/maps?q=${q}&output=embed`}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <svg viewBox="0 0 400 260" aria-hidden className="absolute inset-0 h-full w-full opacity-60" preserveAspectRatio="xMidYMid slice">
            <path d="M0 180 C 120 150, 200 200, 400 140" stroke="#fff" strokeWidth="14" fill="none" />
            <path d="M120 0 C 140 100, 110 180, 150 260" stroke="#fff" strokeWidth="10" fill="none" />
            <path d="M0 70 L 400 90" stroke="#fff" strokeWidth="6" fill="none" />
            <path d="M290 0 L 270 260" stroke="#fff" strokeWidth="6" fill="none" />
          </svg>
          <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-burgundy text-white shadow-lg">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11z" />
              <circle cx="12" cy="10" r="2.3" />
            </svg>
          </span>
          <p className="relative max-w-xs text-sm font-medium text-ink">{address}</p>
          <button
            type="button"
            onClick={() => setShow(true)}
            className="relative min-h-11 rounded-full bg-white px-5 text-sm font-semibold text-ink ring-1 ring-line-strong transition hover:ring-ink"
          >
            Show interactive map
          </button>
          <p className="relative text-xs text-steel-deep">Loads Google Maps, which may set cookies.</p>
        </div>
      )}
    </div>
  );
}
