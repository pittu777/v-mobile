# Backend API

The Express server keeps the existing MongoDB-backed Todo API and provides seeded sample data for the Shop, Cart, Orders, and Profile screens. The commerce/profile fixtures are read-only and live in `data/seedData.js`; no extra database collections are required.

## Run

1. Copy `.env.example` to `.env` and set `MONGO_URL` for the Todo API.
2. Install dependencies with `npm install`.
3. Start the server with `npm run dev` or `npm start`.
4. Set the app's `EXPO_PUBLIC_API_URL` to the reachable backend base URL (without `/api`).

## Routes

| Method | Path | Response |
| --- | --- | --- |
| GET | `/api/health` | `{ "status": "ok" }` |
| GET | `/api/products` | Seeded product list |
| GET | `/api/cart` | Seeded cart items with product details |
| GET | `/api/orders` | Seeded order history |
| GET | `/api/profile` | Seeded profile and summary values |
| GET | `/api/todos` | Todo list from MongoDB |
| POST | `/api/create` | Create a todo from `{ "title": "..." }` |
| PUT | `/api/todos/:id` | Update a todo |
| DELETE | `/api/todos/:id` | Delete a todo |

The sample commerce endpoints return the same seed data after each server restart. They do not change cart contents or place orders.
