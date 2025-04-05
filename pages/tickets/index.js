import { useEffect, useState } from 'react';
import { db } from '@/utils/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function TicketsListPage() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const load = async () => {
      const snapshot = await getDocs(collection(db, 'tickets'));
      const data = snapshot.docs.map(doc => doc.data());
      setTickets(data);
    };
    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Transcrições disponíveis</h1>
      {tickets.length === 0 ? (
        <p>Não há tickets no momento.</p>
      ) : (
        <ul>
          {tickets.map(ticket => (
            <li key={ticket.ticketId}>
              <a href={`/tickets/${ticket.ticketId}`}>Ticket #{ticket.ticketId}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}