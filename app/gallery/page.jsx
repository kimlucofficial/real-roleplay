'use client';

import { useState } from "react";

const scenes = [
  {
    title: "THE CITY BREATHES",
    subtitle: "Where stories begin",
    img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  },
  {
    title: "LAW VS CHAOS",
    subtitle: "Every choice matters",
    img: "https://images.unsplash.com/photo-1494526585095-c41746248156",
  },
  {
    title: "NIGHT LIFE",
    subtitle: "The city never sleeps",
    img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
  },
  {
    title: "POWER & CONTROL",
    subtitle: "Who runs the streets?",
    img: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade",
  },
  {
    title: "THE STORY IS YOURS",
    subtitle: "Write your legacy",
    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
  },
];

export default function GalleryPage() {
  const [active, setActive] = useState(null);

  return (
    <div className="bg-black text-white">

      {/* HERO */}
      <section className="h-screen flex items-center justify-center text-center px-6">
        <div>
          <h1 className="text-7xl font-black tracking-widest mb-6">
            ENTER THE CITY
          </h1>
          <p className="text-white/50 max-w-xl mx-auto">
            This is not a gallery. This is a cinematic experience.
          </p>
        </div>
      </section>

      {/* SCENES */}
      {scenes.map((scene, i) => (
        <section
          key={i}
          className="h-screen relative flex items-end px-10 pb-20 group cursor-pointer"
          onClick={() => setActive(scene.img)}
        >
          {/* FIX: dùng img thay vì next/image */}
          <img
            src={scene.img}
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition duration-700"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          <div className="relative z-10 max-w-2xl">
            <h2 className="text-6xl font-black tracking-wider">
              {scene.title}
            </h2>
            <p className="text-white/60 mt-4 text-lg">
              {scene.subtitle}
            </p>
          </div>
        </section>
      ))}

      {/* LIGHTBOX */}
      {active && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur flex items-center justify-center z-50"
          onClick={() => setActive(null)}
        >
          <img
            src={active}
            className="max-w-6xl w-full rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}