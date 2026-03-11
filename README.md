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

interview-assignment
│
├── api
│ ├── src
│ │ ├── routes
│ │ │ ├── upload.js
│ │ │ └── fetch.js
│ │ └── server.js
│
├── consumer
│ └── consumer.js
│
├── docker-compose.yml
└── README.md


---

## Setup Instructions

### Configure environment variables

Copy the example environment file:

=> In api directory .env would be created by Prisma, just add the remaining value from env.example file in API directory
cp .env.example .env

=> In root directory, just copy paste the .env.example content to .env file 
cp .env.example .env 


### 1. Start infrastructure

docker compose up -d

This starts:

- PostgreSQL
- Redis
- Kafka
- Zookeeper

---

### 2. Install dependencies

API
cd api
pnpm install

Consumer
cd ../consumer
pnpm install

---


### 3. Apply database migrations

Run the following command inside the API service:

cd api
pnpm prisma migrate deploy

This applies the committed Prisma migrations and creates the required database tables.

### 4. Generate Prisma client

cd api
pnpm prisma generate


This generates the Prisma client used by the API.

### 5. Start the API server

pnpm start

Server will start on:

http://localhost:5000

---

### 6. Start the Kafka consumer

Open another terminal and run:

cd consumer
node consumer.js


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

Command 1 : docker exec -it redis redis-cli  ( in terminal)

Command 2 : GET records:all