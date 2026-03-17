const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { initDb, run, get, all } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_DIR = path.join(__dirname, '..', '..', 'frontend');
const PRODUCT_UPLOADS_DIR = path.join(FRONTEND_DIR, 'uploads', 'products');
const TEAM_UPLOADS_DIR = path.join(FRONTEND_DIR, 'uploads', 'teams');
const SESSION_DURATION_DAYS = 30;
const RESET_TOKEN_DURATION_MINUTES = 30;
const ADMIN_EMAIL = normalizeEmail(process.env.ADMIN_EMAIL || '');
const ADMIN_PASSWORD = String(process.env.ADMIN_PASSWORD || '').trim();

const SMTP_HOST = String(process.env.SMTP_HOST || '').trim();
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = String(process.env.SMTP_SECURE || '').trim().toLowerCase() === 'true';
const SMTP_USER = String(process.env.SMTP_USER || '').trim();
const SMTP_PASS = String(process.env.SMTP_PASS || '').trim();
const SMTP_FROM = String(process.env.SMTP_FROM || SMTP_USER || '').trim();

let mailTransporter = null;

function emailTransportConfigured() {
  return Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && SMTP_FROM);
}

function getMailTransporter() {
  if (!emailTransportConfigured()) {
    return null;
  }

  if (!mailTransporter) {
    mailTransporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  return mailTransporter;
}

async function sendResetPasswordEmail({ to, name, code, expiresAt }) {
  const transporter = getMailTransporter();
  if (!transporter) {
    throw new Error('O envio de e-mail não está configurado no servidor.');
  }

  const expiryText = new Date(expiresAt).toLocaleString('pt-BR');
  await transporter.sendMail({
    from: SMTP_FROM,
    to,
    subject: 'Redefinição de senha - Gênio Sports',
    text: [
      `Olá, ${name || 'cliente'}!`,
      '',
      `Seu código para redefinir a senha é: ${code}`,
      `Esse código expira em: ${expiryText}`,
      '',
      'Se você não pediu a troca de senha, ignore este e-mail.'
    ].join('\n'),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
        <h2>Redefinição de senha - Gênio Sports</h2>
        <p>Olá, <strong>${String(name || 'cliente')}</strong>!</p>
        <p>Seu código para redefinir a senha é:</p>
        <p style="font-size:28px;font-weight:700;letter-spacing:4px;margin:16px 0">${code}</p>
        <p>Esse código expira em: <strong>${expiryText}</strong></p>
        <p>Se você não pediu a troca de senha, ignore este e-mail.</p>
      </div>
    `,
  });
}

app.use(cors());
app.use(express.json({ limit: '12mb' }));

function createSlug(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function parseJsonArray(value) {
  try {
    const parsed = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeBoolean(value) {
  return value ? 1 : 0;
}

function normalizeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeSizesInput(sizes) {
  if (!Array.isArray(sizes)) return [];
  return sizes
    .map((item) => ({
      size: String(item?.size || '').trim().toUpperCase(),
      stockQuantity: Number(item?.stockQuantity ?? 0),
    }))
    .filter((item) => item.size)
    .filter((item, index, arr) => arr.findIndex((other) => other.size === item.size) === index);
}

function normalizeStockEntriesInput(stockEntries, fallbackSizes = []) {
  const source = Array.isArray(stockEntries) && stockEntries.length
    ? stockEntries
    : normalizeSizesInput(fallbackSizes).map((item) => ({
        versionValue: '',
        versionLabel: null,
        size: item.size,
        stockQuantity: item.stockQuantity,
      }));

  const normalized = source
    .map((item) => {
      const versionLabelRaw = String(item?.versionLabel || '').trim();
      const versionValueRaw = String(item?.versionValue || item?.version || '').trim();
      const versionValue = versionLabelRaw ? createSlug(versionLabelRaw) : createSlug(versionValueRaw);
      return {
        versionValue: versionValue || '',
        versionLabel: versionLabelRaw || null,
        size: String(item?.size || '').trim().toUpperCase(),
        stockQuantity: Number(item?.stockQuantity ?? 0),
      };
    })
    .filter((item) => item.size)
    .filter((item) => Number.isInteger(item.stockQuantity) && item.stockQuantity >= 0);

  return normalized.filter((item, index, arr) => arr.findIndex((other) => other.versionValue === item.versionValue && other.size === item.size) === index);
}

function aggregateSizesFromStockEntries(stockEntries = []) {
  const map = new Map();
  stockEntries.forEach((item) => {
    const size = String(item?.size || '').trim().toUpperCase();
    if (!size) return;
    if (!map.has(size)) {
      map.set(size, { size, stockQuantity: 0 });
    }
    map.get(size).stockQuantity += Number(item?.stockQuantity || 0);
  });
  return [...map.values()];
}

function buildVersionOptionsFromStockEntries(stockEntries = []) {
  const options = [];
  const seen = new Set();
  stockEntries.forEach((item) => {
    const value = String(item?.versionValue || '').trim();
    if (!value || seen.has(value)) return;
    seen.add(value);
    options.push({
      value,
      label: String(item?.versionLabel || item?.versionValue || '').trim() || value,
    });
  });
  return options;
}

function normalizeSpecsInput(specs) {
  if (!Array.isArray(specs)) return [];
  return specs
    .map((item) => String(item || '').trim())
    .filter(Boolean)
    .filter((item, index, arr) => arr.indexOf(item) === index);
}

function normalizeOptionGroupsInput(optionGroups) {
  if (!Array.isArray(optionGroups)) return [];
  return optionGroups
    .map((group) => ({
      name: String(group?.name || '').trim(),
      type: String(group?.type || 'single').trim() || 'single',
      values: Array.isArray(group?.values)
        ? group.values
            .map((value) => ({
              value: String(value?.value || value?.label || '').trim(),
              label: String(value?.label || value?.value || '').trim(),
              priceAdjustment: Number(value?.priceAdjustment || 0),
            }))
            .filter((value) => value.value && value.label)
        : [],
    }))
    .filter((group) => group.name && group.values.length);
}

function normalizeCustomizationInput(customizations) {
  if (!Array.isArray(customizations)) return [];
  return customizations
    .map((item) => ({
      key: String(item?.key || item?.label || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-'),
      label: String(item?.label || item?.key || '').trim(),
      priceAdjustment: Number(item?.priceAdjustment || 0),
    }))
    .filter((item) => item.key && item.label)
    .filter((item, index, arr) => arr.findIndex((other) => other.key === item.key) === index);
}

function sanitizeUploadFileName(value) {
  const base = String(value || 'imagem')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .toLowerCase();

  return base || 'imagem';
}

function detectImageExtensionFromMime(mimeType) {
  const mime = String(mimeType || '').toLowerCase();
  if (mime === 'image/jpeg') return 'jpg';
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  if (mime === 'image/gif') return 'gif';
  if (mime === 'image/svg+xml') return 'svg';
  if (mime === 'image/avif') return 'avif';
  return '';
}

async function saveImageUpload(dataUrl, originalName = '', destinationDir, publicBasePath, fallbackName = 'imagem') {
  const match = String(dataUrl || '').match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    throw new Error('Formato de imagem inválido.');
  }

  const mimeType = match[1].toLowerCase();
  const base64Content = match[2];
  const extension = detectImageExtensionFromMime(mimeType);

  if (!extension) {
    throw new Error('Tipo de imagem não suportado.');
  }

  const buffer = Buffer.from(base64Content, 'base64');
  if (!buffer.length) {
    throw new Error('Arquivo de imagem vazio.');
  }
  if (buffer.length > 8 * 1024 * 1024) {
    throw new Error('A imagem deve ter no máximo 8 MB.');
  }

  const parsedName = path.parse(String(originalName || '').trim());
  const safeName = sanitizeUploadFileName(parsedName.name || fallbackName);
  const fileName = `${safeName}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${extension}`;

  await fs.mkdir(destinationDir, { recursive: true });
  await fs.writeFile(path.join(destinationDir, fileName), buffer);

  return `${publicBasePath}/${fileName}`;
}

async function saveProductImageUpload(dataUrl, originalName = '') {
  return saveImageUpload(dataUrl, originalName, PRODUCT_UPLOADS_DIR, '/uploads/products', 'produto');
}

async function saveTeamCrestUpload(dataUrl, originalName = '') {
  return saveImageUpload(dataUrl, originalName, TEAM_UPLOADS_DIR, '/uploads/teams', 'escudo');
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, originalHash] = String(storedHash || '').split(':');
  if (!salt || !originalHash) return false;
  const computedHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(originalHash, 'hex'), Buffer.from(computedHash, 'hex'));
}

function createSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

function buildSessionExpiryDate() {
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_DURATION_DAYS);
  return expires;
}

function buildResetExpiryDate() {
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + RESET_TOKEN_DURATION_MINUTES);
  return expires;
}

function createResetToken() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function syncAdminRoleByEmail() {
  if (!ADMIN_EMAIL) return;

  await run("UPDATE users SET role = CASE WHEN lower(email) = ? THEN 'admin' ELSE 'customer' END", [ADMIN_EMAIL]);
}

async function ensureConfiguredAdminAccount() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return;

  const existingAdmin = await get('SELECT id FROM users WHERE email = ?', [ADMIN_EMAIL]);
  const passwordHash = hashPassword(ADMIN_PASSWORD);

  if (existingAdmin) {
    await run(
      "UPDATE users SET role = 'admin', password_hash = ?, reset_token = NULL, reset_expires_at = NULL WHERE id = ?",
      [passwordHash, existingAdmin.id]
    );
    return;
  }

  await run(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')",
    ['Admin', ADMIN_EMAIL, passwordHash]
  );
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function sanitizeUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

async function buildUniqueProductId(baseId) {
  const normalizedBase = createSlug(baseId) || 'produto';
  let candidate = normalizedBase;
  let counter = 2;

  while (await get('SELECT id FROM products WHERE id = ?', [candidate])) {
    candidate = `${normalizedBase}-${counter}`;
    counter += 1;
  }

  return candidate;
}

async function fetchProductStockEntries(productId) {
  return all(
    `SELECT version_value AS versionValue, version_label AS versionLabel, size, stock_quantity AS stockQuantity
     FROM product_stock_variants
     WHERE product_id = ?
     ORDER BY CASE WHEN COALESCE(version_value, '') = '' THEN 0 ELSE 1 END,
              lower(COALESCE(version_label, version_value, '')),
              CASE
                WHEN size = 'PP' THEN 1
                WHEN size = 'P' THEN 2
                WHEN size = 'M' THEN 3
                WHEN size = 'G' THEN 4
                WHEN size = 'GG' THEN 5
                WHEN size = 'G2' THEN 6
                WHEN size = 'G3' THEN 7
                WHEN size = 'G4' THEN 8
                ELSE 99
              END, size`,
    [productId]
  );
}

async function fetchProductResponse(productId) {
  const product = await get(
    `SELECT p.id, p.type, p.team, p.category,
            COALESCE(NULLIF(TRIM(p.home_section), ''), t.home_section) AS homeSection,
            COALESCE(NULLIF(TRIM(p.crest_url), ''), t.crest_url) AS crestUrl,
            p.name, p.description, p.image_url AS imageUrl, p.base_price AS basePrice,
            p.price_label AS priceLabel, p.allow_customization AS allowCustomization,
            p.only_consultation AS onlyConsultation, p.specs_json AS specsJson,
            p.option_groups_json AS optionGroupsJson, p.customization_json AS customizationJson
     FROM products p
     LEFT JOIN teams t ON lower(t.name) = lower(p.team)
     WHERE p.id = ?`,
    [productId]
  );

  if (!product) return null;

  const stockEntries = normalizeStockEntriesInput(await fetchProductStockEntries(productId));
  const versionOptions = buildVersionOptionsFromStockEntries(stockEntries);
  const sizes = aggregateSizesFromStockEntries(stockEntries);

  return {
    ...product,
    sizes: sizes.map((row) => ({
      size: row.size,
      stockQuantity: Number(row.stockQuantity || 0),
      available: Number(row.stockQuantity || 0) > 0,
    })),
    stockEntries: stockEntries.map((row) => ({
      versionValue: row.versionValue || '',
      versionLabel: row.versionLabel || null,
      size: row.size,
      stockQuantity: Number(row.stockQuantity || 0),
      available: Number(row.stockQuantity || 0) > 0,
    })),
    versionOptions,
    stockMode: versionOptions.length ? 'versioned' : 'simple',
    allowCustomization: Boolean(product.allowCustomization),
    onlyConsultation: Boolean(product.onlyConsultation),
    specs: parseJsonArray(product.specsJson),
    optionGroups: parseJsonArray(product.optionGroupsJson),
    customizationOptions: parseJsonArray(product.customizationJson),
  };
}


async function fetchTeamRecord(teamName) {
  const name = String(teamName || '').trim();
  if (!name) return null;
  return get(
    `SELECT id, name, home_section AS homeSection, crest_url AS crestUrl, display_order AS displayOrder,
            created_at AS createdAt, updated_at AS updatedAt
     FROM teams
     WHERE lower(name) = lower(?)`,
    [name]
  );
}

async function upsertTeamRecord({ name, homeSection, crestUrl, displayOrder = null }) {
  const normalizedName = String(name || '').trim();
  if (!normalizedName) return null;

  const section = String(homeSection || '').trim() || null;
  const crest = String(crestUrl || '').trim() || null;
  const orderValue = Number.isInteger(Number(displayOrder)) ? Number(displayOrder) : null;
  const existing = await fetchTeamRecord(normalizedName);

  if (existing) {
    await run(
      `UPDATE teams
       SET home_section = ?, crest_url = ?, display_order = COALESCE(?, display_order), updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        section !== null ? section : existing.homeSection,
        crest !== null ? crest : existing.crestUrl,
        orderValue,
        existing.id,
      ]
    );
    return fetchTeamRecord(normalizedName);
  }

  await run(
    `INSERT INTO teams (name, home_section, crest_url, display_order, updated_at)
     VALUES (?, ?, ?, COALESCE(?, 0), CURRENT_TIMESTAMP)`,
    [normalizedName, section, crest, orderValue]
  );

  return fetchTeamRecord(normalizedName);
}

async function fetchAllTeams() {
  return all(
    `SELECT t.id, t.name, t.home_section AS homeSection, t.crest_url AS crestUrl, t.display_order AS displayOrder,
            t.created_at AS createdAt, t.updated_at AS updatedAt,
            COUNT(p.id) AS productCount
     FROM teams t
     LEFT JOIN products p ON lower(p.team) = lower(t.name)
     GROUP BY t.id
     ORDER BY
       CASE
         WHEN lower(COALESCE(t.home_section, '')) = lower('Times do Brasil') THEN 0
         WHEN lower(COALESCE(t.home_section, '')) = lower('Europa') THEN 1
         WHEN lower(COALESCE(t.home_section, '')) = lower('Seleções') THEN 2
         WHEN lower(COALESCE(t.home_section, '')) = lower('Outros times') THEN 3
         ELSE 4
       END,
       t.display_order ASC,
       lower(t.name) ASC`
  );
}

async function createSessionForUser(userId) {
  const token = createSessionToken();
  const expiresAt = buildSessionExpiryDate().toISOString();
  await run('INSERT INTO user_sessions (token, user_id, expires_at) VALUES (?, ?, ?)', [token, userId, expiresAt]);
  return token;
}

async function getAuthenticatedUserFromRequest(req) {
  const header = String(req.headers.authorization || '');
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  const token = match[1].trim();
  if (!token) return null;

  const session = await get(
    `SELECT s.token, s.expires_at AS expiresAt,
            u.id, u.name, u.email, u.role, u.created_at AS createdAt
     FROM user_sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token = ?`,
    [token]
  );

  if (!session) return null;

  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    await run('DELETE FROM user_sessions WHERE token = ?', [token]);
    return null;
  }

  return {
    token,
    user: sanitizeUser(session),
  };
}

async function authMiddleware(req, _res, next) {
  const auth = await getAuthenticatedUserFromRequest(req);
  req.auth = auth;
  req.user = auth?.user || null;
  next();
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Faça login para continuar.' });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Faça login para continuar.' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito ao admin.' });
  }
  next();
}

app.use(authMiddleware);

app.get('/api/health', async (_req, res) => {
  const info = await get('SELECT COUNT(*) AS totalProducts FROM products');
  res.json({ ok: true, totalProducts: Number(info?.totalProducts || 0) });
});

app.post('/api/auth/register', async (req, res) => {
  const name = String(req.body?.name || '').trim();
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || '');

  if (!name) {
    return res.status(400).json({ error: 'Informe seu nome.' });
  }
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Informe um e-mail válido.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'A senha precisa ter pelo menos 6 caracteres.' });
  }

  const existing = await get('SELECT id FROM users WHERE email = ?', [email]);
  if (existing) {
    return res.status(409).json({ error: 'Já existe uma conta com esse e-mail.' });
  }

  const role = ADMIN_EMAIL && email === ADMIN_EMAIL ? 'admin' : 'customer';
  const passwordHash = hashPassword(password);

  const inserted = await run(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, role]
  );

  const user = await get(
    'SELECT id, name, email, role, created_at AS createdAt FROM users WHERE id = ?',
    [inserted.id]
  );
  const token = await createSessionForUser(inserted.id);

  res.status(201).json({ ok: true, token, user: sanitizeUser(user) });
});

app.post('/api/auth/login', async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || '');

  if (!email || !password) {
    return res.status(400).json({ error: 'Informe e-mail e senha.' });
  }

  const user = await get(
    'SELECT id, name, email, password_hash AS passwordHash, role, created_at AS createdAt FROM users WHERE email = ?',
    [email]
  );

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
  }

  const token = await createSessionForUser(user.id);
  res.json({ ok: true, token, user: sanitizeUser(user) });
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  res.json({ ok: true, user: sanitizeUser(req.user) });
});

app.post('/api/auth/logout', requireAuth, async (req, res) => {
  await run('DELETE FROM user_sessions WHERE token = ?', [req.auth.token]);
  res.json({ ok: true });
});

app.post('/api/auth/forgot-password', async (req, res) => {
  const email = normalizeEmail(req.body?.email);

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Informe um e-mail válido.' });
  }

  if (!emailTransportConfigured()) {
    return res.status(500).json({ error: 'O envio de e-mail ainda não foi configurado no servidor.' });
  }

  const user = await get('SELECT id, name, email FROM users WHERE email = ?', [email]);
  if (user) {
    const resetToken = createResetToken();
    const expiresAt = buildResetExpiryDate().toISOString();
    await run('UPDATE users SET reset_token = ?, reset_expires_at = ? WHERE id = ?', [resetToken, expiresAt, user.id]);

    try {
      await sendResetPasswordEmail({
        to: user.email,
        name: user.name,
        code: resetToken,
        expiresAt,
      });
    } catch (error) {
      console.error('[RESET PASSWORD EMAIL ERROR]', error);
      return res.status(500).json({ error: 'Não foi possível enviar o e-mail de recuperação agora.' });
    }
  }

  res.json({
    ok: true,
    message: 'Se o e-mail existir, enviamos o código de redefinição para a caixa de entrada.'
  });
});

app.post('/api/auth/reset-password', async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const token = String(req.body?.token || '').trim();
  const newPassword = String(req.body?.newPassword || '');

  if (!email || !token || newPassword.length < 6) {
    return res.status(400).json({ error: 'Informe e-mail, código e nova senha válida.' });
  }

  const user = await get(
    'SELECT id, reset_token AS resetToken, reset_expires_at AS resetExpiresAt FROM users WHERE email = ?',
    [email]
  );

  if (!user || !user.resetToken || user.resetToken !== token) {
    return res.status(400).json({ error: 'Código inválido.' });
  }

  if (!user.resetExpiresAt || new Date(user.resetExpiresAt).getTime() <= Date.now()) {
    return res.status(400).json({ error: 'O código expirou. Gere outro.' });
  }

  await run(
    'UPDATE users SET password_hash = ?, reset_token = NULL, reset_expires_at = NULL WHERE id = ?',
    [hashPassword(newPassword), user.id]
  );
  await run('DELETE FROM user_sessions WHERE user_id = ?', [user.id]);

  res.json({ ok: true });
});

app.patch('/api/auth/me/password', requireAuth, async (req, res) => {
  const currentPassword = String(req.body?.currentPassword || '');
  const newPassword = String(req.body?.newPassword || '');

  if (!currentPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Informe a senha atual e uma nova senha com pelo menos 6 caracteres.' });
  }

  const user = await get(
    'SELECT id, password_hash AS passwordHash FROM users WHERE id = ?',
    [req.user.id]
  );

  if (!user || !verifyPassword(currentPassword, user.passwordHash)) {
    return res.status(400).json({ error: 'A senha atual está incorreta.' });
  }

  await run(
    'UPDATE users SET password_hash = ?, reset_token = NULL, reset_expires_at = NULL WHERE id = ?',
    [hashPassword(newPassword), req.user.id]
  );

  res.json({ ok: true });
});

app.get('/api/products', async (req, res) => {
  const { type, team, category, q } = req.query;
  const clauses = [];
  const params = [];

  if (type) {
    clauses.push('p.type = ?');
    params.push(type);
  }
  if (team) {
    clauses.push('p.team = ?');
    params.push(team);
  }
  if (category) {
    clauses.push('p.category = ?');
    params.push(category);
  }
  if (q) {
    clauses.push('(p.name LIKE ? OR p.description LIKE ? OR p.team LIKE ? OR p.category LIKE ?)');
    params.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const products = await all(
    `SELECT p.id, p.type, p.team, p.category,
            COALESCE(NULLIF(TRIM(p.home_section), ''), t.home_section) AS homeSection,
            COALESCE(NULLIF(TRIM(p.crest_url), ''), t.crest_url) AS crestUrl,
            p.name, p.description, p.image_url AS imageUrl, p.base_price AS basePrice,
            p.price_label AS priceLabel, p.allow_customization AS allowCustomization,
            p.only_consultation AS onlyConsultation, p.specs_json AS specsJson,
            p.option_groups_json AS optionGroupsJson, p.customization_json AS customizationJson
     FROM products p
     LEFT JOIN teams t ON lower(t.name) = lower(p.team)
     ${where}
     ORDER BY COALESCE(p.team, p.category, ''), p.name`,
    params
  );

  const stockEntries = await all(
    `SELECT product_id AS productId, version_value AS versionValue, version_label AS versionLabel, size, stock_quantity AS stockQuantity
     FROM product_stock_variants
     ORDER BY CASE WHEN COALESCE(version_value, '') = '' THEN 0 ELSE 1 END,
              lower(COALESCE(version_label, version_value, '')),
              CASE
                WHEN size = 'PP' THEN 1
                WHEN size = 'P' THEN 2
                WHEN size = 'M' THEN 3
                WHEN size = 'G' THEN 4
                WHEN size = 'GG' THEN 5
                WHEN size = 'G2' THEN 6
                WHEN size = 'G3' THEN 7
                WHEN size = 'G4' THEN 8
                ELSE 99
              END, size`
  );

  const stockMap = stockEntries.reduce((acc, row) => {
    if (!acc[row.productId]) acc[row.productId] = [];
    acc[row.productId].push({
      versionValue: row.versionValue || '',
      versionLabel: row.versionLabel || null,
      size: row.size,
      stockQuantity: Number(row.stockQuantity || 0),
    });
    return acc;
  }, {});

  res.json(
    products.map((product) => {
      const productStockEntries = normalizeStockEntriesInput(stockMap[product.id] || []);
      const versionOptions = buildVersionOptionsFromStockEntries(productStockEntries);
      const sizes = aggregateSizesFromStockEntries(productStockEntries);
      return {
        ...product,
        sizes: sizes.map((row) => ({
          size: row.size,
          stockQuantity: Number(row.stockQuantity || 0),
          available: Number(row.stockQuantity || 0) > 0,
        })),
        stockEntries: productStockEntries.map((row) => ({
          versionValue: row.versionValue || '',
          versionLabel: row.versionLabel || null,
          size: row.size,
          stockQuantity: Number(row.stockQuantity || 0),
          available: Number(row.stockQuantity || 0) > 0,
        })),
        versionOptions,
        stockMode: versionOptions.length ? 'versioned' : 'simple',
        allowCustomization: Boolean(product.allowCustomization),
        onlyConsultation: Boolean(product.onlyConsultation),
        specs: parseJsonArray(product.specsJson),
        optionGroups: parseJsonArray(product.optionGroupsJson),
        customizationOptions: parseJsonArray(product.customizationJson),
      };
    })
  );
});

app.get('/api/products/:id', async (req, res) => {
  const product = await fetchProductResponse(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Produto não encontrado.' });
  }
  res.json(product);
});

app.get('/api/products/:id/stock', async (req, res) => {
  const product = await get('SELECT id, name FROM products WHERE id = ?', [req.params.id]);
  if (!product) {
    return res.status(404).json({ error: 'Produto não encontrado.' });
  }

  const stockEntries = normalizeStockEntriesInput(await fetchProductStockEntries(req.params.id));
  const sizes = aggregateSizesFromStockEntries(stockEntries);

  res.json({
    id: product.id,
    name: product.name,
    sizes: sizes.map((row) => ({
      size: row.size,
      stockQuantity: Number(row.stockQuantity || 0),
      available: Number(row.stockQuantity || 0) > 0,
    })),
    stockEntries: stockEntries.map((row) => ({
      versionValue: row.versionValue || '',
      versionLabel: row.versionLabel || null,
      size: row.size,
      stockQuantity: Number(row.stockQuantity || 0),
      available: Number(row.stockQuantity || 0) > 0,
    })),
    versionOptions: buildVersionOptionsFromStockEntries(stockEntries),
    stockMode: buildVersionOptionsFromStockEntries(stockEntries).length ? 'versioned' : 'simple',
  });
});

app.patch('/api/admin/products/:id/stock', requireAdmin, async (req, res) => {
  const productId = req.params.id;
  const { sizes, stockEntries } = req.body || {};

  const product = await get('SELECT id, name FROM products WHERE id = ?', [productId]);
  if (!product) {
    return res.status(404).json({ error: 'Produto não encontrado.' });
  }

  const entries = normalizeStockEntriesInput(stockEntries, sizes);

  await run('DELETE FROM product_stock_variants WHERE product_id = ?', [productId]);
  for (const item of entries) {
    await run(
      `INSERT INTO product_stock_variants (product_id, version_value, version_label, size, stock_quantity)
       VALUES (?, ?, ?, ?, ?)`,
      [productId, item.versionValue || '', item.versionLabel || null, item.size, item.stockQuantity]
    );
  }

  const updatedProduct = await fetchProductResponse(productId);
  res.json({ ok: true, productId, sizes: updatedProduct.sizes, stockEntries: updatedProduct.stockEntries, versionOptions: updatedProduct.versionOptions, stockMode: updatedProduct.stockMode });
});

app.post('/api/admin/uploads/product-image', requireAdmin, async (req, res) => {
  try {
    const dataUrl = String(req.body?.dataUrl || '').trim();
    const fileName = String(req.body?.fileName || '').trim();

    if (!dataUrl) {
      return res.status(400).json({ error: 'Envie uma imagem para salvar.' });
    }

    const imageUrl = await saveProductImageUpload(dataUrl, fileName);
    res.status(201).json({ ok: true, imageUrl });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Não foi possível salvar a imagem.' });
  }
});

app.post('/api/admin/uploads/team-crest', requireAdmin, async (req, res) => {
  try {
    const dataUrl = String(req.body?.dataUrl || '').trim();
    const fileName = String(req.body?.fileName || '').trim();

    if (!dataUrl) {
      return res.status(400).json({ error: 'Envie uma imagem para salvar.' });
    }

    const crestUrl = await saveTeamCrestUpload(dataUrl, fileName);
    res.status(201).json({ ok: true, crestUrl });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Não foi possível salvar o escudo.' });
  }
});

app.post('/api/admin/products', requireAdmin, async (req, res) => {
  const body = req.body || {};
  const name = String(body.name || '').trim();
  const type = String(body.type || '').trim() || 'categoria';

  if (!name) {
    return res.status(400).json({ error: 'Nome do produto é obrigatório.' });
  }

  const stockEntries = normalizeStockEntriesInput(body.stockEntries, body.sizes);
  if (stockEntries.some((item) => !Number.isInteger(item.stockQuantity) || item.stockQuantity < 0)) {
    return res.status(400).json({ error: 'Quantidade inválida em um ou mais tamanhos.' });
  }

  const specs = normalizeSpecsInput(body.specs);
  const optionGroups = normalizeOptionGroupsInput(body.optionGroups);
  const customizationOptions = normalizeCustomizationInput(body.customizationOptions);

  const preferredId = String(body.id || '').trim() || `${String(body.team || body.category || 'produto').trim()}-${name}`;
  const productId = await buildUniqueProductId(preferredId);

  await run(
    `INSERT INTO products (
      id, type, team, category, home_section, crest_url, name, description, image_url, base_price, price_label,
      allow_customization, only_consultation, specs_json, option_groups_json, customization_json, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [
      productId,
      type,
      String(body.team || '').trim() || null,
      String(body.category || '').trim() || null,
      String(body.homeSection || '').trim() || null,
      String(body.crestUrl || '').trim() || null,
      name,
      String(body.description || '').trim() || null,
      String(body.imageUrl || '').trim() || null,
      normalizeNumber(body.basePrice),
      String(body.priceLabel || '').trim() || null,
      normalizeBoolean(body.allowCustomization),
      normalizeBoolean(body.onlyConsultation),
      JSON.stringify(specs),
      JSON.stringify(optionGroups),
      JSON.stringify(customizationOptions),
    ]
  );

  for (const item of stockEntries) {
    await run(
      'INSERT INTO product_stock_variants (product_id, version_value, version_label, size, stock_quantity) VALUES (?, ?, ?, ?, ?)',
      [productId, item.versionValue || '', item.versionLabel || null, item.size, item.stockQuantity]
    );
  }

  if (type === 'camisa' && String(body.team || '').trim()) {
    await upsertTeamRecord({
      name: body.team,
      homeSection: body.homeSection,
      crestUrl: body.crestUrl,
    });
  }

  const product = await fetchProductResponse(productId);
  res.status(201).json({ ok: true, product });
});

app.patch('/api/admin/products/:id', requireAdmin, async (req, res) => {
  const productId = req.params.id;
  const existing = await get('SELECT id FROM products WHERE id = ?', [productId]);
  if (!existing) {
    return res.status(404).json({ error: 'Produto não encontrado.' });
  }

  const body = req.body || {};
  const name = String(body.name || '').trim();
  const type = String(body.type || '').trim() || 'categoria';

  if (!name) {
    return res.status(400).json({ error: 'Nome do produto é obrigatório.' });
  }

  const stockEntries = normalizeStockEntriesInput(body.stockEntries, body.sizes);
  if (stockEntries.some((item) => !Number.isInteger(item.stockQuantity) || item.stockQuantity < 0)) {
    return res.status(400).json({ error: 'Quantidade inválida em um ou mais tamanhos.' });
  }

  const specs = normalizeSpecsInput(body.specs);
  const optionGroups = normalizeOptionGroupsInput(body.optionGroups);
  const customizationOptions = normalizeCustomizationInput(body.customizationOptions);

  await run(
    `UPDATE products
     SET type = ?, team = ?, category = ?, home_section = ?, crest_url = ?, name = ?, description = ?, image_url = ?, base_price = ?,
         price_label = ?, allow_customization = ?, only_consultation = ?, specs_json = ?, option_groups_json = ?, customization_json = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      type,
      String(body.team || '').trim() || null,
      String(body.category || '').trim() || null,
      String(body.homeSection || '').trim() || null,
      String(body.crestUrl || '').trim() || null,
      name,
      String(body.description || '').trim() || null,
      String(body.imageUrl || '').trim() || null,
      normalizeNumber(body.basePrice),
      String(body.priceLabel || '').trim() || null,
      normalizeBoolean(body.allowCustomization),
      normalizeBoolean(body.onlyConsultation),
      JSON.stringify(specs),
      JSON.stringify(optionGroups),
      JSON.stringify(customizationOptions),
      productId,
    ]
  );

  await run('DELETE FROM product_stock_variants WHERE product_id = ?', [productId]);
  for (const item of stockEntries) {
    await run(
      'INSERT INTO product_stock_variants (product_id, version_value, version_label, size, stock_quantity) VALUES (?, ?, ?, ?, ?)',
      [productId, item.versionValue || '', item.versionLabel || null, item.size, item.stockQuantity]
    );
  }

  if (type === 'camisa' && String(body.team || '').trim()) {
    await upsertTeamRecord({
      name: body.team,
      homeSection: body.homeSection,
      crestUrl: body.crestUrl,
    });
  }

  const product = await fetchProductResponse(productId);
  res.json({ ok: true, product });
});

app.delete('/api/admin/products/:id', requireAdmin, async (req, res) => {
  const productId = req.params.id;
  const existing = await get('SELECT id, name FROM products WHERE id = ?', [productId]);
  if (!existing) {
    return res.status(404).json({ error: 'Produto não encontrado.' });
  }

  await run('DELETE FROM products WHERE id = ?', [productId]);
  res.json({ ok: true, productId, name: existing.name });
});

app.get('/api/catalog/teams', async (_req, res) => {
  const rows = await fetchAllTeams();
  res.json(rows.filter((row) => Number(row.productCount || 0) > 0).map((row) => row.name));
});

app.get('/api/teams', async (_req, res) => {
  const rows = await fetchAllTeams();
  res.json(rows.map((row) => ({
    id: row.id,
    name: row.name,
    homeSection: row.homeSection || '',
    crestUrl: row.crestUrl || '',
    displayOrder: Number(row.displayOrder || 0),
    productCount: Number(row.productCount || 0),
  })));
});

app.get('/api/catalog/categories', async (_req, res) => {
  const rows = await all('SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category');
  res.json(rows.map((row) => row.category));
});

app.post('/api/orders', async (req, res) => {
  const { customer, items, whatsappMessage, notes } = req.body || {};

  if (!customer || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Pedido inválido.' });
  }

  const required = ['name', 'whatsapp', 'cep', 'city', 'state', 'neighborhood', 'street', 'number'];
  const missing = required.filter((key) => !String(customer[key] || '').trim());
  if (missing.length) {
    return res.status(400).json({ error: `Campos obrigatórios faltando: ${missing.join(', ')}` });
  }

  const stockRequirements = new Map();

  for (const item of items) {
    const quantity = Number(item.quantity || 1);
    const size = String(item.size || item.tamanho || '').trim().toUpperCase();

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'Quantidade inválida no pedido.' });
    }

    const versionValue = createSlug(String(item.versionValue || item.versao || '').trim());

    if (item.productId && size) {
      const requirementKey = `${item.productId}::${versionValue}::${size}`;
      stockRequirements.set(requirementKey, {
        productId: item.productId,
        versionValue,
        size,
        quantity: (stockRequirements.get(requirementKey)?.quantity || 0) + quantity,
      });
    }
  }

  for (const requirement of stockRequirements.values()) {
    const stockRow = await get(
      'SELECT stock_quantity AS stockQuantity FROM product_stock_variants WHERE product_id = ? AND version_value = ? AND size = ?',
      [requirement.productId, requirement.versionValue || '', requirement.size]
    );

    if (!stockRow) {
      return res.status(400).json({ error: `O tamanho ${requirement.size} não existe para esse produto.` });
    }

    if (Number(stockRow.stockQuantity || 0) < requirement.quantity) {
      return res.status(400).json({ error: `O tamanho ${requirement.size} está sem estoque suficiente.` });
    }
  }

  let inserted = null;

  try {
    await run('BEGIN IMMEDIATE TRANSACTION');

    inserted = await run(
      `INSERT INTO orders (
        user_id, customer_name, customer_email, customer_whatsapp, cep, city, state, neighborhood, street, number, complement, source, notes, whatsapp_message
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'site', ?, ?)`,
      [
        req.user?.id || null,
        customer.name.trim(),
        normalizeEmail(customer.email || req.user?.email || '') || null,
        customer.whatsapp.trim(),
        customer.cep.trim(),
        customer.city.trim(),
        customer.state.trim(),
        customer.neighborhood.trim(),
        customer.street.trim(),
        customer.number.trim(),
        String(customer.complement || '').trim(),
        String(notes || '').trim(),
        String(whatsappMessage || '').trim(),
      ]
    );

    for (const item of items) {
      const extras = item.extras || {
        nomeNumero: Boolean(item.nomeNumero),
        patch: Boolean(item.patch),
        patrocinadores: Boolean(item.patrocinadores),
      };
      const quantity = Number(item.quantity || 1);
      const size = String(item.size || item.tamanho || '').trim().toUpperCase() || null;
      const versionValue = createSlug(String(item.versionValue || item.versao || '').trim());

      await run(
        `INSERT INTO order_items (
          order_id, product_id, product_name, category, image_url, product_link,
          version_label, version_value, size, extras_json, price, quantity
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          inserted.id,
          item.productId || null,
          String(item.productName || item.nome || '').trim(),
          item.category || null,
          item.imageUrl || item.img || null,
          item.productLink || item.link || null,
          item.versionLabel || item.versaoLabel || null,
          item.versionValue || item.versao || null,
          size,
          JSON.stringify(extras),
          Number(item.price || item.preco || 0) || null,
          quantity,
        ]
      );

      if (item.productId && size) {
        const stockUpdate = await run(
          'UPDATE product_stock_variants SET stock_quantity = stock_quantity - ? WHERE product_id = ? AND version_value = ? AND size = ? AND stock_quantity >= ?',
          [quantity, item.productId, versionValue || '', size, quantity]
        );

        if (!stockUpdate.changes) {
          throw new Error(`O tamanho ${size} ficou sem estoque durante a finalização do pedido.`);
        }
      }
    }

    await run('COMMIT');
  } catch (error) {
    try {
      await run('ROLLBACK');
    } catch {}
    return res.status(400).json({ error: error.message || 'Não foi possível concluir o pedido.' });
  }

  res.status(201).json({ ok: true, orderId: inserted.id });
});

app.get('/api/orders/my', requireAuth, async (req, res) => {
  const orders = await all(
    `SELECT id, customer_name AS customerName, customer_email AS customerEmail, customer_whatsapp AS customerWhatsapp,
            cep, city, state, neighborhood, street, number, complement, notes, created_at AS createdAt
     FROM orders
     WHERE user_id = ? OR (user_id IS NULL AND lower(customer_email) = ?)
     ORDER BY id DESC LIMIT 100`,
    [req.user.id, normalizeEmail(req.user.email)]
  );

  for (const order of orders) {
    order.items = await all(
      `SELECT product_id AS productId, product_name AS productName, category, image_url AS imageUrl,
              product_link AS productLink, version_label AS versionLabel, version_value AS versionValue,
              size, extras_json AS extrasJson, price, quantity
       FROM order_items WHERE order_id = ? ORDER BY id`,
      [order.id]
    );
    order.items = order.items.map((item) => ({
      ...item,
      extras: item.extrasJson ? JSON.parse(item.extrasJson) : null,
      extrasJson: undefined,
    }));
  }

  res.json({ ok: true, orders });
});

app.get('/api/orders', requireAdmin, async (_req, res) => {
  const orders = await all(
    `SELECT id, user_id AS userId, customer_name AS customerName, customer_email AS customerEmail, customer_whatsapp AS customerWhatsapp,
            cep, city, state, neighborhood, street, number, complement, notes, created_at AS createdAt
     FROM orders ORDER BY id DESC LIMIT 100`
  );

  for (const order of orders) {
    order.items = await all(
      `SELECT product_id AS productId, product_name AS productName, category, image_url AS imageUrl,
              product_link AS productLink, version_label AS versionLabel, version_value AS versionValue,
              size, extras_json AS extrasJson, price, quantity
       FROM order_items WHERE order_id = ? ORDER BY id`,
      [order.id]
    );
    order.items = order.items.map((item) => ({
      ...item,
      extras: item.extrasJson ? JSON.parse(item.extrasJson) : null,
      extrasJson: undefined,
    }));
  }

  res.json(orders);
});



app.get('/api/admin/users', requireAdmin, async (_req, res) => {
  const users = await all(
    `SELECT id, name, email, role, created_at AS createdAt
     FROM users
     ORDER BY datetime(created_at) DESC, id DESC`
  );

  res.json({ ok: true, users: users.map(sanitizeUser) });
});

app.patch('/api/admin/users/:id/password', requireAdmin, async (req, res) => {
  const userId = Number(req.params.id);
  const newPassword = String(req.body?.newPassword || '');

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ error: 'Usuário inválido.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'A nova senha precisa ter pelo menos 6 caracteres.' });
  }

  const user = await get(
    'SELECT id, name, email, role, created_at AS createdAt FROM users WHERE id = ?',
    [userId]
  );

  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  const passwordHash = hashPassword(newPassword);
  await run(
    `UPDATE users
     SET password_hash = ?, reset_token = NULL, reset_expires_at = NULL
     WHERE id = ?`,
    [passwordHash, userId]
  );

  if (req.auth?.token) {
    await run('DELETE FROM user_sessions WHERE user_id = ? AND token != ?', [userId, req.auth.token]);
  } else {
    await run('DELETE FROM user_sessions WHERE user_id = ?', [userId]);
  }

  res.json({
    ok: true,
    message: `Senha redefinida com sucesso para ${user.name}.`,
    user: sanitizeUser(user)
  });
});

app.use('/', express.static(FRONTEND_DIR));

async function start() {
  await initDb();
  await syncAdminRoleByEmail();
  await ensureConfiguredAdminAccount();
  await run('DELETE FROM user_sessions WHERE expires_at <= CURRENT_TIMESTAMP');

  const count = await get('SELECT COUNT(*) AS total FROM products');
  if (!count?.total) {
    console.log('Banco vazio. Rode "npm run seed" dentro da pasta backend para popular os produtos.');
  }

  if (emailTransportConfigured()) {
    try {
      await getMailTransporter().verify();
      console.log('SMTP configurado com sucesso para recuperação de senha.');
    } catch (error) {
      console.error('Falha ao validar SMTP:', error.message);
    }
  } else {
    console.warn('SMTP não configurado. A recuperação de senha por e-mail ficará indisponível.');
  }

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error('Erro ao iniciar servidor:', error);
  process.exit(1);
});
