import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { sendWhitelistEmbed } from '@/lib/discord';

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
