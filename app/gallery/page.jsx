'use client';

const images = [
  "https://images.unsplash.com/photo-1519501025264-65ba15a82390",
  "https://images.unsplash.com/photo-1494526585095-c41746248156",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-black text-white py-20 px-6">

      <h1 className="text-6xl font-black mb-10">GALLERY</h1>

      {/* 🔥 FIX GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {images.map((src, i) => (
          <div
            key={i}
            className="relative rounded-2xl overflow-hidden group border border-white/10"
          >
            <img
              src={src}
              className="w-full h-[220px] object-cover group-hover:scale-110 transition"
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition" />
          </div>
        ))}

      </div>
    </div>
  );
}