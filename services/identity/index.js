const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());
const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_NAME || 'carsharing'
});
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
app.get(['/health', '/api/identity/health'], async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ service: 'identity-service', status: 'healthy' });
  } catch (err) {
    res.status(503).json({ service: 'identity-service', status: 'unhealthy',
                            error: err.message });
  }
});
app.post('/api/identity/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO identity.users (email, password_hash)
       VALUES ($1, $2) RETURNING id, email, role`,
      [email, hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/identity/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT id, email, role, password_hash FROM identity.users WHERE email = $1',
      [email]
    );
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password || '', user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET,
                           { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`identity-service listening on port ${PORT}`));
