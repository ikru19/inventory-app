// db.js
// Sets up SQLite database and exports safe, prepared-statement based functions.
// Using better-sqlite3 with prepared statements protects against SQL Injection (CO2 threat #1).

const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'inventory.db'));

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
const stmts = {
  getAll: db.prepare('SELECT * FROM products ORDER BY id DESC'),
  getById: db.prepare('SELECT * FROM products WHERE id = ?'),
  insert: db.prepare(
    `INSERT INTO products (name, category, price, quantity, low_stock_threshold)
     VALUES (@name, @category, @price, @quantity, @low_stock_threshold)`
  ),
  update: db.prepare(
    `UPDATE products
     SET name = @name, category = @category, price = @price,
         quantity = @quantity, low_stock_threshold = @low_stock_threshold
     WHERE id = @id`
  ),
  remove: db.prepare('DELETE FROM products WHERE id = ?'),
};

module.exports = {
  getAllProducts: () => stmts.getAll.all(),
  getProductById: (id) => stmts.getById.get(id),
  addProduct: (data) => stmts.insert.run(data),
  updateProduct: (id, data) => stmts.update.run({ ...data, id }),
  deleteProduct: (id) => stmts.remove.run(id),
};
