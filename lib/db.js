import mysql from 'mysql2/promise';

let pool;

function redactUrlForLog(url) {
  try {
    const u = new URL(url);
    if (u.password) u.password = '***';
    if (u.username) u.username = '***';
    return u.toString();
  } catch {
    return 'INVALID_DATABASE_URL';
  }
}

export function getDb() {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not set');
    }

    const url = new URL(databaseUrl);

    // Aiven thường đưa ssl-mode=REQUIRED, còn mysql2 không hiểu option này.
    // Ngoài ra mysql2 cũng không tự biến ?ssl=true thành object SSL khi mình tự parse URL,
    // nên phải đọc tất cả query SSL và ép cấu hình SSL tại đây.
    const sslMode = url.searchParams.get('ssl-mode') || url.searchParams.get('sslmode');
    const sslParam = url.searchParams.get('ssl');
    const sslCa = process.env.MYSQL_SSL_CA;

    const shouldUseSsl =
      Boolean(sslMode) ||
      sslParam === 'true' ||
      sslParam === '1' ||
      process.env.MYSQL_SSL === 'true' ||
      url.hostname.includes('aivencloud.com');

    url.searchParams.delete('ssl-mode');
    url.searchParams.delete('sslmode');
    url.searchParams.delete('ssl');

    const ssl = shouldUseSsl
      ? sslCa
        ? { ca: sslCa, rejectUnauthorized: true }
        : { rejectUnauthorized: false }
      : undefined;

    console.log('[db] creating mysql pool', {
      url: redactUrlForLog(databaseUrl),
      host: url.hostname,
      port: Number(url.port || 3306),
      database: url.pathname.replace(/^\//, '') || 'defaultdb',
      ssl: Boolean(ssl),
      sslMode: sslMode || null,
      sslParam: sslParam || null,
      hasSslCa: Boolean(sslCa)
    });

    pool = mysql.createPool({
      host: url.hostname,
      port: Number(url.port || 3306),
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace(/^\//, '') || 'defaultdb',
      waitForConnections: true,
      connectionLimit: 3,
      maxIdle: 1,
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
