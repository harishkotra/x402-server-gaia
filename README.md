# X402 Protected Gaia Node Server

Turn your Gaia Node into a monetized API service! This project provides a simple way to create payment-protected OpenAI-compatible endpoints for your Gaia Node using the x402 payment protocol.

## What This Is

A CLI tool and server template that:
- Wraps Gaia Node's OpenAI-compatible API with x402 payment protection
- Creates paid endpoints for `/v1/chat/completions` and `/v1/embeddings`
- Handles payments automatically via self-hosted facilitator
- Lets Gaia Node operators earn crypto for AI inference
- Works with any OpenAI SDK or library

## Installation

You can use this package without installing it globally:

```bash
# Using npm
npm create x402-gaia my-gaia-server

# Using npx
npx create-x402-gaia my-gaia-server

# Using bun
bun create x402-gaia my-gaia-server

# Using yarn
yarn create x402-gaia my-gaia-server

# Using pnpm
pnpm create x402-gaia my-gaia-server
```

Or install globally:

```bash
# npm
npm install -g create-x402-gaia

# bun
bun install -g create-x402-gaia

# Then use it
create-x402-gaia my-gaia-server
```

## Quick Start

### 1. Create a New X402 Server

```bash
npm create x402-gaia my-gaia-server
cd my-gaia-server
```

### 2. Configure Your Gaia Node

```bash
cp env.example .env
```

Edit `.env` and add your Gaia Node URL:

```env
EVM_PRIVATE_KEY=your_ethereum_private_key
GAIA_NODE_URL=https://your-node-id.gaia.domains #without /v1
RECIPIENT_ADDRESS=0xYourWalletAddress
CHAT_COMPLETIONS_PRICE=0.01
EMBEDDINGS_PRICE=0.005
```

### 3. Run Your Server

```bash
bun install
bun run dev
```

Your protected Gaia Node is now running at `http://localhost:3000`!

## What You Get

- **Protected AI Endpoints**: `/v1/chat/completions` and `/v1/embeddings` with payment required
- **Self-hosted Facilitator**: Payment processing runs on your server
- **OpenAI Compatible**: Works with OpenAI SDKs and libraries
- **Configurable Pricing**: Set your own prices in USD
- **Testnet & Mainnet**: Support for both Base Sepolia (testing) and Base (production)

## Features

### For Gaia Node Operators

- Simple 3-step setup
- Configure pricing in USD (auto-converted to crypto)
- Earn crypto for every API request
- Self-custody of funds (payments go directly to your wallet)
- No third-party payment processors needed

### For API Users

- Pay-per-use model (pay only for what you use)
- OpenAI-compatible endpoints
- Use with standard OpenAI SDKs
- Crypto payments on Base network
- Works on testnet (free) or mainnet (real money)

## How It Works

```mermaid
User Request → X402 Server → Payment Check → Gaia Node → AI Response
                    ↓
                Payment Required?
                    ↓
                Facilitator → Payment → Grant Access
```

1. Client makes API request
2. Server checks for payment
3. If no payment: Return 402 Payment Required
4. Client pays via facilitator
5. Request forwarded to Gaia Node
6. AI response returned to client
7. Operator receives payment

## Documentation

- **Server Setup**: See [template/README.md](./template/README.md)
- **Client Examples**: See [template/examples/](./template/examples/)
- **X402 Protocol**: [docs.x402.org](https://docs.x402.org)
- **Gaia Nodes**: [docs.gaianet.ai](https://docs.gaianet.ai/)

## Requirements

- [Bun](https://bun.sh) runtime (or Node.js)
- Ethereum wallet with private key
- Gaia Node URL
- Some ETH for gas fees (testnet or mainnet)

## Examples

### Server Configuration

```env
# Your Ethereum wallet
EVM_PRIVATE_KEY=0x1234...
RECIPIENT_ADDRESS=0xYourAddress...

# Your Gaia Node
GAIA_NODE_URL=https://your-node-id.gaia.domains

# Pricing (in USD)
CHAT_COMPLETIONS_PRICE=0.01    # $0.01 per request
EMBEDDINGS_PRICE=0.005          # $0.005 per request

# Network
PAYMENT_NETWORK=base-sepolia   # or 'base' for mainnet
```

### Client Usage (JavaScript)

```javascript
import { X402Client } from "@x402-sovereign/client";

const client = new X402Client({
  evmPrivateKey: process.env.CLIENT_PRIVATE_KEY,
});

const response = await client.fetch("http://localhost:3000/v1/chat/completions", {
  method: "POST",
  body: JSON.stringify({
    model: "llama",
    messages: [{ role: "user", content: "Hello!" }],
  }),
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

See [template/examples/](./template/examples/) for more examples in JavaScript, Python, and cURL.

## Project Structure

```
x402-server-gaia/
├── index.ts              # CLI tool (create-x402-app)
├── template/             # Server template
│   ├── src/
│   │   └── index.ts      # Main server with Gaia Node proxy
│   ├── examples/         # Client usage examples
│   │   ├── client.js     # JavaScript example
│   │   ├── client.py     # Python example
│   │   └── README.md     # Examples documentation
│   ├── env.example       # Environment variables template
│   └── README.md         # Server setup guide
└── README.md             # This file
```

## Development

### Local Development

```bash
# Install dependencies
bun install

# Test the CLI locally
bun run index.ts test-project

# The template will be copied to ./test-project
cd test-project
cp env.example .env
# Edit .env with your settings
bun install
bun run dev
```

### Publishing

This package is designed to be published to npm as `create-x402-app`:

```bash
npm publish
```

Then users can run:
```bash
npm create x402-server my-project
```

## Use Cases

- Monetize your Gaia Node infrastructure
- Offer paid AI API services
- Create subscription models for AI access
- Build pay-per-use AI applications
- Experiment with crypto-powered APIs

## Support

- [X402 Documentation](https://docs.x402.org)
- [Gaia Node Documentation](https://docs.gaianet.ai/)
- [Base Network](https://base.org/)
- [GitHub Issues](https://github.com/yourusername/x402-server-gaia/issues)

## Security

- Never commit `.env` files
- Keep your `EVM_PRIVATE_KEY` secure
- Use dedicated wallets for production
- Test on Base Sepolia before going to mainnet

---

Built with [X402](https://x402.org) and [Gaia](https://gaianet.ai)

### Credits

Shoutout to [@Dhaiwat10](https://github.com/Dhaiwat10/create-x402-server) for creating `create-x402-server`.