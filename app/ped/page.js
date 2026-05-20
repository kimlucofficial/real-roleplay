<<<<<<< HEAD
import { redirect } from 'next/navigation';

export default function PedPage() {
  redirect('/');
=======
import SiteApp from '@/components/SiteApp';

export default function Page() {
  return <SiteApp discordUrl={process.env.NEXT_PUBLIC_DISCORD_URL || 'https://discord.gg/XMkdPVZcuV'} initialPage='ped' />;
>>>>>>> 2561dc3f06c7c40e77a2d2b74a02da3a9c9462b8
}
