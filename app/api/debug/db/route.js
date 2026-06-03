import { getServerSession } from 'next-auth';
import { authOptions, isAdminSession } from '@/lib/auth';
import { testDbConnection } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!(await isAdminSession(session))) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const startedAt = Date.now();
  try {
    const ok = await testDbConnection();
    return Response.json({ ok, ms: Date.now() - startedAt });
  } catch (err) {
    console.error('[debug db] failed', {
      message: err?.message,
      code: err?.code,
      errno: err?.errno,
      sqlState: err?.sqlState
    });

    return Response.json({
      ok: false,
      ms: Date.now() - startedAt,
      error: {
        message: err?.message || 'Database healthcheck failed',
        code: err?.code || 'UNKNOWN',
        errno: err?.errno || null,
        sqlState: err?.sqlState || null
      }
    }, { status: 500 });
  }
}
