# Inventory Management System

A simple full-stack Inventory Management System built with **Node.js, Express,
EJS, and SQLite**. Supports adding, viewing, updating, and deleting products,
and tracks stock levels with a low-stock warning badge.

Built for: CSE0613314/329 — Web Programming, Summer 2026, Chittagong
Independent University.

## Features
- Add / View / Update / Delete products
- Stock quantity tracking with low-stock alert badge
- Server-side input validation
- SQL-injection safe (prepared statements)
- XSS-safe output (EJS auto-escaping)
- Security headers (X-Frame-Options, X-Content-Type-Options)

## Tech Stack
- Node.js + Express
- EJS templating
- SQLite (via `better-sqlite3`) — no external DB server needed
- Vanilla CSS

## 1. Local Setup

```bash
git clone <your-repo-url>
cd inventory-app
npm install
npm start
```

Visit **http://localhost:3000**

The SQLite database file `inventory.db` is created automatically on first run.

## 2. Git & Version Control Workflow

To satisfy the "Git & Maintenance" rubric (proper history + at least 2
meaningful changes), follow this workflow:

```bash
# initialize repo (if not already)
git init
git add .
git commit -m "Initial commit: basic inventory CRUD system"

# create GitHub repo, then:
git remote add origin https://github.com/<your-username>/inventory-app.git
git branch -M main
git push -u origin main
```

**Example of 2 meaningful follow-up changes** (make real commits like these):

```bash
# Change 1: add low-stock alert feature
git add .
git commit -m "Add low-stock threshold and warning badge"
git push

# Change 2: add input validation / bug fix
git add .
git commit -m "Fix: add server-side validation to prevent negative price/qty"
git push
```

Keep commits small and descriptive — this is what graders check for.

## 3. Deployment

### Option A: Render.com (recommended, free tier)
1. Push your code to GitHub (see above).
2. Go to https://render.com → New → Web Service.
3. Connect your GitHub repo.
4. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Deploy. Render gives you a public URL like
   `https://inventory-app-xxxx.onrender.com`.

> Note: Render's free tier has an ephemeral filesystem, so the SQLite file
> resets on redeploy/restart. For a persistent database in production, use
> Render's paid disk add-on, or switch to a hosted database
> (e.g. Postgres on Supabase/Neon).

### Option B: Railway.app
1. Push to GitHub.
2. https://railway.app → New Project → Deploy from GitHub repo.
3. Railway auto-detects Node.js and runs `npm start`.

## 4. Project Structure
```
inventory-app/
├── server.js          # Express app & routes
├── db.js              # SQLite setup + prepared statements
├── views/              # EJS templates
│   ├── index.ejs       # Product list
│   ├── form.ejs         # Add/Edit form
│   ├── 404.ejs
│   └── partials/head.ejs
├── public/css/style.css
├── SECURITY.md          # Security threat analysis report
└── README.md
```

## 5. Report
See `SECURITY.md` for the security threat analysis required for submission.
