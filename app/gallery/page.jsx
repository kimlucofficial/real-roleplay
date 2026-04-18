'use client';

import Image from "next/image";
import { useState } from "react";

const scenes = [
  {
    title: "THE CITY BREATHES",
    subtitle: "Where stories begin",
    img: "https://media.discordapp.net/attachments/1488117722658373743/1494671563553902592/3.png?ex=69e41d9e&is=69e2cc1e&hm=0f5f1fa66c5d19cd06b5198cce1e155defb8d6ed7898e5195884d5e1c855f907&=&format=webp&quality=lossless&width=1286&height=1286",
  },
  {
    title: "LAW VS CHAOS",
    subtitle: "Every choice matters",
    img: "https://media.discordapp.net/attachments/1488117722658373743/1494671563906351206/4.png?ex=69e41d9e&is=69e2cc1e&hm=32fe102663e93a8a443fddd7f2985a2937340378d3e1f20d6bc404055cb82aa9&=&format=webp&quality=lossless&width=1286&height=1286",
  },
  {
    title: "NIGHT LIFE",
    subtitle: "The city never sleeps",
    img: "https://media.discordapp.net/attachments/1488117722658373743/1494671564266930258/5.png?ex=69e41d9e&is=69e2cc1e&hm=4e92ee0ec76cfa92fa25081ac2dc28969afb74349314176ed313ce228902de5f&=&format=webp&quality=lossless&width=1286&height=1286",
  },
  {
    title: "POWER & CONTROL",
    subtitle: "Who runs the streets?",
    img: "https://media.discordapp.net/attachments/1488117722658373743/1494671564648743033/6.png?ex=69e41d9e&is=69e2cc1e&hm=d047e40372741e90ea10f8a14ee6ec1816f1a670f08e0496117f2aae8be27c41&=&format=webp&quality=lossless&width=1286&height=1286",
  },
  {
    title: "THE STORY IS YOURS",
    subtitle: "Write your legacy",
    img: "https://media.discordapp.net/attachments/1488117722658373743/1494671565311316151/8.png?ex=69e41d9e&is=69e2cc1e&hm=b5e81d3124bc721ccb8ba9a33f950f3e99d364a948412a9cb4d5376f89a5ef43&=&format=webp&quality=lossless&width=1286&height=1286",
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