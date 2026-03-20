# 🌍 World News - Microservices & Microfrontends Orchestration

This project represents the individual technical validation phase. The objective is to assemble, containerize, and automate a complete architecture consisting of two distinct micro-apps: Reader and Writer.

## 🏗️ System Architecture

The application is divided into 5 autonomous services, each isolated within its own Docker container:

    Database: PostgreSQL 15 database (hosting reader and writer schemas).

    Writer-back: Content Management API (Writer Microservice).

    Writer-front: Editorial Dashboard (Writer Microfrontend).

    Reader-back: High-performance Consultation API (Reader Microservice).

    Reader-front: Public News Portal (Reader Microfrontend).

## 📂 Monorepo Structure

```
world-news/
├── .github/workflows/    # CI/CD (GitHub Actions)
├── .husky/               # Git hooks (pre-commit linting & pre-push testing)
├── init-db/              # SQL initialization scripts
├── tests/                # Playwright E2E test suite
├── wn-falcon-reader/     # Reader Micro-app
│   ├── client/           # Frontend (React + Vitest + Stryker)
│   └── server/           # Backend (Express + Supertest)
├── wn-falcon-writer/     # Writer Micro-app
│   ├── client/           # Frontend (React + Vitest)
│   └── server/           # Backend (Express + Supertest)
├── docker-compose.yml    # Infrastructure orchestrator
└── playwright.config.ts  # E2E test configuration
```

## ☁️ Deployment

The project is managed as a monorepo and is deployed on Render across 5 distinct services.

### Service mapping

To deploy each micro-app, the Root Directory must be specified in the Render settings to ensure the build system points to the correct sub-folder.

|   Service    |                 URL                  | Service type |     Root Directory      |
| :----------: | :----------------------------------: | :----------: | :---------------------: |
|   Database   |                                      |   Postgres   |    /init-db (Manual)    |
| Writer-back  | https://wn-writer-back.onrender.com  | Web Service  | wn-falcon-writer/server |
| Writer-front | https://wn-front-writer.onrender.com | Static Site  | wn-falcon-writer/client |
| Reader-back  | https://wn-reader-back.onrender.com  | Web Service  | wn-falcon-reader/server |
| Reader-front | https://wn-front-reader.onrender.com | Static Site  | wn-falcon-reader/client |

> **Note**: Since the project is deployed on Render's Free Plan, services may spin down after periods of inactivity. Please wait a moment for the initial "cold start" during the first access.

## 🚀 Quick Start (Docker Compose)

The project strictly adheres to the single-command launch requirement. The entire environment (database, APIs, and Frontends) initializes automatically.
You need to have Docker Desktop installed and running.

### Environment Variables (.env)

The project uses a centralized .env system for local development and specific overrides for production.

For Docker Compose to work, you must create at the root of the project :

```
.env
```

```
.env.test
```

You also required a _.env_ in the **wn-falcon-reader/client** and **wn-falcon-writer/client** for the API URL (WIP to centralize).

See the _.env.example_ to know which environnment variable you need.

### Docker Start Commands

Ensure you are in the root folder of the monorepo before running these commands.

First time or after modifying a Dockerfile / package.json :

```
docker compose up --build
```

Quick launch when no code dependencies have changed :

```
docker compose up
```

To stops and removes containers :

```
docker compose down
```

To Removes containers and volumes (wipes the DB) :

```
docker compose down -v
```

### Local Service Access:

    Reader-front: http://localhost:8081

    Writer-front: http://localhost:8080

    Writer-back: http://localhost:3002

    Reader-back: http://localhost:3001

## 🛠️ Implementation Details

### Containerization (Dockerfiles)

Each service features an optimized, standalone Dockerfile:

    Backends: Built on node:20-alpine for a minimal footprint.

    Frontends: Multi-stage builds (Node compilation followed by Nginx serving) for production-grade performance.

### Orchestration & Networking

The docker-compose.yml file centralizes the infrastructure. It manages:

    Port Mapping: Prevention of port conflicts between micro-apps.

    Healthchecks: Ensures services only attempt to connect once the database is fully ready.

    Resilience: Implementation of restart: always for continuous uptime.

## 🧪 Tests

The project implements several tests to ensure reliability across all layers :

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

### Mutation Testing (Stryker)

To ensure the robustness of our test suite, we use **Stryker Mutator**. Unlike traditional "Code Coverage" which only shows if a line is executed, Mutation Testing verifies if our tests are actually capable of detecting logical bugs.

Located in the wn-falcon-reader/client directory

    Stryker injects "Mutants" (intentional logical errors) into the source code.

    - If a test fails: the mutant is **killed** (This is good! ✅).
    - If the tests still pass: the mutant **survived** (This means a test case is missing ❌).

    Run inside wn-falcon-reader/client folder : npx stryker run

## 🪝 Quality Gate (Git Hooks)

To ensure code quality before it even reaches the repository, we use **Husky**:

- **Pre-commit**: Runs ESLint to prevent styling errors and code smells.
- **Pre-push**: Runs Unit & Integration tests to ensure no regressions are pushed.

## ☑️​ Continuous Integration (CI) & Workflow

This project leverages GitHub Actions to ensure code stability and reliability. Every push or pull request targeting the **main** branch triggers an automated verification pipeline:

    Quality Control: Runs the Linter to enforce coding standards and maintain style consistency.

    Unit and Integration Testing (Vitest): The infrastructure automatically boots the backend and waits for it to be ready using start-server-and-test before running component and API tests. This ensures the frontend and backend communicate correctly without relying on mocks.

    E2E Testing (Playwright): Full validation of user journeys within a real headless browser.

## 🛡️ Github Settings

### Protected Branches

The **main** branch is protected to maintain high software quality:

    No direct pushes: All changes must be submitted via a Pull Request.

    Status Checks: Pull Requests can only be merged if all CI checks pass successfully.

This prevents regressions or major bugs from being deployed to testing or production environments.

### Webhooks

To ensure continuous deployment, 4 Webhooks have been configured on GitHub (one for each micro-app).

    Any push or merge on the main branch automatically triggers a new build and deployment on Render for the entire ecosystem.

> **Note**: All hooks use `Content-Type: application/json` to communicate with the Render API.

### Secret Management (CI/CD)

To ensure maximum security and environment independence, no sensitive data is stored in the source code. These values are encrypted by GitHub and injected only when the CI pipeline runs:

    GitHub Secrets: Authentication credentials (DB passwords, user, names).

    GitHub Variables: Non-sensitive configuration (Ports, Hosts...).
