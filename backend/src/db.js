const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, '..', 'data.sqlite');
const db = new sqlite3.Database(DB_PATH);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });
}

async function initDb() {
  await run('PRAGMA foreign_keys = ON');

  await run(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      team TEXT,
      category TEXT,
      name TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      base_price REAL,
      price_label TEXT,
      allow_customization INTEGER NOT NULL DEFAULT 1,
      only_consultation INTEGER NOT NULL DEFAULT 0,
      specs_json TEXT NOT NULL DEFAULT '[]',
      option_groups_json TEXT NOT NULL DEFAULT '[]',
      customization_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS product_sizes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT NOT NULL,
      size TEXT NOT NULL,
      stock_quantity INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      UNIQUE (product_id, size)
    )
  `);

  const productSizeColumns = await all('PRAGMA table_info(product_sizes)');
  const hasStockColumn = productSizeColumns.some((column) => column.name === 'stock_quantity');
  if (!hasStockColumn) {
    await run('ALTER TABLE product_sizes ADD COLUMN stock_quantity INTEGER NOT NULL DEFAULT 0');
  }

  await run(`
    CREATE TABLE IF NOT EXISTS product_stock_variants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT NOT NULL,
      version_value TEXT NOT NULL DEFAULT '',
      version_label TEXT,
      size TEXT NOT NULL,
      stock_quantity INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      UNIQUE (product_id, version_value, size)
    )
  `);

  const stockVariantCount = await get('SELECT COUNT(*) AS total FROM product_stock_variants');
  const legacySizeCount = await get('SELECT COUNT(*) AS total FROM product_sizes');
  if (!Number(stockVariantCount?.total || 0) && Number(legacySizeCount?.total || 0)) {
    await run(`
      INSERT INTO product_stock_variants (product_id, version_value, version_label, size, stock_quantity)
      SELECT product_id, '', NULL, size, stock_quantity
      FROM product_sizes
    `);
  }

  const productColumns = await all('PRAGMA table_info(products)');
  const ensureProductColumn = async (columnName, definition) => {
    const exists = productColumns.some((column) => column.name === columnName);
    if (!exists) {
      await run(`ALTER TABLE products ADD COLUMN ${definition}`);
    }
  };

  await ensureProductColumn('specs_json', "specs_json TEXT NOT NULL DEFAULT '[]'");
  await ensureProductColumn('option_groups_json', "option_groups_json TEXT NOT NULL DEFAULT '[]'");
  await ensureProductColumn('customization_json', "customization_json TEXT NOT NULL DEFAULT '[]'");
  await ensureProductColumn('home_section', "home_section TEXT");
  await ensureProductColumn('crest_url', "crest_url TEXT");

  await run(`
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      home_section TEXT,
      crest_url TEXT,
      display_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    INSERT INTO teams (name, home_section, crest_url, updated_at)
    SELECT DISTINCT TRIM(team), NULLIF(TRIM(home_section), ''), NULLIF(TRIM(crest_url), ''), CURRENT_TIMESTAMP
    FROM products
    WHERE team IS NOT NULL AND TRIM(team) <> ''
    ON CONFLICT(name) DO UPDATE SET
      home_section = COALESCE(NULLIF(excluded.home_section, ''), teams.home_section),
      crest_url = COALESCE(NULLIF(excluded.crest_url, ''), teams.crest_url),
      updated_at = CURRENT_TIMESTAMP
  `);

  await run(`
    UPDATE products
    SET category = NULL
    WHERE team IS NOT NULL
      AND TRIM(team) <> ''
      AND LOWER(TRIM(COALESCE(category, ''))) IN ('torcedor', 'jogador', 'manga longa', 'manga-longa')
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_whatsapp TEXT NOT NULL,
      cep TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      neighborhood TEXT NOT NULL,
      street TEXT NOT NULL,
      number TEXT NOT NULL,
      complement TEXT,
      source TEXT NOT NULL DEFAULT 'site',
      notes TEXT,
      whatsapp_message TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id TEXT,
      product_name TEXT NOT NULL,
      category TEXT,
      image_url TEXT,
      product_link TEXT,
      version_label TEXT,
      version_value TEXT,
      size TEXT,
      extras_json TEXT,
      price REAL,
      quantity INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    )
  `);
}

module.exports = {
  db,
  DB_PATH,
  run,
  get,
  all,
  initDb,
};
