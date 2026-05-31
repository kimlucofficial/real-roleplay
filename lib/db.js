import mysql from 'mysql2/promise';

let pool;

function redactUrlForLog(value) {
  try {
    const u = new URL(value);
    if (u.password) u.password = '***';
    if (u.username) u.username = '***';
    return u.toString();
  } catch {
    return 'INVALID_DATABASE_URL';
  }
}

function buildUrlFromRailwayVars() {
  const host = process.env.MYSQLHOST;
  const port = process.env.MYSQLPORT || '3306';
  const user = process.env.MYSQLUSER;
  const password = process.env.MYSQLPASSWORD;
  const database = process.env.MYSQLDATABASE;

  if (!host || !user || !database) return null;

  return `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password || '')}@${host}:${port}/${database}`;
}

function getDatabaseUrl() {
  // Railway MySQL exposes MYSQL_URL by default. Keep DATABASE_URL support too,
  // so the same source also works if you manually map Railway's MYSQL_URL to DATABASE_URL.
  return (
    process.env.MYSQL_URL ||
    process.env.MYSQL_PUBLIC_URL ||
    process.env.DATABASE_URL ||
    buildUrlFromRailwayVars()
  );
}

function shouldUseSslForUrl(url) {
  const sslMode = url.searchParams.get('ssl-mode') || url.searchParams.get('sslmode');
  const sslParam = url.searchParams.get('ssl');

  return (
    process.env.MYSQL_SSL === 'true' ||
    sslParam === 'true' ||
    sslParam === '1' ||
    Boolean(sslMode && sslMode.toLowerCase() !== 'disabled')
  );
}

export function getDb() {
  if (!pool) {
    const databaseUrl = getDatabaseUrl();

    if (!databaseUrl) {
      throw new Error('Railway MySQL env is missing. Set MYSQL_URL, MYSQL_PUBLIC_URL, DATABASE_URL, or MYSQLHOST/MYSQLPORT/MYSQLUSER/MYSQLPASSWORD/MYSQLDATABASE.');
    }

    const url = new URL(databaseUrl);
    const sslCa = process.env.MYSQL_SSL_CA;
    const ssl = shouldUseSslForUrl(url)
      ? sslCa
        ? { ca: sslCa, rejectUnauthorized: true }
        : { rejectUnauthorized: false }
      : undefined;

    url.searchParams.delete('ssl-mode');
    url.searchParams.delete('sslmode');
    url.searchParams.delete('ssl');

    console.log('[db] creating railway mysql pool', {
      url: redactUrlForLog(databaseUrl),
      host: url.hostname,
      port: Number(url.port || 3306),
      database: url.pathname.replace(/^\//, '') || 'railway',
      ssl: Boolean(ssl),
      source: process.env.MYSQL_URL ? 'MYSQL_URL' : process.env.MYSQL_PUBLIC_URL ? 'MYSQL_PUBLIC_URL' : process.env.DATABASE_URL ? 'DATABASE_URL' : 'MYSQLHOST_*'
    });

    pool = mysql.createPool({
      host: url.hostname,
      port: Number(url.port || 3306),
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace(/^\//, '') || 'railway',
      waitForConnections: true,
      connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT || 5),
      maxIdle: Number(process.env.MYSQL_MAX_IDLE || 2),
      idleTimeout: 30000,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      connectTimeout: 20000,
      ssl
    });
  }

  return pool;
}

export async function testDbConnection() {
  const db = getDb();
  const [rows] = await db.query('SELECT 1 AS ok');
  return rows?.[0]?.ok === 1;
}
