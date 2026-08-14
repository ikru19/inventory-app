// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// ---- Middleware ----
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Basic security headers (helps against clickjacking / MIME sniffing - see SECURITY.md)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// ---- Helper: server-side input validation ----
function validateProduct(body) {
  const errors = [];
  const name = (body.name || '').trim();
  const category = (body.category || '').trim();
  const price = parseFloat(body.price);
  const quantity = parseInt(body.quantity, 10);
  const low_stock_threshold = parseInt(body.low_stock_threshold, 10) || 5;

  if (!name || name.length > 100) errors.push('Valid product name is required (max 100 chars).');
  if (isNaN(price) || price < 0) errors.push('Price must be a positive number.');
  if (isNaN(quantity) || quantity < 0) errors.push('Quantity must be a positive integer.');

  return { errors, data: { name, category, price, quantity, low_stock_threshold } };
}

// ---- Routes ----

// READ - list all products
app.get('/', (req, res) => {
  const products = db.getAllProducts();
  res.render('index', { products, message: null });
});

// CREATE - show form
app.get('/products/add', (req, res) => {
  res.render('form', { product: null, errors: [] });
});

// CREATE - handle submit
app.post('/products/add', (req, res) => {
  const { errors, data } = validateProduct(req.body);
  if (errors.length) {
    return res.status(400).render('form', { product: req.body, errors });
  }
  db.addProduct(data);
  res.redirect('/');
});

// UPDATE - show form pre-filled
app.get('/products/edit/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) return res.status(404).send('Product not found');
  res.render('form', { product, errors: [] });
});

// UPDATE - handle submit
app.post('/products/edit/:id', (req, res) => {
  const existing = db.getProductById(req.params.id);
  if (!existing) return res.status(404).send('Product not found');

  const { errors, data } = validateProduct(req.body);
  if (errors.length) {
    return res.status(400).render('form', { product: { ...req.body, id: req.params.id }, errors });
  }
  db.updateProduct(req.params.id, data);
  res.redirect('/');
});

// DELETE
app.post('/products/delete/:id', (req, res) => {
  const existing = db.getProductById(req.params.id);
  if (!existing) return res.status(404).send('Product not found');
  db.deleteProduct(req.params.id);
  res.redirect('/');
});

// 404 handler
app.use((req, res) => res.status(404).render('404'));

app.listen(PORT, () => {
  console.log(`Inventory Management System running at http://localhost:${PORT}`);
});
