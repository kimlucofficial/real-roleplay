import SiteApp from '@/components/SiteApp';

export default function Page() {
  return <SiteApp discordUrl={process.env.NEXT_PUBLIC_DISCORD_URL || 'https://discord.gg/XMkdPVZcuV'} initialPage='rules-ic' />;
}
