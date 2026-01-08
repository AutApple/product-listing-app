# Product Listing App

Product listing app - frontend in development (client-dev branch).

## Features
- User authentication and authorization
- REST API for core domain logic
- Advanced product filtering by attributes 
- Redis-backed caching
- PostgreSQL persistence
- Image upload and storage via AWS

## Architecture
- API: NestJS
- Client: React (indev)
- Database: PostgreSQL
- Cache: Redis

## Getting Started

### Prerequisites
- Docker
- Docker Compose

### Building the project

1. Create a `.env` file based on the example:

```bash
cp .env.example .env
```
Then edit .env to match your local configuration (ports, database credentials, AWS Settings, etc.).

2. Use Docker Compose with your custom env file:

```bash
docker compose --env-file .env up --build
```

### API Documentation

The Swagger UI API documentation is available in your local development environment at:

- **Root endpoint:** `http://localhost:3000/` (redirects to `/api`)
- **API endpoint:** `http://localhost:3000/api`
