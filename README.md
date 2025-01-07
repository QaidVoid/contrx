# Contrx

Contrx is a simple, experimental contract management system built using [Rust](https://rust-lang.org)
(backend) and [React](https://react.dev) (frontend). It is intended as a toy project to demonstrate
coding skills and explore concepts in Rust and modern web development. This
project is not designed for production use and may have rough edges or
incomplete features. This project is a learning tool and skill demonstration,
not a polished production system.

## Features

- User Authentication: Basic login and registration functionality.
- Contract Management: Create, edit, and manage contracts with associated
  clauses and counterparties.
- Organization Support: Manage multiple organizations, users, and contracts.
- Rich Editor: Integrated editor for contract clauses.

## Tech Stack

- Backend: Rust with [Axum](https://github.com/tokio-rs/axum) for web services.
- Frontend: React with [TypeScript](https://typescriptlang.org).
- Database: [PostgreSQL](https://postgresql.org) for data persistence.

## Getting Started

1. Clone the repository:

```sh
git clone https://github.com/QaidVoid/contrx.git
cd contrx
```

2. Set up the backend:

```sh
cp config.example.yaml config.yaml

cd server
cargo build
cargo run
```

3. Set up the frontend:

```sh
cd client
pnpm install
pnpm dev
```

4. Access the app at <http://localhost:5173>.

## Known Issues

- Minimal UI design [I'm not a designer]
- Possible code inefficiencies and limited error handling.
