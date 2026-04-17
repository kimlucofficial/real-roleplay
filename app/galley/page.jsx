import Image from "next/image";
const images = [
  "https://media.discordapp.net/attachments/1488117722658373743/1494671563553902592/3.png?ex=69e374de&is=69e2235e&hm=b136731f384808747836468c821950be41c5080a37ff7fdf0bebd5181e72af5a&=&format=webp&quality=lossless&width=1286&height=1286",
    "https://media.discordapp.net/attachments/1488117722658373743/1494671563906351206/4.png?ex=69e374de&is=69e2235e&hm=9cbc7bf9045b4aa94c40180e07eb5cd80d1f4ae6755592fbd778163eeb37b417&=&format=webp&quality=lossless&width=1286&height=1286",
    "https://media.discordapp.net/attachments/1488117722658373743/1494671564266930258/5.png?ex=69e374de&is=69e2235e&hm=a25d1e3eb8d83fa94a0dcf9690874b764e4a6957f33e054398b47014df81c4e1&=&format=webp&quality=lossless&width=1286&height=1286",
    "https://media.discordapp.net/attachments/1488117722658373743/1494671564648743033/6.png?ex=69e374de&is=69e2235e&hm=59c0b84d137c41647b4ce42ff7220043825636091cc20326de7333b8727e8326&=&format=webp&quality=lossless&width=1286&height=1286",
    "https://media.discordapp.net/attachments/1488117722658373743/1494671564971573358/7.png?ex=69e374de&is=69e2235e&hm=5821426c558acffc20ef95791a87832ca6fb436a62a8ceac8eae6872874fae4c&=&format=webp&quality=lossless&width=1286&height=1286",
    "https://media.discordapp.net/attachments/1488117722658373743/1494671565311316151/8.png?ex=69e374de&is=69e2235e&hm=b0c3335748c56dff0d1b8ad9b62b72f5e0cb20d440be9366a36f909f2cbce52e&=&format=webp&quality=lossless&width=1286&height=1286"
];

export default function GalleryPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
  {images.map((src, i) => (
    <div
      key={i}
      className="relative overflow-hidden rounded-2xl group border border-white/10"
    >
      <Image
        src={src}
        alt="gallery"
        width={1200}
        height={800}
        className="w-full h-[300px] object-cover transition duration-500 group-hover:scale-110"
      />

      {/* overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition" />

      {/* text */}
      <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition">
        <p className="text-sm text-white/80">Real Roleplay</p>
        <h3 className="text-lg font-bold">City Life #{i + 1}</h3>
      </div>
    </div>
  ))}
</div>
  );
}