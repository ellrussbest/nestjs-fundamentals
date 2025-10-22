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

# Nest

```bash
nest new <project-name>
nest g module <module-name>
nest g service <service-name>
nest g service <service-name> --no-spec # if you don't want spec files
```

## Dependency Injection?

**Dependency Injection (DI)** is a **design pattern** where an object (usually a class) **receives** the objects it depends on (called **dependencies**) from an external source, rather than creating them itself.

In other words, **instead of creating your own tools, you're handed them** — usually by a framework like NestJS.

This makes your code:

* More **modular**
* Easier to **test**
* Easier to **maintain**

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

* Instantiating `DatabaseService`
* Figuring out when and how to inject it
* Managing its lifecycle (singleton, etc.)

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

* **`@Injectable()`** tells NestJS that the class can **participate in DI** (can **receive dependencies** and be **injected elsewhere**).
* DI allows Nest to **manage your dependencies for you** — you don’t `new` them up manually.
* This makes your app more **modular**, **testable**, and **clean**.

---

## Types of testing
- Unit testing
- Integration testing
- E2E testing