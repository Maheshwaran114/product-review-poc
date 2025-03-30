# 🛍️ Product Review POC

This is a full-stack Product Review Platform built as a Proof of Concept (POC). It enables users to browse products, view details, and submit reviews. The project uses a modern tech stack including **React**, **Express**, **PostgreSQL**, and **Prisma**, and is containerized with **Docker**.

---

## 📦 Project Structure

```
product-review-poc/
├── backend/               # Node.js + Express + Prisma backend
│   ├── src/
│   └── prisma/
├── frontend/
│   └── frontend-app/      # React frontend
└── docs/
    └── api/openapi.yaml   # Swagger/OpenAPI Specification
```

---

## 🚀 Features

- Product listing with detail view
- Review submission with live form
- Affiliate token generation (backend)
- PostgreSQL + Prisma ORM
- Fully documented REST API (OpenAPI Spec)
- Responsive and styled UI

---

## 🧪 Local Development

### Prerequisites

- Node.js v18+
- PostgreSQL
- Docker (optional for containerized setup)

### Run Backend

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### Run Frontend

```bash
cd frontend/frontend-app
npm install
npm start
```

---

## 🌐 API Documentation

- OpenAPI YAML: `/docs/api/openapi.yaml`
- You can view the documentation using [Swagger Editor](https://editor.swagger.io/)

---

## 🐳 Docker Support

```bash
docker-compose up --build
```

> Note: Dockerfiles are located in the root directory for both frontend and backend.

---

## 📂 Tech Stack

- Frontend: React, JSX, CSS Modules
- Backend: Node.js, Express, Prisma ORM
- Database: PostgreSQL
- Docs: OpenAPI (Swagger)
- Dev Tools: Docker, Postman, Prisma Studio

---

## 👥 Contributors

- Frontend Lead: [Your Name]
- Backend Lead: [Your Name]
- Product Owner: [Your Name]
