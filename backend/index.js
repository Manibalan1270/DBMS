require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('Set JWT_SECRET in backend/.env (see .env.example)');
  process.exit(1);
}

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'user_system',
});

// ---- helpers ----
const isEmail = (v) => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// Reads "Authorization: Bearer <token>" and sets req.user = { id, role }.
function requireLogin(req, res, next) {
  const header = req.headers.authorization || '';
  try {
    req.user = jwt.verify(header.replace(/^Bearer /, ''), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Please log in' });
  }
}
function requireAdmin(req, res, next) {
  requireLogin(req, res, () => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
    next();
  });
}

// ---- public routes ----
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !isEmail(email) || !password || password.length < 6) {
    return res.status(400).json({ message: 'Name, a valid email and a password of 6+ characters are required' });
  }
  const hash = bcrypt.hashSync(password, 10);
  db.query('INSERT INTO users(name,email,password,role) VALUES(?,?,?,?)', [name, email, hash, 'user'], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Email exists' });
      console.error(err);
      return res.status(500).json({ message: 'DB error' });
    }
    res.json({ message: 'Registration successful' });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email=?', [email], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'DB error' });
    }
    // Same message for "no such email" and "wrong password", so the form
    // doesn't reveal which emails are registered.
    if (result.length === 0 || !bcrypt.compareSync(password || '', result[0].password)) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const u = result[0];
    const token = jwt.sign({ id: u.id, role: u.role }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ message: 'Login success', token, user: { id: u.id, name: u.name, email: u.email, role: u.role } });
  });
});

// Changing a password needs the current password.
app.put('/reset-password', (req, res) => {
  const { email, currentPassword, password } = req.body;
  if (!password || password.length < 6) return res.status(400).json({ message: 'New password must be 6+ characters' });
  db.query('SELECT * FROM users WHERE email=?', [email], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (result.length === 0 || !bcrypt.compareSync(currentPassword || '', result[0].password)) {
      return res.status(400).json({ message: 'Email or current password is wrong' });
    }
    db.query('UPDATE users SET password=? WHERE id=?', [bcrypt.hashSync(password, 10), result[0].id], (err2) => {
      if (err2) return res.status(500).json({ message: 'DB error' });
      res.json({ message: 'Password updated' });
    });
  });
});

// ---- logged-in user ----
app.get('/user/:id', requireLogin, (req, res) => {
  if (String(req.user.id) !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'You can only view your own profile' });
  }
  db.query('SELECT id,name,email,role FROM users WHERE id=?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!result[0]) return res.status(404).json({ message: 'User not found' });
    res.json(result[0]);
  });
});

// ---- admin only ----
app.get('/admin/users', requireAdmin, (req, res) => {
  db.query('SELECT id,name,email,role FROM users', (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(result);
  });
});
app.get('/admin/user/:id', requireAdmin, (req, res) => {
  db.query('SELECT id,name,email,role FROM users WHERE id=?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!result[0]) return res.status(404).json({ message: 'User not found' });
    res.json(result[0]);
  });
});
app.put('/admin/edit/:id', requireAdmin, (req, res) => {
  const { name, email } = req.body;
  if (!name || !isEmail(email)) return res.status(400).json({ message: 'Name and a valid email are required' });
  db.query('UPDATE users SET name=?,email=? WHERE id=?', [name, email, req.params.id], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Email exists' });
      return res.status(500).json({ message: 'DB error' });
    }
    res.json({ message: 'Updated' });
  });
});
app.delete('/admin/delete/:id', requireAdmin, (req, res) => {
  db.query('DELETE FROM users WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json({ message: 'Deleted' });
  });
});

const PORT = process.env.PORT || 5000;
if (require.main === module) app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
module.exports = app;
