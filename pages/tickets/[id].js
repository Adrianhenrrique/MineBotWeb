import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { db } from '@/utils/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function TicketPage() {
  const { query } = useRouter();
  const [html, setHtml] = useState(null);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');
  const [requirePassword, setRequirePassword] = useState(false);
  const [ticketData, setTicketData] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!query.id) return;
      const docRef = doc(db, 'tickets', query.id);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        setError('Transcrição não encontrada');
        return;
      }

      const data = snapshot.data();
      setTicketData(data);

      if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
        setError('Esta transcrição expirou.');
        return;
      }

      if (data.password) {
        setRequirePassword(true);
      } else {
        const res = await fetch(data.url);
        const text = await res.text();
        setHtml(text);
      }
    };

    load();
  }, [query.id]);

  const handleSubmitPassword = async () => {
    if (password === ticketData.password) {
      const res = await fetch(ticketData.url);
      const text = await res.text();
      setHtml(text);
      setRequirePassword(false);
    } else {
      setError('Senha incorreta');
    }
  };

  if (error) return <h1>{error}</h1>;
  if (requirePassword) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Insira a senha para acessar a transcrição</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSubmitPassword}>Acessar</button>
      </div>
    );
  }

  return (
    <div>
      {html && (
        <>
          <div dangerouslySetInnerHTML={{ __html: html }} />
          <a
            href={ticketData?.url || '#'}
            download={`transcricao-${query.id}.html`}
            style={{ display: 'block', marginTop: 20 }}
          >
            📥 Baixar transcrição
          </a>
        </>
      )}
    </div>
  );
}