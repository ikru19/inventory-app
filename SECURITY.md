# Security Threat Analysis — Inventory Management System
Prepared by: Ikra Islam (Student ID: 24202007)

This document identifies security threats relevant to a web-based Inventory
Management System and explains how each is addressed (or should be addressed)
in this project.

## 1. SQL Injection
**Threat:** An attacker enters malicious SQL in a form field (e.g. product
name `'; DROP TABLE products; --`) to manipulate or destroy the database.
**Mitigation:** All database queries use **parameterized/prepared statements**
via `better-sqlite3` (see `db.js`). User input is never concatenated directly
into SQL strings, so injected SQL is treated as plain data, not code.

## 2. Cross-Site Scripting (XSS)
**Threat:** An attacker stores a script tag as a "product name" (e.g.
`<script>alert('hacked')</script>`), which then executes in the browser of
anyone viewing the inventory list, potentially stealing session cookies.
**Mitigation:** EJS's `<%= %>` output tag **auto-escapes HTML** by default, so
any HTML/JS entered by a user is rendered as harmless text, not executed.

## 3. Cross-Site Request Forgery (CSRF)
**Threat:** A malicious website tricks a logged-in admin's browser into
submitting a hidden form to `/products/delete/:id`, deleting inventory
without their knowledge.
**Mitigation / Recommendation:** For production use, add a CSRF-token
middleware (e.g. `csurf` or double-submit cookie pattern) so state-changing
POST requests are only accepted if a valid token issued by the server is
present.

## 4. Broken Authentication & Authorization
**Threat:** Currently the app has no login system — anyone with the URL can
add/edit/delete inventory. In a real deployment this could allow unauthorized
stock manipulation (e.g. a competitor deleting all products).
**Mitigation / Recommendation:** Add authentication (e.g. `express-session` +
hashed passwords with `bcrypt`) and role-based authorization so only staff
accounts can modify inventory, and viewers can only read.

## 5. Insecure Direct Object Reference (IDOR)
**Threat:** Product edit/delete routes use a raw numeric ID
(`/products/edit/3`). Without authorization checks, any user could guess IDs
and modify records that aren't theirs.
**Mitigation:** The app validates that the referenced product actually exists
before performing an update/delete, and returns `404` otherwise. In a
multi-tenant system, ownership checks should also be added.

## 6. Improper Input Validation
**Threat:** Negative prices, negative stock quantities, or excessively long
strings could corrupt data or be used for further attacks (buffer/字符串-based
attacks, display glitches).
**Mitigation:** `server.js` validates all incoming data server-side
(`validateProduct`) — checking types, ranges (price ≥ 0, quantity ≥ 0), and
maximum string length — in addition to basic HTML5 client-side validation
(`required`, `min`, `type="number"`).

## 7. Sensitive Data Exposure
**Threat:** Error messages or stack traces leaking internal file paths or
database structure to attackers.
**Mitigation / Recommendation:** In production, disable Express's default
verbose error pages (`NODE_ENV=production`) and log detailed errors only
server-side, showing generic messages to users.

## 8. Clickjacking & MIME-sniffing
**Threat:** The app being embedded in a malicious `<iframe>` to trick users
into clicking hidden delete/edit buttons, or browsers misinterpreting file
types.
**Mitigation:** Response headers `X-Frame-Options: DENY` and
`X-Content-Type-Options: nosniff` are set on every response (see
`server.js`).

## 9. Denial of Service (DoS) via Unlimited Requests
**Threat:** An attacker scripts repeated POST requests to spam the database
with fake products.
**Mitigation / Recommendation:** Add rate-limiting middleware (e.g.
`express-rate-limit`) in production to cap requests per IP per minute.

## Summary Table

| # | Threat | Status |
|---|--------|--------|
| 1 | SQL Injection | ✅ Mitigated (prepared statements) |
| 2 | XSS | ✅ Mitigated (EJS auto-escaping) |
| 3 | CSRF | ⚠️ Recommended for production |
| 4 | Broken Auth/Authorization | ⚠️ Recommended for production |
| 5 | IDOR | ✅ Partially mitigated (existence checks) |
| 6 | Input Validation | ✅ Mitigated (server-side validation) |
| 7 | Sensitive Data Exposure | ⚠️ Recommended for production |
| 8 | Clickjacking / MIME sniffing | ✅ Mitigated (security headers) |
| 9 | DoS / Spam | ⚠️ Recommended for production |
