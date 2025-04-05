import { db, storage } from '../../utils/firebase';
import { ref, uploadString } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { ticketId, html } = req.body;
  if (!ticketId || !html) return res.status(400).json({ error: 'Missing data' });

  try {
    const fileRef = ref(storage, `tickets/${ticketId}.html`);
    await uploadString(fileRef, html, 'raw');
    const url = `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_STORAGE_BUCKET}/o/tickets%2F${ticketId}.html?alt=media`;

    await setDoc(doc(db, 'tickets', ticketId), {
      ticketId,
      createdAt: new Date().toISOString(),
      url,
    });

    return res.status(200).json({ url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Upload failed' });
  }
}