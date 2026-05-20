import { InteractionResponseType, InteractionType, verifyKey } from 'discord-interactions';
import { getDb } from '@/lib/db';

export async function POST(req) {
  const signature = req.headers.get('x-signature-ed25519');
  const timestamp = req.headers.get('x-signature-timestamp');
  const rawBody = await req.text();

  const isValid = verifyKey(rawBody, signature, timestamp, process.env.DISCORD_PUBLIC_KEY);
  if (!isValid) {
    return new Response('Bad request signature', { status: 401 });
  }

  const interaction = JSON.parse(rawBody);

  if (interaction.type === InteractionType.PING) {
    return Response.json({ type: InteractionResponseType.PONG });
  }

  if (interaction.type === InteractionType.MESSAGE_COMPONENT) {
    const [action, id] = interaction.data.custom_id.split(':');
    const map = { approve: 'approved', review: 'review', reject: 'rejected' };
    const nextStatus = map[action];

    if (nextStatus) {
      const db = getDb();
      await db.query('UPDATE whitelist_applications SET status = ? WHERE id = ?', [nextStatus, Number(id)]);

      return Response.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Application #${id} updated to **${nextStatus.toUpperCase()}**.`,
          flags: 64
        }
      });
    }
  }

  return Response.json({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: { content: 'Unsupported interaction.', flags: 64 }
  });
}
