'use client';

import { motion } from "framer-motion";
import { useState } from "react";

const images = [
  "https://images.unsplash.com/photo-1519501025264-65ba15a82390",
  "https://images.unsplash.com/photo-1494526585095-c41746248156",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
  "https://images.unsplash.com/photo-1508057198894-247b23fe5ade",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
];

export default function GalleryPage() {
  const [active, setActive] = useState(null);

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white px-6 py-16 overflow-hidden">

      {/* HEADER ANIMATION */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto mb-12"
      >
        <h1 className="text-5xl font-black tracking-[0.15em]">
          GALLERY
        </h1>
        <p className="text-white/40 mt-3">
          Real Roleplay moments captured in-game.
        </p>
      </motion.div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

        {/* TEXT BLOCK */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="col-span-2 row-span-2 bg-gradient-to-br from-purple-600 to-indigo-500 rounded-2xl p-8 flex items-center"
        >
          <h2 className="text-2xl font-black leading-tight">
            REAL RP — LOUD<br/>AND IMMERSIVE
          </h2>
        </motion.div>

        {/* IMAGES */}
        {images.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.05 }}
            className="relative group overflow-hidden rounded-2xl cursor-pointer"
            onClick={() => setActive(src)}
          >
            <img
              src={src}
              className="w-full h-[200px] object-cover transition duration-500 group-hover:scale-110"
            />

            {/* hover overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition" />

            {/* glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(circle_at_center,rgba(255,0,100,0.2),transparent)]" />
          </motion.div>
        ))}
      </div>

      {/* LIGHTBOX */}
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 backdrop-blur flex items-center justify-center z-50"
          onClick={() => setActive(null)}
        >
          <motion.img
            src={active}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
            className="max-w-5xl w-full rounded-xl shadow-[0_0_80px_rgba(255,0,100,0.3)]"
          />
        </motion.div>
      )}
    </div>
  );
}