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
];

export default function GalleryPage() {
  const [active, setActive] = useState(null);

  return (
    <div className="bg-[#0a0a0a] text-white">

      {/* HERO */}
      <section className="h-screen flex items-center justify-center text-center px-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a1a1a,black)]" />
        
        <div className="relative z-10">
          <h1 className="text-7xl font-black tracking-[0.2em] text-white">
            GALLERY
          </h1>

          <div className="h-[2px] w-32 mx-auto mt-6 bg-gradient-to-r from-yellow-400 to-orange-500" />

          <p className="text-white/40 mt-6 max-w-xl mx-auto">
            A cinematic look into the world of Real Roleplay.
          </p>
        </div>
      </section>

      {/* SCENES */}
      <div className="max-w-7xl mx-auto px-6 pb-32 space-y-32">
        {scenes.map((scene, i) => (
          <div
            key={i}
            className={`flex flex-col md:flex-row items-center gap-10 ${
              i % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* IMAGE */}
            <div
              className="w-full md:w-1/2 relative group cursor-pointer"
              onClick={() => setActive(scene.img)}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition" />

              <img
                src={scene.img}
                className="rounded-2xl shadow-2xl object-cover w-full h-[350px] group-hover:scale-[1.03] transition duration-500"
              />
            </div>

            {/* TEXT */}
            <div className="w-full md:w-1/2">
              <h2 className="text-4xl font-black tracking-wider">
                {scene.title}
              </h2>

              <div className="h-[2px] w-16 bg-yellow-400 mt-4 mb-4" />

              <p className="text-white/50 text-lg">
                {scene.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX */}
      {active && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur flex items-center justify-center z-50"
          onClick={() => setActive(null)}
        >
          <img
            src={active}
            className="max-w-6xl w-full rounded-xl shadow-[0_0_60px_rgba(255,200,0,0.3)]"
          />
        </div>
      )}
    </div>
  );
}