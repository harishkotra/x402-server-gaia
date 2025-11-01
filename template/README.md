# X402 Protected Gaia Node Server

Turn your Gaia Node into a paid API service! This x402 server creates payment-protected OpenAI-compatible endpoints for your Gaia Node, allowing you to monetize AI inference.

## What This Does

- Wraps your Gaia Node's OpenAI-compatible API (`/v1/chat/completions` and `/v1/embeddings`) with x402 payment protection
- Users pay per request using crypto (Ethereum on Base network)
- You earn money for every AI inference request
- Self-hosted facilitator handles all payment processing
- Compatible with any OpenAI SDK or library

## Quick Start

### 1. Install Dependencies

```sh
bun install
```

### 2. Set Up Environment

```sh
cp env.example .env
```

Edit `.env` and configure:

```env
# REQUIRED: Your Ethereum wallet private key (for receiving payments)
EVM_PRIVATE_KEY=your_private_key_here

# REQUIRED: Your Gaia Node URL
GAIA_NODE_URL=https://your-node-id.gaia.domains

# REQUIRED: Your Ethereum wallet address (where payments go)
RECIPIENT_ADDRESS=0xYourWalletAddress

# OPTIONAL: Pricing (in USD)
CHAT_COMPLETIONS_PRICE=0.01    # $0.01 per chat completion request
EMBEDDINGS_PRICE=0.005          # $0.005 per embeddings request

# OPTIONAL: Network (base-sepolia for testing, base for production)
PAYMENT_NETWORK=base-sepolia

# OPTIONAL: Server port
PORT=3000
```

### 3. Run the Server

```sh
bun run dev
```

Your protected Gaia Node is now running at `http://localhost:3000`

## Protected Endpoints

Once running, these endpoints require payment:

- `POST /v1/chat/completions` - Chat completions (OpenAI-compatible)
- `POST /v1/embeddings` - Text embeddings (OpenAI-compatible)

## Getting Your Gaia Node URL

1. Deploy a Gaia Node (visit [Gaia documentation](https://docs.gaianet.ai/))
2. Your node will have a URL like: `https://your-node-id.gaia.domains`
3. Add this URL to your `.env` file as `GAIA_NODE_URL`

## Getting Your Ethereum Wallet

You need an Ethereum wallet to receive payments:

1. Use MetaMask, Rainbow, or any Ethereum wallet
2. Export your private key (keep it secure!)
3. Add to `.env` as `EVM_PRIVATE_KEY`
4. Add your wallet address as `RECIPIENT_ADDRESS`

## Testing vs Production

**Testing (Base Sepolia Testnet)**
```env
PAYMENT_NETWORK=base-sepolia
```
- Use for development and testing
- No real money involved
- Get test ETH from [Base Sepolia faucet](https://www.alchemy.com/faucets/base-sepolia)

**Production (Base Mainnet)**
```env
PAYMENT_NETWORK=base
```
- Use for real payments
- Users pay with real crypto
- You earn real money

## Usage Example

Check the `examples/` directory for complete client examples. Here's a quick preview:

```javascript
// Your users will call your protected endpoint
const response = await fetch("http://localhost:3000/v1/chat/completions", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "gaia-model",
    messages: [{ role: "user", content: "Hello!" }]
  })
});

// First request returns 402 Payment Required with payment instructions
// After payment, requests go through to your Gaia Node
```

## Checking Server Status

Visit `http://localhost:3000/` to see:
- Configuration status
- Available endpoints
- Current pricing
- Payment network info

## How It Works

1. Client makes request to `/v1/chat/completions`
2. X402 middleware checks for valid payment
3. If no payment: Returns `402 Payment Required` with payment details
4. Client pays using the facilitator endpoint
5. After payment: Request is proxied to your Gaia Node
6. Response from Gaia Node is returned to client
7. You receive payment in your wallet

## Customizing Pricing

Edit `.env` to change pricing:

```env
# Examples:
CHAT_COMPLETIONS_PRICE=0.05    # $0.05 per request
EMBEDDINGS_PRICE=0.01          # $0.01 per request
```

Prices are in USD and automatically converted to crypto at payment time.

## Troubleshooting

**"GAIA_NODE_URL is not configured"**
- Make sure you've created a `.env` file (copy from `env.example`)
- Add your Gaia Node URL

**"Gaia Node request failed"**
- Verify your Gaia Node is running and accessible
- Check the URL is correct (should include `https://`)

**Payment not working**
- Ensure `EVM_PRIVATE_KEY` is set correctly
- Check you're on the right network (testnet vs mainnet)
- Verify your wallet has some ETH for gas fees

## Need Help?

- [X402 Documentation](https://docs.x402.org)
- [Gaia Documentation](https://docs.gaianet.ai/)
- [Base Network](https://base.org/)

## Security Notes

- Never commit your `.env` file to version control
- Keep your `EVM_PRIVATE_KEY` secure
- Use environment variables in production
- Consider using a dedicated wallet for receiving payments
