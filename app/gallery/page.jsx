'use client';

import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-[#0b0b0b] text-white px-6 py-16">

      {/* TITLE */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-6xl font-black tracking-[0.15em]">
          GALLERY
        </h1>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">

        {images.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative rounded-3xl p-[2px] group"
          >

            {/* 🔥 BORDER ANIMATION */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 animate-border" />

            {/* CARD */}
            <div className="relative bg-[#0f0f0f] rounded-3xl overflow-hidden">

              <img
                src={src}
                className="w-full h-[220px] object-cover group-hover:scale-110 transition duration-500"
              />

              {/* overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition" />

            </div>
          </motion.div>
        ))}

      </div>
    </div>
  );
}