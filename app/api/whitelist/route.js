import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { sendWhitelistEmbed } from '@/lib/discord';

function countWords(text = '') {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function validateWordRange(text, minWords = 300) {
  const words = countWords(text);
  return words >= minWords && words <= 2000;
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.discordId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const required = ['full_name','age','rp_experience','online_time','source','short_description','backstory','why_join'];
    for (const field of required) {
      if (!body[field]) return Response.json({ error: `Missing field: ${field}` }, { status: 400 });
    }

    if (!/^[\p{L}\s]+$/u.test(String(body.full_name || '').trim())) {
      return Response.json({ error: 'Họ và tên chỉ được ghi chữ, có thể dùng dấu tiếng Việt, không dùng số/ký tự đặc biệt.' }, { status: 400 });
    }

    if (!/^[\p{L}\s]+$/u.test(String(body.rp_experience || '').trim())) {
      return Response.json({ error: 'Giới tính chỉ được ghi bằng chữ, không dùng số/ký tự đặc biệt.' }, { status: 400 });
    }

    if (!/^[\p{L}\s]+$/u.test(String(body.online_time || '').trim())) {
      return Response.json({ error: 'Khung giờ online chỉ được ghi bằng chữ, không dùng số/ký tự đặc biệt.' }, { status: 400 });
    }

    if (!/^\d+$/.test(String(body.age)) || Number(body.age) < 16) {
      return Response.json({ error: 'Tuổi phải là số hợp lệ và từ 16 trở lên.' }, { status: 400 });
    }

   if (!validateWordRange(body.backstory)) {
  return Response.json({ error: 'Tiểu sử nhân vật phải từ 300 đến 2000 chữ.' }, { status: 400 });
}

    const characterName = String(body.short_description || '').trim();
    if (!/^[a-zA-Z\s]+$/.test(characterName)) {
      return Response.json({ error: 'Tên nhân vật chỉ được dùng chữ không dấu và không dùng số/ký tự đặc biệt.' }, { status: 400 });
    }

    if (!/^\S+\s+\S+/.test(characterName)) {
      return Response.json({ error: 'Tên nhân vật phải bao gồm Họ và Tên rõ ràng.' }, { status: 400 });
    }

    const db = getDb();
    const [result] = await db.query(
      `INSERT INTO whitelist_applications
      (discord_id, discord_username, full_name, age, rp_experience, online_time, source, short_description, backstory, why_join)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        session.user.discordId,
        session.user.username || session.user.name || 'discord-user',
        body.full_name,
        Number(body.age),
        body.rp_experience,
        body.online_time,
        body.source,
        body.short_description,
        body.backstory,
        body.why_join
      ]
    );

    const application = {
      id: result.insertId,
      discord_id: session.user.discordId,
      discord_username: session.user.username || session.user.name || 'discord-user',
      full_name: body.full_name,
      age: Number(body.age),
      rp_experience: body.rp_experience,
      online_time: body.online_time,
      source: body.source,
      short_description: body.short_description,
      backstory: body.backstory,
      why_join: body.why_join,
      status: 'pending'
    };

    try {
      await sendWhitelistEmbed(application);
    } catch (e) {
      console.error("Discord error:", e);
    }

    return Response.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}
