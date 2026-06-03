import { getServerSession } from 'next-auth';
import { authOptions, isAdminSession } from '@/lib/auth';
import { getDb } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!(await isAdminSession(session))) {
    return Response.json({ ok: false, error: 'Forbidden' }, { status: 403 });
  }

  const result = {
    ok: false,
    env: {
      mysqlUrlSet: Boolean(process.env.MYSQL_URL),
      mysqlPublicUrlSet: Boolean(process.env.MYSQL_PUBLIC_URL),
      databaseUrlSet: Boolean(process.env.DATABASE_URL),
      mysqlHostSet: Boolean(process.env.MYSQLHOST),
      mysqlDatabaseSet: Boolean(process.env.MYSQLDATABASE)
    },
    checks: {}
  };

  try {
    const db = getDb();
    const [pingRows] = await db.query('SELECT 1 AS ok');
    result.checks.ping = pingRows?.[0]?.ok === 1;

    const [tables] = await db.query("SHOW TABLES LIKE 'whitelist_applications'");
    result.checks.whitelistApplicationsTableExists = tables.length > 0;

    if (!tables.length) {
      const [allTables] = await db.query('SHOW TABLES');
      result.availableTables = allTables.map((row) => Object.values(row)[0]);
      result.reason = 'MISSING_TABLE_whitelist_applications';
      return Response.json(result, { status: 500 });
    }

    const [columns] = await db.query('SHOW COLUMNS FROM whitelist_applications');
    result.columns = columns.map((c) => c.Field);

    const [counts] = await db.query(`SELECT status, COUNT(*) AS count FROM whitelist_applications GROUP BY status`);
    result.counts = counts;

    const [sample] = await db.query(`SELECT id, discord_id, discord_username, status, created_at FROM whitelist_applications ORDER BY created_at DESC LIMIT 5`);
    result.sample = sample;

    result.ok = true;
    result.reason = 'OK';
    return Response.json(result);
  } catch (err) {
    console.error('[debug whitelist] failed', {
      message: err?.message,
      code: err?.code,
      errno: err?.errno,
      sqlState: err?.sqlState
    });

    return Response.json({
      ...result,
      reason: 'QUERY_FAILED',
      error: {
        message: err?.message || 'Unknown database error',
        code: err?.code || 'UNKNOWN',
        errno: err?.errno || null,
        sqlState: err?.sqlState || null
      }
    }, { status: 500 });
  }
}
