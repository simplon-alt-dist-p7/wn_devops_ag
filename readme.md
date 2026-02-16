# 🌍 World News - Microservices & Microfrontends Orchestration

This project represents the individual technical validation phase. The objective is to assemble, containerize, and automate a complete architecture consisting of two distinct micro-apps: Reader and Writer.

## 🏗️ System Architecture

The application is divided into 5 autonomous services, each isolated within its own Docker container:

    db: PostgreSQL 15 database (hosting reader and writer schemas).

    writer-back: Content Management API (Writer Microservice).

    writer-front: Editorial Dashboard (Writer Microfrontend).

    reader-back: High-performance Consultation API (Reader Microservice).

    reader-front: Public News Portal (Reader Microfrontend).

## 🚀 Quick Start (Docker Compose)

The project strictly adheres to the single-command launch requirement. The entire environment (database, APIs, and Frontends) initializes automatically.
You need to have Docker Desktop installed.
Bash

### From the monorepo root

```
docker compose up --build
```

### Service Access:

    Reader Portal (Front): http://localhost:8081

    Writer Dashboard (Front): http://localhost:8080

    Writer API: http://localhost:3002

    Reader API: http://localhost:3001

## 🛠️ Implementation Details

### 1. Containerization (Dockerfiles)

Each service features an optimized, standalone Dockerfile:

    Backends: Built on node:20-alpine for a minimal footprint.

    Frontends: Multi-stage builds (Node compilation followed by Nginx serving) for production-grade performance.

### 2. Orchestration & Networking

The docker-compose.yml file centralizes the infrastructure. It manages:

    Port Mapping: Prevention of port conflicts between micro-apps.

    Healthchecks: Ensures services only attempt to connect once the database is fully ready.

    Resilience: Implementation of restart: always for continuous uptime.

## 🗃️ Monorepo Structure

```
world-news/
├── docker-compose.yml # Infrastructure orchestrator
├── init-db/ # SQL initialization scripts
├── .gitignore # Global Git exclusion config
├── wn-falcon-reader/ # Reader Micro-app
│ ├── client/ # Frontend + Dockerfile
│ └── server/ # Backend + Dockerfile
└── wn-falcon-writer/ # Writer Micro-app
├── client/ # Frontend + Dockerfile
└── server/ # Backend + Dockerfile
```
