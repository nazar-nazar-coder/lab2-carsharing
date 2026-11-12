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
app.get(['/health', '/api/bookings/health'], async (req, res) => {
  try {
    await pool.query('SELECT 1');
    await redis.ping();
    res.json({ service: 'booking-service', status: 'healthy' });
  } catch (err) {
    res.status(503).json({ service: 'booking-service', status: 'unhealthy',
                            error: err.message });
  }
});
app.get('/api/bookings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM booking.bookings ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Створення бронювання: тимчасове блокування в Redis + обмеження в БД
app.post('/api/bookings', async (req, res) => {
  const { car_id, user_id, start_at, end_at } = req.body;
  if (!car_id || !user_id || !start_at || !end_at) {
    return res.status(400).json(
      { error: 'car_id, user_id, start_at, end_at are required' });
  }
  const lockKey = `lock:car:${car_id}`;
  const locked = await redis.set(lockKey, '1', { NX: true, EX: 30 });
  if (!locked) {
    return res.status(409).json({ error: 'Car is being booked by another user' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO booking.bookings (car_id, user_id, start_at, end_at)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [car_id, user_id, start_at, end_at]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    // 23P01 – порушення EXCLUDE-обмеження (перетин періодів)
    if (err.code === '23P01') {
      return res.status(409).json(
        { error: 'Car is already booked for this period' });
    }
    res.status(500).json({ error: err.message });
  } finally {
    await redis.del(lockKey);
  }
});
const PORT = process.env.PORT || 3003;
redis.connect().then(() => {
  app.listen(PORT, () => console.log(`booking-service listening on port ${PORT}`));
});
