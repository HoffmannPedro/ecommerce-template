# Ecommerce Template

Template modular para ecommerce con React + Tailwind v4 (frontend), Spring Boot + JPA (backend), PostgreSQL (DB).

## Prerrequisitos
- Node.js 20+ (frontend)
- JDK 21 (backend)
- PostgreSQL 17 (crea DB `ecommerce_db`)

## Setup
1. Clona: `git clone <url> .`
2. Frontend: `cd client && npm install && npm run dev` (localhost:5173)
3. Backend: Edita `server/src/main/resources/application.properties` (DB password), luego `cd server && ./mvnw spring-boot:run` (localhost:8080)

## Modelos de Datos
- Entidades: `Category` (id, name), `Product` (id, name, price, category_id).
- Relación: 1:N (una categoría, muchos productos).
- JPA: Tablas creadas automáticamente (`spring.jpa.hibernate.ddl-auto=update`).

## APIs REST
- GET `/api/products`: Lista productos.
- POST `/api/products`: Crea producto (JSON: `{"name": "string", "price": number, "category": {"id": number}}`).
- GET `/api/categories`: Lista categorías.
- POST `/api/categories`: Crea categoría (JSON: `{"name": "string"}`).
- Prueba con Postman o `curl http://localhost:8080/api/...`.

## Troubleshooting
- Frontend: Verifica `index.css` en `main.jsx` y `@tailwindcss/postcss`.
- Backend: Verifica Postgres (`psql -U postgres -d ecommerce_db`), usa `./mvnw spring-boot:run -e -X`.
- APIs: Si 404, asegura backend corriendo en 8080.

## Reutilización
- Clona repo, ajusta DB configs.
- Expande APIs en `controller/`, lógica en `service/`.
- Usa ramas (`git checkout -b feat/nueva-feature`).