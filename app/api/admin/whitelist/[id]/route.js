import { getServerSession } from 'next-auth';
import { authOptions, isAdminDiscordId } from '@/lib/auth';
import { getDb } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.discordId || !isAdminDiscordId(session.user.discordId)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const id = Number(params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return Response.json({ error: 'Invalid whitelist id' }, { status: 400 });
    }

    const { status } = await req.json().catch(() => ({}));
    if (!['pending', 'review', 'approved', 'rejected'].includes(status)) {
      return Response.json({ error: 'Invalid status' }, { status: 400 });
    }

    const db = getDb();
    const [result] = await db.query('UPDATE whitelist_applications SET status = ? WHERE id = ?', [status, id]);
    if (!result?.affectedRows) {
      return Response.json({ error: 'Không tìm thấy đơn whitelist.' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('[admin whitelist] update failed', { message: err?.message, code: err?.code });
    return Response.json({ error: 'Không cập nhật được trạng thái whitelist.' }, { status: 500 });
  }
}
