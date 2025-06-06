import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '8tobtm2z',
  dataset: 'production',
  apiVersion: '2023-01-01',
  token: process.env.SANITY_WRITE_TOKEN, // Set this in Vercel dashboard!
  useCdn: false,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { userId, stage, subject, date, score } = req.body;
  if (!userId || !stage || !subject || !date || typeof score !== 'number') {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const result = await client.create({
      _type: 'userStat',
      userId,
      stage,
      subject,
      date,
      score,
    });
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
