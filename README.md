# Backend Assessment – Event Driven System

This project implements a backend system that processes CSV uploads, stores records in PostgreSQL, publishes events to Kafka, and updates a Redis cache via a consumer service.

Note: Prisma migrations are committed to the repository and applied using `prisma migrate deploy` to ensure consistent database setup.

## Prerequisites

- Node.js (>=18)
- pnpm
- Docker & Docker Compose

## Architecture

CSV Upload API
↓
PostgreSQL
↓
Kafka Event
↓
Consumer Service
↓
Redis Cache
↓
Fetch API with Cache Fallback

## Tech Stack

- Node.js
- Express
- PostgreSQL
- Prisma
- Kafka (KafkaJS)
- Redis (ioredis)
- Docker

---

## Project Structure

instasupply-interview-assignment
│
├── api
│   ├── src
│   │   ├── routes
│   │   │   ├── upload.route.js
│   │   │   └── fetch.route.js
│   │   │
│   │   ├── app.js          # Express application setup (routes, middleware)
│   │   └── server.js       # Starts the HTTP server
│   │
│   └── tests
│       └── api.test.js     # Basic API tests using Jest + Supertest
│
├── consumer
│   └── consumer.js         # Kafka consumer service that updates Redis cache
│
├── docker-compose.yml      # Local infrastructure (PostgreSQL, Redis, Kafka)
│
├── postman_collection.json # Postman collection to easily test the APIs
│
├── instasupply.csv         # Sample CSV file for testing the upload endpoint
│
└── README.md


---

## Setup Instructions

### Configure environment variables

Copy the example environment file:

Step 1 : In api directory .env would be created by Prisma, just add the remaining value from env.example file in API directory
cp .env.example .env

Step 2 : In root directory, just copy paste the .env.example content to .env file 
cp .env.example .env 


### 1. Start infrastructure

`docker compose up -d`

This starts:

- PostgreSQL
- Redis
- Kafka
- Zookeeper

---

### 2. Install dependencies

API
`cd api`
`pnpm install`

Consumer
`cd consumer`
`pnpm install`

---


### 3. Apply database migrations

Run the following command inside the API service:

`cd api`
`pnpm prisma migrate deploy`

This applies the committed Prisma migrations and creates the required database tables.

### 4. Generate Prisma client

`cd api`
`pnpm prisma generate`


This generates the Prisma client used by the API.

### 5. Start the API server

`pnpm start`

Server will start on:

http://localhost:5000

---

### 6. Start the Kafka consumer

Open another terminal and run:

`cd consumer`
`node consumer.js`


This service listens to Kafka events and updates the Redis cache.

---


## API Endpoints

### Upload CSV

POST /upload

PAYLOAD :

Upload a CSV file containing:
name,email
john,john@test.com
roger,roger@test.com

RESPONSE :

{
"status": "success",
"rowsProcessed": 2
}


---

### Fetch Records

GET /records

Returns records from Redis cache if available, otherwise from PostgreSQL.

Example response:

{
"source": "cache",
"data": [...]
}


---

## Event Flow

1. CSV uploaded via API
2. Records saved to PostgreSQL
3. Kafka event published
4. Consumer receives event
5. Redis cache updated
6. Fetch API serves cached data

---

## Running Redis CLI

```bash
docker exec -it redis redis-cli
GET records:all
DEL records:all
```


## Testing the APIs

To make testing easier, the repository includes:

- **Postman Collection (`postman_collection.json`)**
- **Sample CSV file (`instasupply.csv`)**

### Using the Postman Collection

1. Open **Postman**.
2. Click **Import**.
3. Select the file `postman_collection.json`.
4. Use the included requests to test the following endpoints:
   - **Upload CSV**
   - **Fetch records**

### Sample CSV

You can use the provided CSV file when testing the upload endpoint.

Example CSV content:

```csv
name,email
john,john@test.com
roger,roger@test.com