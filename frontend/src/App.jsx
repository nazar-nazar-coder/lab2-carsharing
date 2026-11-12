import { useEffect, useState } from 'react';
const SERVICES = ['identity', 'fleet', 'bookings', 'payments'];
export default function App() {
  const [status, setStatus] = useState({});
  const [cars, setCars] = useState([]);
  const [message, setMessage] = useState('');
  useEffect(() => {
    SERVICES.forEach(async (s) => {
      try {
        const r = await fetch(`/api/${s}/health`);
        const d = await r.json();
        setStatus((prev) => ({ ...prev, [s]: d.status }));
      } catch {
        setStatus((prev) => ({ ...prev, [s]: 'unreachable' }));
      }
    });
    loadCars();
  }, []);
  async function loadCars() {
    const r = await fetch('/api/fleet/cars');
    setCars(await r.json());
  }
  async function book(carId) {
    const start = new Date(Date.now() + 3600 * 1000);
    const end = new Date(start.getTime() + 24 * 3600 * 1000);
    const r = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        car_id: carId, user_id: 1,
        start_at: start.toISOString(), end_at: end.toISOString()
      })
    });
    const d = await r.json();
    setMessage(r.ok
      ? `Бронювання #${d.id} створено`
      : `Помилка ${r.status}: ${d.error}`);
  }
  return (
    <div style={{ fontFamily: 'Arial', maxWidth: 700, margin: '40px auto' }}>
      <h1>CarSharing</h1>
      <h3>Стан сервісів</h3>
      <ul>
        {SERVICES.map((s) => (
          <li key={s}>{s}: <b>{status[s] || '...'}</b></li>
        ))}
      </ul>
      <h3>Вільні автомобілі</h3>
      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>Авто</th><th>Пальне</th><th>Ціна/доба</th><th></th></tr>
        </thead>
        <tbody>
          {cars.map((c) => (
            <tr key={c.id}>
              <td>{c.brand} {c.model}</td>
              <td>{c.fuel_type}</td>
              <td>{c.price_per_day} грн</td>
              <td><button onClick={() => book(c.id)}>Забронювати</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>{message}</p>
    </div>
  );
}
