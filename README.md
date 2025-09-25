# Ecommerce Template

Template modular para ecommerce con React + Tailwind v4 (frontend), Spring Boot + JPA (backend), PostgreSQL (DB).

## Prerrequisitos
- Node.js 20+ (frontend)
- JDK 21 (backend)
- PostgreSQL 17 (crea DB `ecommerce_db` con user `postgres`)

## Setup
1. Clona: `git clone <url> .`
2. Frontend: `cd client && npm install && npm run dev` (abre localhost:5173)
3. Backend: Edita `server/src/main/resources/application.properties` (DB password), luego `cd server && ./mvnw spring-boot:run` (abre localhost:8080)

## Troubleshooting
- **Frontend**: Si Tailwind no aplica, verifica import de `globals.css` en `main.jsx` y `postcss.config.js` con `@tailwindcss/postcss`.
- **Backend**: Si `./mvnw spring-boot:run` falla (exit code 1), verifica Postgres running (`psql -U postgres -d ecommerce_db`) y usa `./mvnw spring-boot:run -e -X` para debug.

## Reutilización
- Clona este repo para nuevo proyecto.
- Ajusta DB configs en `application.properties`.
- Personaliza Tailwind en `tailwind.config.js` (opcional).
- Usa ramas (`git checkout -b feat/nueva-feature`) para desarrollo.

Basado en buenas prácticas: arquitectura en capas (UI, lógica, datos), versionado semántico, documentación clara.