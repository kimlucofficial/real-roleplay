import { testDbConnection } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const startedAt = Date.now();
  try {
    const ok = await testDbConnection();
    return Response.json({ ok, ms: Date.now() - startedAt });
  } catch (err) {
    console.error('[debug db] failed', {
      message: err?.message,
      code: err?.code,
      errno: err?.errno,
      sqlState: err?.sqlState,
      sqlMessage: err?.sqlMessage,
      stack: err?.stack
    });

    return Response.json({
      ok: false,
      ms: Date.now() - startedAt,
      error: {
        message: err?.message,
        code: err?.code,
        errno: err?.errno,
        sqlState: err?.sqlState,
        sqlMessage: err?.sqlMessage
      }
    }, { status: 500 });
  }
}
