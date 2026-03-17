const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb, run, get, all } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', async (_req, res) => {
  const info = await get('SELECT COUNT(*) AS totalProducts FROM products');
  res.json({ ok: true, totalProducts: Number(info?.totalProducts || 0) });
});

app.get('/api/products', async (req, res) => {
  const { type, team, category, q } = req.query;
  const clauses = [];
  const params = [];

  if (type) {
    clauses.push('type = ?');
    params.push(type);
  }
  if (team) {
    clauses.push('team = ?');
    params.push(team);
  }
  if (category) {
    clauses.push('category = ?');
    params.push(category);
  }
  if (q) {
    clauses.push('(name LIKE ? OR description LIKE ? OR team LIKE ? OR category LIKE ?)');
    params.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const products = await all(
    `SELECT id, type, team, category, name, description, image_url AS imageUrl, base_price AS basePrice,
            price_label AS priceLabel, allow_customization AS allowCustomization,
            only_consultation AS onlyConsultation, specs_json AS specsJson,
            option_groups_json AS optionGroupsJson, customization_json AS customizationJson
     FROM products
     ${where}
     ORDER BY COALESCE(team, category, ''), name`,
    params
  );

  const sizes = await all(`
    SELECT product_id AS productId, size, stock_quantity AS stockQuantity
    FROM product_sizes
    ORDER BY CASE
      WHEN size = 'PP' THEN 1
      WHEN size = 'P' THEN 2
      WHEN size = 'M' THEN 3
      WHEN size = 'G' THEN 4
      WHEN size = 'GG' THEN 5
      WHEN size = 'G2' THEN 6
      WHEN size = 'G3' THEN 7
      WHEN size = 'G4' THEN 8
      ELSE 99
    END, size
  `);
  const sizeMap = sizes.reduce((acc, row) => {
    if (!acc[row.productId]) acc[row.productId] = [];
    acc[row.productId].push({
      size: row.size,
      stockQuantity: Number(row.stockQuantity || 0),
      available: Number(row.stockQuantity || 0) > 0,
    });
    return acc;
  }, {});

  res.json(products.map((product) => ({
    ...product,
    sizes: sizeMap[product.id] || [],
    allowCustomization: Boolean(product.allowCustomization),
    onlyConsultation: Boolean(product.onlyConsultation),
    specs: parseJsonArray(product.specsJson),
    optionGroups: parseJsonArray(product.optionGroupsJson),
    customizationOptions: parseJsonArray(product.customizationJson),
  })));
});

app.get('/api/products/:id', async (req, res) => {
  const product = await get(
    `SELECT id, type, team, category, name, description, image_url AS imageUrl, base_price AS basePrice,
            price_label AS priceLabel, allow_customization AS allowCustomization,
            only_consultation AS onlyConsultation, specs_json AS specsJson,
            option_groups_json AS optionGroupsJson, customization_json AS customizationJson
     FROM products WHERE id = ?`,
    [req.params.id]
  );

  if (!product) {
    return res.status(404).json({ error: 'Produto não encontrado.' });
  }

  const sizes = await all(`
    SELECT size, stock_quantity AS stockQuantity
    FROM product_sizes
    WHERE product_id = ?
    ORDER BY CASE
      WHEN size = 'PP' THEN 1
      WHEN size = 'P' THEN 2
      WHEN size = 'M' THEN 3
      WHEN size = 'G' THEN 4
      WHEN size = 'GG' THEN 5
      WHEN size = 'G2' THEN 6
      WHEN size = 'G3' THEN 7
      WHEN size = 'G4' THEN 8
      ELSE 99
    END, size
  `, [req.params.id]);
  res.json({
    ...product,
    sizes: sizes.map((row) => ({
      size: row.size,
      stockQuantity: Number(row.stockQuantity || 0),
      available: Number(row.stockQuantity || 0) > 0,
    })),
    allowCustomization: Boolean(product.allowCustomization),
    onlyConsultation: Boolean(product.onlyConsultation),
    specs: parseJsonArray(product.specsJson),
    optionGroups: parseJsonArray(product.optionGroupsJson),
    customizationOptions: parseJsonArray(product.customizationJson),
  });
});

function createSlug(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}


function normalizeProductType(value) {
  const type = String(value || '').trim().toLowerCase();
  if (['camisa', 'time'].includes(type)) return 'camisa';
  if (['extra', 'categoria'].includes(type)) return 'extra';
  return 'camisa';
}

function normalizeProductGrouping(body = {}) {
  const type = normalizeProductType(body.type);
  const team = type === 'camisa' ? String(body.team || '').trim() : '';
  const category = type === 'extra' ? String(body.category || '').trim() : '';
  return { type, team: team || null, category: category || null };
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

function parseJsonArray(value) {
  try {
    const parsed = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeSpecsInput(specs) {
  if (!Array.isArray(specs)) return [];
  return specs.map((item) => String(item || '').trim()).filter(Boolean).filter((item, index, arr) => arr.indexOf(item) === index);
}

function normalizeOptionGroupsInput(optionGroups) {
  if (!Array.isArray(optionGroups)) return [];
  return optionGroups
    .map((group) => ({
      name: String(group?.name || '').trim(),
      type: String(group?.type || 'single').trim() || 'single',
      values: Array.isArray(group?.values)
        ? group.values.map((value) => ({
            value: String(value?.value || value?.label || '').trim(),
            label: String(value?.label || value?.value || '').trim(),
            priceAdjustment: Number(value?.priceAdjustment || 0),
          })).filter((value) => value.value && value.label)
        : [],
    }))
    .filter((group) => group.name && group.values.length);
}

function normalizeCustomizationInput(customizations) {
  if (!Array.isArray(customizations)) return [];
  return customizations
    .map((item) => ({
      key: String(item?.key || item?.label || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      label: String(item?.label || item?.key || '').trim(),
      priceAdjustment: Number(item?.priceAdjustment || 0),
    }))
    .filter((item) => item.key && item.label)
    .filter((item, index, arr) => arr.findIndex((other) => other.key === item.key) === index);
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

async function fetchProductResponse(productId) {
  const product = await get(
    `SELECT id, type, team, category, name, description, image_url AS imageUrl, base_price AS basePrice,
            price_label AS priceLabel, allow_customization AS allowCustomization,
            only_consultation AS onlyConsultation, specs_json AS specsJson,
            option_groups_json AS optionGroupsJson, customization_json AS customizationJson
     FROM products WHERE id = ?`,
    [productId]
  );

  if (!product) return null;

  const sizes = await all(`
    SELECT size, stock_quantity AS stockQuantity
    FROM product_sizes
    WHERE product_id = ?
    ORDER BY CASE
      WHEN size = 'PP' THEN 1
      WHEN size = 'P' THEN 2
      WHEN size = 'M' THEN 3
      WHEN size = 'G' THEN 4
      WHEN size = 'GG' THEN 5
      WHEN size = 'G2' THEN 6
      WHEN size = 'G3' THEN 7
      WHEN size = 'G4' THEN 8
      ELSE 99
    END, size
  `, [productId]);

  return {
    ...product,
    sizes: sizes.map((row) => ({
      size: row.size,
      stockQuantity: Number(row.stockQuantity || 0),
      available: Number(row.stockQuantity || 0) > 0,
    })),
    allowCustomization: Boolean(product.allowCustomization),
    onlyConsultation: Boolean(product.onlyConsultation),
    specs: parseJsonArray(product.specsJson),
    optionGroups: parseJsonArray(product.optionGroupsJson),
    customizationOptions: parseJsonArray(product.customizationJson),
  };
}

app.get('/api/products/:id/stock', async (req, res) => {
  const product = await get('SELECT id, name FROM products WHERE id = ?', [req.params.id]);
  if (!product) {
    return res.status(404).json({ error: 'Produto não encontrado.' });
  }

  const sizes = await all(`
    SELECT size, stock_quantity AS stockQuantity
    FROM product_sizes
    WHERE product_id = ?
    ORDER BY CASE
      WHEN size = 'PP' THEN 1
      WHEN size = 'P' THEN 2
      WHEN size = 'M' THEN 3
      WHEN size = 'G' THEN 4
      WHEN size = 'GG' THEN 5
      WHEN size = 'G2' THEN 6
      WHEN size = 'G3' THEN 7
      WHEN size = 'G4' THEN 8
      ELSE 99
    END, size
  `, [req.params.id]);

  res.json({
    id: product.id,
    name: product.name,
    sizes: sizes.map((row) => ({
      size: row.size,
      stockQuantity: Number(row.stockQuantity || 0),
      available: Number(row.stockQuantity || 0) > 0,
    })),
  });
});


app.patch('/api/admin/products/:id/stock', async (req, res) => {
  const productId = req.params.id;
  const { sizes } = req.body || {};

  const product = await get('SELECT id, name FROM products WHERE id = ?', [productId]);
  if (!product) {
    return res.status(404).json({ error: 'Produto não encontrado.' });
  }

  if (!Array.isArray(sizes) || !sizes.length) {
    return res.status(400).json({ error: 'Envie uma lista de tamanhos para atualizar.' });
  }

  for (const item of sizes) {
    const size = String(item?.size || '').trim();
    const stockQuantity = Number(item?.stockQuantity);

    if (!size) {
      return res.status(400).json({ error: 'Tamanho inválido.' });
    }

    if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
      return res.status(400).json({ error: `Quantidade inválida para o tamanho ${size}.` });
    }

    const existing = await get(
      'SELECT id FROM product_sizes WHERE product_id = ? AND size = ?',
      [productId, size]
    );

    if (existing) {
      await run(
        'UPDATE product_sizes SET stock_quantity = ? WHERE product_id = ? AND size = ?',
        [stockQuantity, productId, size]
      );
    } else {
      await run(
        'INSERT INTO product_sizes (product_id, size, stock_quantity) VALUES (?, ?, ?)',
        [productId, size, stockQuantity]
      );
    }
  }

  const updatedSizes = await all(`
    SELECT size, stock_quantity AS stockQuantity
    FROM product_sizes
    WHERE product_id = ?
    ORDER BY CASE
      WHEN size = 'PP' THEN 1
      WHEN size = 'P' THEN 2
      WHEN size = 'M' THEN 3
      WHEN size = 'G' THEN 4
      WHEN size = 'GG' THEN 5
      WHEN size = 'G2' THEN 6
      WHEN size = 'G3' THEN 7
      WHEN size = 'G4' THEN 8
      ELSE 99
    END, size
  `, [productId]);

  res.json({
    ok: true,
    productId,
    name: product.name,
    sizes: updatedSizes.map((row) => ({
      size: row.size,
      stockQuantity: Number(row.stockQuantity || 0),
      available: Number(row.stockQuantity || 0) > 0,
    })),
  });
});

app.post('/api/admin/products', async (req, res) => {
  const body = req.body || {};
  const name = String(body.name || '').trim();
  const { type, team, category } = normalizeProductGrouping(body);

  if (!name) {
    return res.status(400).json({ error: 'Nome do produto é obrigatório.' });
  }

  const sizes = normalizeSizesInput(body.sizes);
  if (!sizes.length) {
    return res.status(400).json({ error: 'Adicione pelo menos um tamanho.' });
  }

  if (sizes.some((item) => !Number.isInteger(item.stockQuantity) || item.stockQuantity < 0)) {
    return res.status(400).json({ error: 'Quantidade inválida em um ou mais tamanhos.' });
  }

  const specs = normalizeSpecsInput(body.specs);
  const optionGroups = normalizeOptionGroupsInput(body.optionGroups);
  const customizationOptions = normalizeCustomizationInput(body.customizationOptions);

  const preferredId = String(body.id || '').trim() || `${String(team || category || 'produto').trim()}-${name}`;
  const productId = await buildUniqueProductId(preferredId);

  await run(
    `INSERT INTO products (
      id, type, team, category, name, description, image_url, base_price, price_label, allow_customization, only_consultation, specs_json, option_groups_json, customization_json, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [
      productId,
      type,
      team,
      category,
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

  for (const item of sizes) {
    await run(
      'INSERT INTO product_sizes (product_id, size, stock_quantity) VALUES (?, ?, ?)',
      [productId, item.size, item.stockQuantity]
    );
  }

  const product = await fetchProductResponse(productId);
  res.status(201).json({ ok: true, product });
});

app.patch('/api/admin/products/:id', async (req, res) => {
  const productId = req.params.id;
  const existing = await get('SELECT id FROM products WHERE id = ?', [productId]);
  if (!existing) {
    return res.status(404).json({ error: 'Produto não encontrado.' });
  }

  const body = req.body || {};
  const name = String(body.name || '').trim();
  const { type, team, category } = normalizeProductGrouping(body);

  if (!name) {
    return res.status(400).json({ error: 'Nome do produto é obrigatório.' });
  }

  const sizes = normalizeSizesInput(body.sizes);
  if (!sizes.length) {
    return res.status(400).json({ error: 'Adicione pelo menos um tamanho.' });
  }

  if (sizes.some((item) => !Number.isInteger(item.stockQuantity) || item.stockQuantity < 0)) {
    return res.status(400).json({ error: 'Quantidade inválida em um ou mais tamanhos.' });
  }

  const specs = normalizeSpecsInput(body.specs);
  const optionGroups = normalizeOptionGroupsInput(body.optionGroups);
  const customizationOptions = normalizeCustomizationInput(body.customizationOptions);

  await run(
    `UPDATE products
     SET type = ?, team = ?, category = ?, name = ?, description = ?, image_url = ?, base_price = ?,
         price_label = ?, allow_customization = ?, only_consultation = ?, specs_json = ?, option_groups_json = ?, customization_json = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      type,
      team,
      category,
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

  await run('DELETE FROM product_sizes WHERE product_id = ?', [productId]);
  for (const item of sizes) {
    await run(
      'INSERT INTO product_sizes (product_id, size, stock_quantity) VALUES (?, ?, ?)',
      [productId, item.size, item.stockQuantity]
    );
  }

  const product = await fetchProductResponse(productId);
  res.json({ ok: true, product });
});

app.delete('/api/admin/products/:id', async (req, res) => {
  const productId = req.params.id;
  const existing = await get('SELECT id, name FROM products WHERE id = ?', [productId]);
  if (!existing) {
    return res.status(404).json({ error: 'Produto não encontrado.' });
  }

  await run('DELETE FROM products WHERE id = ?', [productId]);
  res.json({ ok: true, productId, name: existing.name });
});

app.get('/api/catalog/teams', async (_req, res) => {
  const rows = await all('SELECT DISTINCT team FROM products WHERE team IS NOT NULL ORDER BY team');
  res.json(rows.map((row) => row.team));
});

app.get('/api/catalog/categories', async (_req, res) => {
  const rows = await all("SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND TRIM(category) <> '' AND (team IS NULL OR TRIM(team) = '') ORDER BY category");
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

  for (const item of items) {
    const quantity = Number(item.quantity || 1);
    if (item.productId && item.size) {
      const stockRow = await get(
        'SELECT stock_quantity AS stockQuantity FROM product_sizes WHERE product_id = ? AND size = ?',
        [item.productId, item.size]
      );

      if (!stockRow) {
        return res.status(400).json({ error: `O tamanho ${item.size} não existe para esse produto.` });
      }

      if (Number(stockRow.stockQuantity || 0) < quantity) {
        return res.status(400).json({ error: `O tamanho ${item.size} está sem estoque suficiente.` });
      }
    }
  }

  const inserted = await run(
    `INSERT INTO orders (
      customer_name, customer_whatsapp, cep, city, state, neighborhood, street, number, complement, source, notes, whatsapp_message
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'site', ?, ?)`,
    [
      customer.name.trim(),
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
        item.size || item.tamanho || null,
        JSON.stringify(extras),
        Number(item.price || item.preco || 0) || null,
        quantity,
      ]
    );

    if (item.productId && (item.size || item.tamanho)) {
      await run(
        'UPDATE product_sizes SET stock_quantity = stock_quantity - ? WHERE product_id = ? AND size = ?',
        [quantity, item.productId, item.size || item.tamanho]
      );
    }
  }

  res.status(201).json({ ok: true, orderId: inserted.id });
});

app.get('/api/orders', async (_req, res) => {
  const orders = await all(
    `SELECT id, customer_name AS customerName, customer_whatsapp AS customerWhatsapp,
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

app.use('/', express.static(path.join(__dirname, '..', '..', 'frontend')));

async function start() {
  await initDb();
  const count = await get('SELECT COUNT(*) AS total FROM products');
  if (!count?.total) {
    console.log('Banco vazio. Rode "npm run seed" dentro da pasta backend para popular os produtos.');
  }

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error('Erro ao iniciar servidor:', error);
  process.exit(1);
});
