const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // coloca sua senha aqui
  database: 'geniosports'
});

async function initDB() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      role VARCHAR(50) DEFAULT 'user'
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      price DECIMAL(10,2)
    )
  `);
}

initDB();

app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Preencha tudo' });
    }

    const hash = await bcrypt.hash(password, 10);

    await db.execute(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hash]
    );

    res.json({ ok: true });

  } catch (err) {
    res.status(400).json({ error: 'Usuário já existe' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    const user = rows[0];

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(400).json({ error: 'Senha inválida' });
    }

    res.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

async function isAdmin(req, res, next) {
  const { email } = req.headers;

  const [rows] = await db.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );

  const user = rows[0];

  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  next();
}

app.get('/api/products', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM products');
  res.json(rows);
});

app.post('/api/products', isAdmin, async (req, res) => {
  const { name, price } = req.body;

  await db.execute(
    'INSERT INTO products (name, price) VALUES (?, ?)',
    [name, price]
  );

  res.json({ ok: true });
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});