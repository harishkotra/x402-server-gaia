# create-x402-server

A simple x402 server including:
- an endpoint that supports paywalling content behind x402 payments
- a self-hosted facilitator that runs on the same server

To install dependencies:
```sh
bun install
```

Setup env:
```sh
cp env.example .env
```

To run:
```sh
bun run dev
```

open http://localhost:3000
