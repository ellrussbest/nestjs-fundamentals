# Docker

---

```bash
docker compose up -d
docker compose down -v
docker compose rm <service-name> -fsv
docker compose config
docker volume ls
docker volume rm <volume-name>
docker compose down -v --remove-orphans
```

# Prisma

---

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma migrate deploy
npx prisma studio
npx prisma -v # know your platform information
```

Perfect — you want a clean, step-by-step Markdown guide like your example, but this time including the relevant **SQL / psql commands**.

Here’s a concise, production-style version you can use 👇

---

# 🐘 PostgreSQL Setup Guide (Ubuntu)

---

### 1. Locate the `pg_hba.conf` file

```bash
sudo -u postgres psql -c "SHOW hba_file;"
```

### 2. Update authentication method

Edit the file (e.g. `/etc/postgresql/14/main/pg_hba.conf`):

```
local   all             postgres                                md5
```

Restart PostgreSQL:

```bash
sudo systemctl restart postgresql
```

---

### 3. Log in as the postgres superuser

```bash
psql -U postgres
```

### 4. Set a password for the postgres role

```sql
ALTER USER postgres WITH PASSWORD 'StrongPasswordHere';
```

---

### 5. Update admin connections (optional)

Edit `pg_hba.conf` again and change any remaining `peer` entries for admin/database access to `md5`, then restart:

```bash
sudo systemctl restart postgresql
```

---

### 6. Create a new database and user

```sql
CREATE DATABASE mydb;
CREATE USER testuser WITH PASSWORD 'TestUserPassword';
ALTER DATABASE mydb OWNER TO testuser;
GRANT ALL PRIVILEGES ON DATABASE mydb TO testuser;
```

---

### 7. Connect to the new database

```sql
\c mydb
```

---

### 8. Fix schema ownership and permissions

```sql
ALTER SCHEMA public OWNER TO testuser;
GRANT ALL ON SCHEMA public TO testuser;
```

---

✅ **Done!**
You can now connect with:

```bash
psql -U testuser -d mydb -h localhost -W
```

---

Another way to do the above automatically (to be tested)

```bash
sudo -u postgres createuser -P testuser
sudo -u postgres createdb testdb -O testuser
```

# Nest

```bash
nest new <project-name>
nest g module <module-name>
nest g service <service-name>
nest g service <service-name> --no-spec # if you don't want spec files
```

# dontenv-cli

```bash
dotenv -- node app.js # run node app.js with variables from .env
dotenv -e .env.test -- node app.js # run node app.js with variables from .env.test
dotenv -- pnpm prisma migrate deploy # run prisma migrate with .env loaded
dotenv -e .env.test -- pnpm prisma migrate deploy # run prisma migrate with .env.test loaded
dotenv -e .env.test -- pnpx prisma studio
```

## Dependency Injection?

**Dependency Injection (DI)** is a **design pattern** where an object (usually a class) **receives** the objects it depends on (called **dependencies**) from an external source, rather than creating them itself.

In other words, **instead of creating your own tools, you're handed them** — usually by a framework like NestJS.

This makes your code:

- More **modular**
- Easier to **test**
- Easier to **maintain**

---

## In NestJS: DI in Action

In NestJS, when you write something like this:

```ts
@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}
}
```

You're telling NestJS:

> “Hey Nest, this `UserService` class needs a `DatabaseService`. Please give it to me.”

NestJS takes care of:

- Instantiating `DatabaseService`
- Figuring out when and how to inject it
- Managing its lifecycle (singleton, etc.)

---

## What does `@Injectable()` mean?

The `@Injectable()` decorator marks a **class** as **available for dependency injection**.

If a class is **not** marked `@Injectable()`, NestJS won’t be able to inject it anywhere else.

So, when you write:

```ts
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
}
```

You're saying:

> “NestJS, please make this class available to others via DI, and also inject any dependencies it needs (like `UserService`) when creating it.”

---

## What happens under the hood?

When you use `@Injectable()`, NestJS:

1. Registers the class as a **provider** in its **DI container**.
2. Analyzes its constructor parameters using **TypeScript metadata** to know which classes it depends on.
3. Automatically injects those dependencies when instantiating it.

---

## Without DI (Manual way):

Without DI, you’d have to wire everything yourself:

```ts
const db = new DatabaseService();
const user = new UserService(db);
```

With NestJS + DI:

```ts
@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}
}
```

…and Nest does the wiring for you.

---

## TL;DR

- **`@Injectable()`** tells NestJS that the class can **participate in DI** (can **receive dependencies** and be **injected elsewhere**).
- DI allows Nest to **manage your dependencies for you** — you don’t `new` them up manually.
- This makes your app more **modular**, **testable**, and **clean**.

---

## Types of Testing

- **Unit Testing** – Tests individual parts of the code (like functions or components) to make sure each one works correctly on its own.
- **Integration Testing** – Checks how different parts of the system (like a component interacting with an API or a function calling another module) work together to ensure combined functionality behaves as expected.
- **End-to-End (E2E) Testing** – Simulates real user scenarios (like logging in, adding an item to a cart, or submitting a form) from start to finish, verifying that the entire application flow works correctly.
