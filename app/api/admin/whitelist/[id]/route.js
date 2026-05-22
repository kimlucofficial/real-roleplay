import { getServerSession } from 'next-auth';
import { authOptions, isAdminDiscordId } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.discordId || !isAdminDiscordId(session.user.discordId)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { status } = await req.json();
  if (!['pending','review','approved','rejected'].includes(status)) {
    return Response.json({ error: 'Invalid status' }, { status: 400 });
  }

  const db = getDb();
  await db.query('UPDATE whitelist_applications SET status = ? WHERE id = ?', [status, params.id]);
  return Response.json({ success: true });
}
