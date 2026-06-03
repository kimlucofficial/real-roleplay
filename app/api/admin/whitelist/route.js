import { getServerSession } from 'next-auth';
import { authOptions, isAdminSession } from '@/lib/auth';
import { getDb } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!(await isAdminSession(session))) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const db = getDb();
    const [rows] = await db.query(
      `SELECT id, discord_id, discord_username, full_name, age, rp_experience, online_time, source, short_description, backstory, why_join, status, staff_note, created_at, updated_at
       FROM whitelist_applications
       ORDER BY created_at DESC
       LIMIT 300`
    );
    return Response.json({ rows });
  } catch (err) {
    console.error('[admin whitelist] load failed', { message: err?.message, code: err?.code });
    return Response.json({ error: 'Không tải được whitelist dashboard.' }, { status: 500 });
  }
}
