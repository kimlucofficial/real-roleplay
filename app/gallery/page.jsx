'use client';

import { motion } from "framer-motion";

const images = [
  "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop",
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white px-6 py-16">
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-6xl font-black tracking-[0.12em]">GALLERY</h1>
        <p className="mt-3 text-white/40">Cinematic moments from Real Roleplay.</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[28px] p-[1px] overflow-hidden"
        >
          <div className="card-border absolute inset-0 rounded-[28px]" />
          <div className="relative rounded-[27px] bg-[#0d0d0d] px-8 py-10 min-h-[240px] flex items-end">
            <div>
              <div className="text-[12px] uppercase tracking-[0.32em] text-white/40">Real Roleplay</div>
              <h2 className="mt-4 text-4xl font-black leading-none">
                VISUAL
                <br />
                ARCHIVE
              </h2>
            </div>
          </div>
        </motion.div>

        {images.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative rounded-[28px] p-[1px] overflow-hidden group"
          >
            <div className="card-border absolute inset-0 rounded-[28px] opacity-70 group-hover:opacity-100" />
            <div className="relative rounded-[27px] bg-[#0d0d0d] overflow-hidden">
              <img
                src={src}
                alt={`gallery-${i + 1}`}
                className="w-full h-[240px] object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}