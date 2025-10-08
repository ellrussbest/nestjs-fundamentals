# Docker

---

```bash
docker compose up -d
docker compose down -v
docker compose rm <service-name> -fsv
```

# Prisma

---

```bash
npx prisma generate
npx prisma migrate dev --name init
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
