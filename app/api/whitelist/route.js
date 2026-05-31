import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { sendWhitelistEmbed } from '@/lib/discord';
import { normalizeSpaces, validateWhitelistPayload } from '@/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function jsonError(error, status = 400, extra = {}) {
  return Response.json({ success: false, error, ...extra }, { status });
}

function safeError(label, err, extra = {}) {
  console.error(label, {
    message: err?.message,
    code: err?.code,
    errno: err?.errno,
    sqlState: err?.sqlState,
    sqlMessage: err?.sqlMessage,
    stack: err?.stack,
    ...extra
  });
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.discordId) {
      return jsonError('Bạn cần đăng nhập Discord trước khi nộp whitelist.', 401);
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return jsonError('Dữ liệu gửi lên không hợp lệ.', 400);
    }

    const validation = validateWhitelistPayload(body);
    if (!validation.ok) return jsonError(validation.error, 400);

    const data = validation.data;
    const discordUsername = normalizeSpaces(session.user.username || session.user.globalName || session.user.name || 'discord-user').slice(0, 120);
    const db = getDb();

    const [existing] = await db.query(
      `SELECT id, status, created_at
       FROM whitelist_applications
       WHERE discord_id = ? AND status IN ('pending', 'review')
       ORDER BY created_at DESC
       LIMIT 1`,
      [session.user.discordId]
    );

    if (existing?.[0]) {
      return jsonError(
        `Bạn đã có đơn whitelist #${existing[0].id} đang chờ duyệt (${existing[0].status}). Vui lòng chờ staff xử lý trước khi nộp lại.`,
        409,
        { existingId: existing[0].id, status: existing[0].status }
      );
    }

    const [result] = await db.query(
      `INSERT INTO whitelist_applications
      (discord_id, discord_username, full_name, age, rp_experience, online_time, source, short_description, backstory, why_join)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        session.user.discordId,
        discordUsername,
        data.full_name,
        data.age,
        data.rp_experience,
        data.online_time,
        data.source,
        data.short_description,
        data.backstory,
        data.why_join
      ]
    );

    const application = {
      id: result.insertId,
      discord_id: session.user.discordId,
      discord_username: discordUsername,
      ...data,
      status: 'pending'
    };

    let discordNotified = true;
    try {
      await sendWhitelistEmbed(application);
    } catch (err) {
      discordNotified = false;
      safeError('[whitelist] Discord notification failed but DB insert succeeded', err, { applicationId: result.insertId });
    }

    return Response.json({ success: true, id: result.insertId, discordNotified });
  } catch (error) {
    safeError('[whitelist] submit failed', error);

    if (error?.code === 'ER_DATA_TOO_LONG') {
      return jsonError('Một ô nhập đang vượt giới hạn. Vui lòng kiểm tra lại độ dài các thông tin.', 400);
    }

    if (['PROTOCOL_CONNECTION_LOST', 'ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNREFUSED'].includes(error?.code)) {
      return jsonError('Database đang mất kết nối hoặc timeout. Vui lòng báo staff kiểm tra.', 503);
    }

    return jsonError('Không thể gửi whitelist lúc này. Vui lòng báo staff kiểm tra.', 500);
  }
}
