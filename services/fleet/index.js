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
app.get(['/health', '/api/fleet/health'], async (req, res) => {
  try {
    await pool.query('SELECT 1');
    await redis.ping();
    res.json({ service: 'fleet-service', status: 'healthy' });
  } catch (err) {
    res.status(503).json({ service: 'fleet-service', status: 'unhealthy',
                            error: err.message });
  }
});
// Пошук вільних авто: ?fuel=electric&lat=50.45&lng=30.52&radius=2000 (метри)
app.get('/api/fleet/cars', async (req, res) => {
  const { fuel, lat, lng, radius } = req.query;
  const key = `cars:${fuel || ''}:${lat || ''}:${lng || ''}:${radius || ''}`;
  try {
    const cached = await redis.get(key);
    if (cached) return res.set('X-Cache', 'HIT').json(JSON.parse(cached));
    const params = [];
    let where = "status = 'available'";
    if (fuel) {
      params.push(fuel);
      where += ` AND fuel_type = $${params.length}`;
    }
    if (lat && lng && radius) {
      params.push(lng, lat, radius);
      const n = params.length;
      where += ` AND ST_DWithin(location,
        ST_SetSRID(ST_MakePoint($${n - 2}, $${n - 1}), 4326)::geography, $${n})`;
    }
    const result = await pool.query(
      `SELECT id, brand, model, fuel_type, price_per_day, status,
              ST_Y(location::geometry) AS lat, ST_X(location::geometry) AS lng
       FROM fleet.cars WHERE ${where} ORDER BY id`,
      params
    );
    await redis.set(key, JSON.stringify(result.rows), { EX: 30 });
    res.set('X-Cache', 'MISS').json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const PORT = process.env.PORT || 3002;
redis.connect().then(() => {
  app.listen(PORT, () => console.log(`fleet-service listening on port ${PORT}`));
});
