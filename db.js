// db.js
// Uses Node.js's BUILT-IN sqlite module (node:sqlite) — no native compilation,
// no Visual Studio / build tools required. Available in Node.js 22.5+.
// Prepared statements with '?' placeholders protect against SQL Injection.

const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const db = new DatabaseSync(path.join(__dirname, 'inventory.db'));

// Create products table if it doesn't already exist
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    low_stock_threshold INTEGER NOT NULL DEFAULT 5,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// ---- Prepared statements (reused = faster + safe from SQL injection) ----
const stmtGetAll = db.prepare('SELECT * FROM products ORDER BY id DESC');
const stmtGetById = db.prepare('SELECT * FROM products WHERE id = ?');
const stmtInsert = db.prepare(
  `INSERT INTO products (name, category, price, quantity, low_stock_threshold)
   VALUES (?, ?, ?, ?, ?)`
);
const stmtUpdate = db.prepare(
  `UPDATE products
   SET name = ?, category = ?, price = ?, quantity = ?, low_stock_threshold = ?
   WHERE id = ?`
);
const stmtDelete = db.prepare('DELETE FROM products WHERE id = ?');

module.exports = {
  getAllProducts: () => stmtGetAll.all(),

  getProductById: (id) => stmtGetById.get(Number(id)),

  addProduct: (data) =>
    stmtInsert.run(
      data.name,
      data.category,
      data.price,
      data.quantity,
      data.low_stock_threshold
    ),

  updateProduct: (id, data) =>
    stmtUpdate.run(
      data.name,
      data.category,
      data.price,
      data.quantity,
      data.low_stock_threshold,
      Number(id)
    ),

  deleteProduct: (id) => stmtDelete.run(Number(id)),
};
