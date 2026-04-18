'use client';

import { useMemo, useState } from "react";

export default function GalleryPage() {
  const [active, setActive] = useState(null);

  const scenes = useMemo(() => [
    {
      id: "01",
      title: "CITY NIGHTS",
      subtitle: "Luxury, danger and neon in one frame.",
      category: "DOWNTOWN",
      align: "wide",
      img: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "02",
      title: "LAW & ORDER",
      subtitle: "Authority, control and pressure from above.",
      category: "POLICE",
      align: "stack",
      img: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "03",
      title: "UNDERGROUND",
      subtitle: "The city always has a second face after dark.",
      category: "GANG",
      align: "stack",
      img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "04",
      title: "POWER MOVES",
      subtitle: "Deals, influence and people who never miss.",
      category: "BUSINESS",
      align: "grid",
      img: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "05",
      title: "AFTER MIDNIGHT",
      subtitle: "A city with no brakes and no quiet hours.",
      category: "NIGHTLIFE",
      align: "grid",
      img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "06",
      title: "THE LEGACY",
      subtitle: "Every frame is part of a bigger story.",
      category: "ROLEPLAY",
      align: "grid",
      img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop",
    },
  ], []);

  const hero = scenes[0];
  const stack = scenes.slice(1, 3);
  const grid = scenes.slice(3);

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      <section className="relative overflow-hidden px-6 pb-20 pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,197,58,0.09),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(124,58,237,0.08),transparent_24%)]" />
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <div className="text-[12px] uppercase tracking-[0.38em] text-zinc-500">
              Real Roleplay • Visual Archive
            </div>
            <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-5xl font-black uppercase tracking-[0.18em] md:text-7xl">
                  Gallery
                </h1>
                <div className="mt-5 h-[2px] w-28 bg-gradient-to-r from-[#f4c53a] to-[#7c3aed]" />
              </div>
              <p className="max-w-2xl text-sm leading-8 text-zinc-400 md:text-base">
                Không phải một gallery kiểu template. Đây là phần trưng bày hình ảnh theo hướng cinematic:
                có khoảng thở, có framing, có ánh sáng và có nhịp thị giác rõ ràng. Bạn chỉ cần thay từng link ảnh
                trong file này là giữ nguyên được toàn bộ layout.
              </p>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <button
              type="button"
              onClick={() => setActive(hero)}
              className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-black text-left shadow-[0_40px_100px_rgba(0,0,0,0.45)]"
            >
              <img
                src={hero.img}
                alt={hero.title}
                className="h-[560px] w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.78))]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(244,197,58,0.18),transparent_25%)]" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                <div className="inline-flex rounded-full border border-white/15 bg-black/35 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-200 backdrop-blur-sm">
                  {hero.category}
                </div>
                <h2 className="mt-5 max-w-3xl text-4xl font-black uppercase tracking-[0.12em] md:text-6xl">
                  {hero.title}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
                  {hero.subtitle}
                </p>
              </div>
            </button>

            <div className="grid gap-6">
              {stack.map((scene, index) => (
                <button
                  type="button"
                  key={scene.id}
                  onClick={() => setActive(scene)}
                  className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-[#0c0c0c] text-left shadow-[0_30px_70px_rgba(0,0,0,0.35)]"
                >
                  <img
                    src={scene.img}
                    alt={scene.title}
                    className="h-[267px] w-full object-cover transition duration-700 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.82))]" />
                  <div className={`absolute inset-0 ${index === 0 ? "bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.18),transparent_30%)]" : "bg-[radial-gradient(circle_at_80%_20%,rgba(239,68,68,0.18),transparent_30%)]"}`} />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="text-[11px] uppercase tracking-[0.28em] text-zinc-400">{scene.category}</div>
                    <div className="mt-3 text-2xl font-black uppercase tracking-[0.08em]">{scene.title}</div>
                    <div className="mt-2 text-sm leading-6 text-zinc-300">{scene.subtitle}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {grid.map((scene, i) => (
              <button
                type="button"
                key={scene.id}
                onClick={() => setActive(scene)}
                className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b0b] text-left shadow-[0_25px_60px_rgba(0,0,0,0.32)]"
              >
                <img
                  src={scene.img}
                  alt={scene.title}
                  className="h-[300px] w-full object-cover transition duration-700 group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.82))]" />
                <div className={`absolute inset-0 ${i === 0
                  ? "bg-[radial-gradient(circle_at_20%_24%,rgba(244,197,58,0.18),transparent_26%)]"
                  : i === 1
                  ? "bg-[radial-gradient(circle_at_80%_20%,rgba(124,58,237,0.16),transparent_28%)]"
                  : "bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.1),transparent_24%)]"
                }`} />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-[11px] uppercase tracking-[0.26em] text-zinc-400">{scene.category}</div>
                  <div className="mt-3 text-2xl font-black uppercase tracking-[0.08em]">{scene.title}</div>
                  <div className="mt-2 text-sm leading-6 text-zinc-300">{scene.subtitle}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-12 rounded-[28px] border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <div className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">How to edit later</div>
            <div className="mt-4 grid gap-3 text-sm leading-7 text-zinc-400">
              <div>• Mỗi ảnh hiện tại đang là một link demo ổn định để layout chạy chắc chắn.</div>
              <div>• Bạn chỉ cần thay giá trị <span className="text-zinc-200">img:</span> trong từng object của <span className="text-zinc-200">scenes</span>.</div>
              <div>• Nếu muốn dùng ảnh riêng lâu dài, nên chuyển về <span className="text-zinc-200">/public/images/...</span> thay vì link Discord có thể lỗi.</div>
            </div>
          </div>
        </div>
      </section>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 px-5 py-10 backdrop-blur-md"
          onClick={() => setActive(null)}
        >
          <div className="w-full max-w-6xl">
            <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[#0a0a0a] shadow-[0_35px_100px_rgba(0,0,0,0.6)]">
              <img src={active.img} alt={active.title} className="max-h-[78vh] w-full object-cover" />
              <div className="border-t border-white/10 px-6 py-5 md:px-8">
                <div className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">{active.category}</div>
                <div className="mt-2 text-3xl font-black uppercase tracking-[0.08em]">{active.title}</div>
                <div className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">{active.subtitle}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
