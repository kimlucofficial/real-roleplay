'use client';

import Image from "next/image";
import { useState } from "react";

const scenes = [
  {
    title: "THE CITY BREATHES",
    subtitle: "Where stories begin",
    img: "/images/1.jpg",
  },
  {
    title: "LAW VS CHAOS",
    subtitle: "Every choice matters",
    img: "/images/2.jpg",
  },
  {
    title: "NIGHT LIFE",
    subtitle: "The city never sleeps",
    img: "/images/3.jpg",
  },
  {
    title: "POWER & CONTROL",
    subtitle: "Who runs the streets?",
    img: "/images/4.jpg",
  },
  {
    title: "THE STORY IS YOURS",
    subtitle: "Write your legacy",
    img: "/images/5.jpg",
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
            This is not a gallery. This is a glimpse into a living world.
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
          {/* IMAGE */}
          <Image
            src={scene.img}
            fill
            className="object-cover opacity-60 group-hover:opacity-80 transition duration-700 group-hover:scale-105"
            alt=""
          />

          {/* GRADIENT */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          {/* TEXT */}
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
          <div className="max-w-6xl w-full px-4">
            <Image
              src={active}
              width={1600}
              height={1000}
              className="w-full h-auto rounded-xl shadow-2xl"
              alt=""
            />
          </div>
        </div>
      )}
    </div>
  );
} 