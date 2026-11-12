const express = require('express');
const { Pool } = require('pg');
const { createClient } = require('redis');
const app = express();
app.use(express.json());
const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_NAME || 'carsharing'
});
const redis = createClient({
  url: `redis://${process.env.REDIS_HOST || 'redis'}:6379`
});
redis.on('error', (e) => console.error('Redis error:', e.message));
app.get(['/health', '/api/payments/health'], async (req, res) => {
  try {
    await pool.query('SELECT 1');
    await redis.ping();
    res.json({ service: 'payment-service', status: 'healthy' });
  } catch (err) {
    res.status(503).json({ service: 'payment-service', status: 'unhealthy',
                            error: err.message });
  }
});
app.get('/api/payments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM payment.payments ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Імітація оплати через платіжний шлюз (тестовий режим)
app.post('/api/payments', async (req, res) => {
  const { booking_id, amount } = req.body;
  if (!booking_id || !amount) {
    return res.status(400).json({ error: 'booking_id and amount are required' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO payment.payments (booking_id, amount)
       VALUES ($1, $2) RETURNING *`,
      [booking_id, amount]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const PORT = process.env.PORT || 3004;
redis.connect().then(() => {
  app.listen(PORT, () => console.log(`payment-service listening on port ${PORT}`));
});
