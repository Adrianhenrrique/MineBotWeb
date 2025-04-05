// --- /pages/tickets/index.js ---
import { useEffect, useState } from 'react';
import { db } from '@/utils/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function TicketsList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      const querySnapshot = await getDocs(collection(db, 'tickets'));
      const results = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Ignora tickets expirados
        if (!data.expiresAt || new Date(data.expiresAt) > new Date()) {
          results.push(data);
        }
      });
      setTickets(results);
      setLoading(false);
    };

    fetchTickets();
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Transcrições disponíveis</h1>
      {tickets.length === 0 ? (
        <p>Nenhuma transcrição disponível no momento.</p>
      ) : (
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket.ticketId}>
              <a href={`/tickets/${ticket.ticketId}`}>
                {ticket.ticketId} - {new Date(ticket.createdAt).toLocaleString()}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
