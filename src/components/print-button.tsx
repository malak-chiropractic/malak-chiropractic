"use client";
export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 font-semibold text-white hover:bg-[#2a2e33]">
      Print / save as PDF
    </button>
  );
}
