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
├── docker-compose.yml    # Infrastructure orchestrator
├── playwright.config.ts  # E2E test configuration
├── tests/                # Playwright E2E test suite
├── init-db/              # SQL initialization scripts
├── wn-falcon-reader/     # Reader Micro-app
│   ├── client/           # Frontend (React + Vitest)
│   └── server/           # Backend (Express + Supertest)
└── wn-falcon-writer/     # Writer Micro-app
    ├── client/           # Frontend (React + Vitest)
    └── server/           # Backend (Express + Supertest)
```

## 🧪 Tests

The project implements somes tests to ensure reliability across all layers :

### End-to-End (E2E) - Playwright

Located at the root, these tests validate the complete user workflow between microservices.

    Workflow: Creates an article via the Writer Dashboard (8080) and verifies its immediate availability on the Reader Portal (8081).

    Run: npx playwright test
    With UI interface : npx playwright test --ui

### Backend Integration Tests - Vitest & Supertest

Located in the server/ directories of each micro-app.

    Scope: Validates API endpoints, database interactions (TypeORM), and business logic (Article for writer and Comment for reader).

    Run inside server folders : npm test (the app must be running)

### Frontend Unit Tests - Vitest & React Testing Library

Located in the client/ directories.

    Scope: Ensures UI components render correctly and handle user events as expected.

    For writer : client/src/components/articleForm
    For reader : client/src/components/articleCard

    Run inside client folders : npm test (the app must be running)

## 🚀 Continuous Integration (CI) & Workflow

This project leverages GitHub Actions to ensure code stability and reliability. Every push or pull request targeting the **main** branch triggers an automated verification pipeline:

    Quality Control: Runs the Linter to enforce coding standards and maintain style consistency.

    Unit and Integration Testing (Vitest): The infrastructure automatically boots the backend and waits for it to be ready using start-server-and-test before running component and API tests. This ensures the frontend and backend communicate correctly without relying on mocks.

    E2E Testing (Playwright): Full validation of user journeys within a real headless browser.

### 🛡️ Protected Branches

The **main** branch is protected to maintain high software quality:

    No direct pushes: All changes must be submitted via a Pull Request.

    Status Checks: Pull Requests can only be merged if all CI checks pass successfully.

    Stability: This prevents regressions or major bugs from being deployed to testing or production environments.
