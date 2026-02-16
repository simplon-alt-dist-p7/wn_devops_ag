# wn-falcon-reader

microservice repo for the World News reading app

## 📌 Overview

`wn-falcon-reader` is a microservice responsible for handling content reading within the World News ecosystem.  
This repository follows strict workflow and naming conventions to ensure code quality and consistency.

This work with the Writer microservice [Located here](https://github.com/simplon-alt-dist-p7/wn-falcon-writer)

---

## 🛠 Requirements

### Environment

- **Node.js**: `v18.x+` (required for TypeORM 0.3.x compatibility).
- **PostgreSQL**: `v14+` with multi-schema support (`writer` & `reader`).

### TypeORM Configuration

- **Schema Mapping**: Entities are decorated with `@Entity({ schema: 'reader' | 'writer' })` to handle cross-schema queries.
- **Materialized View Support**: Requires a `PrimaryColumn` mapping in TypeORM to read from the `mv_articles` view.
- **Dependencies**: `reflect-metadata` and `pg` (node-postgres) driver.

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

---

### Architecture

wn-falcon-reader

- client
- server
- database

---

# Initialisation

## Clone the repo

```bash
git clone <url-du-repo>
```

## Installing dependencies

This needs to be done in both the client and server folders.

```bash
npm install
```

## Create .env file

## Create Database

Use the scripts in the `database` folder :
`db.sql` + `db_mat_view` to create the reader Schema
-> You need the Schema Writer [Located here](https://github.com/simplon-alt-dist-p7/wn-falcon-writer)

## Launch the project

At the root of the folder

```bash
npm run dev
```

---

# API calls

## use fetch :)
