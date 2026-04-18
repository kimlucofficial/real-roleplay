'use client';

import Image from "next/image";
import { useState } from "react";

const images = [
  "https://media.discordapp.net/attachments/1488117722658373743/1494671563553902592/3.png",
  "https://media.discordapp.net/attachments/1488117722658373743/1494671563906351206/4.png",
  "https://media.discordapp.net/attachments/1488117722658373743/1494671564266930258/5.png",
  "https://media.discordapp.net/attachments/1488117722658373743/1494671564648743033/6.png",
  "https://media.discordapp.net/attachments/1488117722658373743/1494671564971573358/7.png",
  "https://media.discordapp.net/attachments/1488117722658373743/1494671565311316151/8.png"
];

export default function GalleryPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="bg-black text-white min-h-screen px-6 py-20">

      {/* TITLE */}
      <h1 className="text-5xl font-bold mb-12 text-center tracking-wider">
        CITY GALLERY
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {images.map((src, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl group cursor-pointer border border-white/10"
            onClick={() => setSelected(src)}
          >
            <Image
              src={src}
              alt="gallery"
              width={1200}
              height={800}
              className="w-full h-[300px] object-cover transition duration-500 group-hover:scale-110"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition" />

            {/* TEXT */}
            <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition">
              <p className="text-sm text-white/70">Real Roleplay</p>
              <h3 className="text-lg font-bold">Scene #{i + 1}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <div className="max-w-5xl w-full px-4">
            <Image
              src={selected}
              alt="preview"
              width={1600}
              height={1000}
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}