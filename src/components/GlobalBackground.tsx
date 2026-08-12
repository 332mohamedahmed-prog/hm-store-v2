"use client";

export default function GlobalBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden" aria-hidden="true">
      {/* Moving background image */}
      <img
        src="/images/categories-bg.jpg"
        alt=""
        className="w-[140%] h-[140%] object-cover object-center animate-pan"
      />
      {/* Dark overlay — keeps text readable */}
      <div className="absolute inset-0 bg-near-black/85" />
    </div>
  );
}
