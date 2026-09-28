# Mini E-Commerce — Authentication & Product CRUD APIs

A full-stack e-commerce demo built for the Sheryians Coding School assignment:
secure JWT authentication (access + refresh tokens), full Product CRUD with
`express-validator` validation, and a React frontend that consumes the APIs.

## Tech Stack

| Layer     | Tools                                                            |
|-----------|------------------------------------------------------------------|
| Backend   | Node.js, Express, MongoDB (Mongoose), express-validator          |
| Auth      | JWT access + refresh tokens, bcryptjs, httpOnly cookies          |
| Frontend  | React 19, Redux Toolkit, React Router, Axios, Tailwind CSS, Vite |


The Vite dev server proxies `/api/*` to `http://localhost:5000`
(see `client/vite.config.js`), so no CORS setup is needed in development.

## Setup

### 1. Prerequisites
- Node.js 18+
- MongoDB running locally (or an Atlas connection string)

### 2. Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev               # runs on http://localhost:5000
```

Generate strong JWT secrets:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 3. Frontend

```bash
cd client
npm install
npm run dev               # runs on http://localhost:5173
```

## API Endpoints

Base URL: `/api`

### Auth

| Method | Endpoint                | Access        | Description                                  |
|--------|-------------------------|---------------|----------------------------------------------|
| POST   | `/api/auth/register`    | Public        | Create a user. Returns user only (no tokens) |
| POST   | `/api/auth/login`       | Public        | Verify password. Access token in body, refresh token in httpOnly cookie |
| POST   | `/api/auth/refresh-token` | Public*     | Verify refresh cookie, issue new access token (+ rotate refresh token) |
| POST   | `/api/auth/logout`      | Authenticated | Revoke stored refresh token + clear cookie   |
| GET    | `/api/auth/me`          | Authenticated | Return the logged-in user's profile          |

\* requires a valid refresh token cookie.

### Products

| Method | Endpoint               | Access        | Description                          |
|--------|------------------------|---------------|--------------------------------------|
| POST   | `/api/products`        | Authenticated | Create a product (owner = req.user)  |
| GET    | `/api/products`        | Public        | List products. Optional `?page=&limit=&category=` |
| GET    | `/api/products/:id`    | Public        | Get a single product (404 if missing)|
| PUT    | `/api/products/:id`    | Authenticated | Update. 404 if missing, 403 if not owner |
| DELETE | `/api/products/:id`    | Authenticated | Delete. 404 if missing, 403 if not owner |

## Auth Flow — How the Tokens Work

1. **Register** — password hashed with bcrypt (12 salt rounds), stored as
   `passwordHash`. Returns the user only; **no tokens on register**.
2. **Login** — password verified with `bcrypt.compare`. On success:
   - **Access token**: signed with `ACCESS_TOKEN_SECRET`, expires in **15 minutes**, returned in the JSON body. The frontend keeps it in `localStorage` and sends it as `Authorization: Bearer <token>`.
   - **Refresh token**: signed with `REFRESH_TOKEN_SECRET`, expires in **7 days**, stored in the DB against the user and sent as an **httpOnly, SameSite=strict cookie** scoped to `/api/auth` — JavaScript can never read it.
3. **Access token expires** → any protected call returns `401`. The axios
   response interceptor calls `/auth/refresh-token` once, stores the new access
   token, and retries the original request transparently.
4. **Refresh rotation + reuse detection** — every refresh issues a new refresh
   token and replaces the stored one. If an old (already-rotated) token shows
   up, the server treats it as stolen: it wipes the stored token, clears the
   cookie, and returns `403` (forces re-login).
5. **Logout** — deletes the stored refresh token and clears the cookie.
6. **`authenticate` middleware** — reads the Bearer access token, verifies
   signature + expiry, loads the user, and attaches it as `req.user`. All
   product write routes are protected with it.

Security notes: passwords are never logged or returned; JWT secrets live in
`.env`; refresh tokens are stored server-side so they can be revoked;

## Frontend Pages

- `/` — landing page (guests only)
- `/register` — sign-up form with client + server field-level errors
- `/login` — login form; on success stores the access token and redirects
- `/dashboard` — protected product dashboard: list with pagination + category
  filter, create/edit modal, delete with confirm, logout

Route guards verify the session with `GET /api/auth/me` before rendering
protected or guest-only pages.
