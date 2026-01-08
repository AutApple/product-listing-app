# Product Listing App

Product listing application. Client is currently in development (client-dev branch).

## Features
- User authentication and authorization
- REST API for core domain logic
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

### Run locally
```bash
docker compose up --build
