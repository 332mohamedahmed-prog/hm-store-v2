"use client";

export default function GlobalBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden" aria-hidden="true">
      {/* Moving background image */}
      <img
          src="https://images.pexels.com/photos/8711176/pexels-photo-8711176.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
        alt=""
        className="w-[140%] h-[140%] object-cover object-center animate-pan"
      />
      {/* Dark overlay — keeps text readable */}
      <div className="absolute inset-0 bg-near-black/85" />
    </div>
  );
}
