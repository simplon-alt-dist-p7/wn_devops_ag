# wn-falcon-reader

microservice repo for the World News reading app

## 📌 Overview

`wn-falcon-reader` is a microservice responsible for handling content reading within the World News ecosystem.  
This repository follows strict workflow and naming conventions to ensure code quality and consistency.

---

## 🔁 Git Workflow

```
main → dev → feature
```

- **main** : Production branch
- **dev** : Development branch
- **feature** : Feature-specific branches

All new developments must start from `dev` and be merged back via pull requests.

---

## 🏷️ Naming Conventions

### 🌿 Branch Naming

**Format**

```
USXX-FEATURE_NAME
```

**Example**

```
US12-ARTICLE_PAGINATION
```

---

### 📝 Commit Message Convention

Please follow these commit message templates:

- **New feature**

  ```
  [feat] : commit description
  ```

- **Fix / update**

  ```
  [fix] : commit description
  ```

- **Documentation / typo / syntax**
  ```
  [docs] : commit description
  ```

---

### 📂 General Naming Rules

| Element               | Convention       |
| --------------------- | ---------------- |
| Variables             | `camelCase`      |
| Environment variables | `YOUR_VARIABLE`  |
| Folders               | `nom-du-dossier` |
| Component files       | `camelCase`      |
| Component definition  | `PascalCase`     |

---

### Stack

front: React / Typescript / Tailwind
back : Express / Typescript
ORM : TypeORM

---

### Architecture

wn-falcon-reader

- client
- server
- database

---

# Initialisation

## Cloner the repo

```bash
git clone <url-du-repo>
```

## Installing dependencies

You have to install dependencies for each folder, front and backend

```bash
cd client
npm install

cd server
npm install
```

## Create .env file

Follow the .env.example

## ORM

This project use TypeORM, you have to create manually the 'writer' schema before starting the server (via terminal or dbeaver)

```bash
psql -d nom_base -c "CREATE SCHEMA writer;"
```

## Launch the project

```bash
cd server

npm run dev

npm run client

npm run server
```

---

# API calls

## use fetch :)
