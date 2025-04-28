# ProjectMark - TakeHome

A Node.js/TypeScript REST API that lets you create **hierarchical “topics”** (with version history) and manage **users & roles (Admin | Editor | Viewer)**.  
It uses **Express**, **TypeORM**, **JWT authentication**, and ships with out-of-the-box validation, RBAC, and a seeder.

---

## Table of contents

1. [Features](#features)
2. [Quick start](#quick-start)
3. [Configuration](#configuration)
4. [Database setup](#database-setup)
5. [Running the project](#running-the-project)
6. [Seeding & migrations](#seeding--migrations)
7. [Authentication workflow](#authentication-workflow)
8. [Useful npm scripts](#useful-npm-scripts)
9. [Troubleshooting](#troubleshooting)

---

## Features

| Area           | Details                                                                     |
| -------------- | --------------------------------------------------------------------------- |
| **Topics**     | CRUD, tree retrieval, composite pattern, version history                    |
| **Auth**       | Email + password login, JWT (HS256, 1-hour expiry)                          |
| **RBAC**       | _Admin_ (full), _Editor_ (write), _Viewer_ (read-only) via Strategy pattern |
| **Validation** | `class-validator` DTO validation + custom middlewares                       |
| **Database**   | Works with SQLite (default) or Postgres; TypeORM migrations & factories     |
| **Testing**    | Jest + Supertest (not shown here but scaffolded)                            |
| **Docker**     | Optional compose file with Node container + Postgres                        |

---

## Quick start

```bash
# 1. Clone & install
git clone https://github.com/your-org/knowledge-base-api
cd knowledge-base-api
npm install

# 2. Copy environment template
cp .env.example .env

# 3. Run the dev server
npm run dev
```

The API will start on **http://localhost:3000** (env `PORT`).

---

## Configuration

All runtime settings live in **`.env`**.

| Variable     | Example                                                                 | Purpose                                    |
| ------------ | ----------------------------------------------------------------------- | ------------------------------------------ |
| `NODE_ENV`   | `development`                                                           | Mode (`development`, `test`, `production`) |
| `PORT`       | `3000`                                                                  | HTTP port                                  |
| `JWT_SECRET` | `super-secret-key`                                                      | Symmetric key for JWT signing              |
| `DB_TYPE`    | `sqlite` \| `postgres`                                                  | Database driver                            |
| `DB_URL`     | `sqlite:///database.sqlite` \| `postgres://user:pass@localhost:5432/db` | Full connection string                     |

> **Tip** – Only `DB_URL` is required; `DB_TYPE` is auto-parsed from the URL.

---

## Database setup

### SQLite (default, zero-config)

```bash
# database.sqlite will be created in the project root
npm run dev
```

### Postgres (Docker or local)

1. Create a database:

   ```bash
   createdb knowledge_base
   ```

2. Update `.env`:

   ```
   DB_URL=postgres://postgres:postgres@localhost:5432/knowledge_base
   ```

3. Run migrations / seed (see below).

### Docker Compose (Node + Postgres)

```bash
docker compose up -d   # spins Postgres on port 5432, Node on 3000
```

> **compose.yaml** is pre-configured with volumes so your data persists.

---

## Running the project

| Command                      | What it does                                    |
| ---------------------------- | ----------------------------------------------- |
| `npm run dev`                | Start with **ts-node-dev** (watch mode, SQLite) |
| `npm run build && npm start` | Compile to `dist/` and run with Node            |
| `docker compose up --build`  | Production-style build with Postgres            |

---

## Seeding & migrations

```bash
# Run all pending migrations
npm run typeorm migration:run

# Seed default users (Admin / Editor / Viewer) and sample topics
npm run seed
```

Seeder location: `src/seed.ts` (uses TypeORM transaction + factories).

---

## Authentication workflow

1. **Register or login**

   ```http
   POST /api/auth/register     # body: { name, email, password }
   POST /api/auth/login        # body: { email, password }
   ```

   ```jsonc
   // Response
   { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..." }
   ```

2. **Authenticated requests**

   Add the token to the **Authorization** header:

   ```
   Authorization: Bearer <token>
   ```

3. **Protected routes**

   All routes under `/api/*` except `/api/auth/*` pass through:

   - `authenticate` – verifies JWT, attaches `req.user` (`TokenPayload`)
   - `authorize(<action>)` – checks role against the **PermissionContext**

   Example:

   ```http
   GET /api/topics/e43d...             # Viewer or higher
   POST /api/topics                    # Editor or Admin
   DELETE /api/topics/:id              # Admin only
   ```

---

## Useful npm scripts

| Script  | Description                     |
| ------- | ------------------------------- |
| `dev`   | Run in watch mode (ts-node-dev) |
| `start` | Run compiled JavaScript (dist)  |
| `build` | Transpile TypeScript            |
| `test`  | Run unit + integration tests    |
| `seed`  | Execute the seeder              |
| `lint`  | ESLint + Prettier               |

---

## Troubleshooting

| Symptom                                                                       | Fix                                                                                                                                                             |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **“Supported only in tree entities”** when fetching descendants               | Ensure the entity is annotated with `@Tree("closure-table")` and the repository is acquired via `AppDataSource.getTreeRepository(Topic)`                        |
| **“TypeError: Converting circular structure to JSON”** when returning a Topic | Don’t return raw entities; instead map to a DTO or use `class-transformer`’s `Exclude` / `@Transform` decorators                                                |
| **Validation errors report empty strings**                                    | Make sure your DTOs use `@Transform(({ value }) => value?.trim())` for all string props (utility function shown in `src/shared/transformers/trim.transform.ts`) |
| **Enum vs string mismatch (`UserRole`)**                                      | Store `enum UserRole` in the entity: `@Column({ type: 'text', enum: UserRole }) role: UserRole`                                                                 |

---

### Need help?

Open an issue or ping **@andre-gervasio** on the repo. Happy coding! 🎉
