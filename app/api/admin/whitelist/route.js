import { getServerSession } from 'next-auth';
import { authOptions, isAdminDiscordId } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.discordId || !isAdminDiscordId(session.user.discordId)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const db = getDb();
  const [rows] = await db.query('SELECT * FROM whitelist_applications ORDER BY created_at DESC');
  return Response.json({ rows });
}
