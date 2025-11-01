# Quick Start Guide for Gaia Node Operators

Get your monetized Gaia Node API running in 5 minutes!

## Prerequisites Checklist

- [ ] You have a Gaia Node running (get URL from Gaia dashboard)
- [ ] You have an Ethereum wallet (MetaMask, Rainbow, etc.)
- [ ] You have your wallet's private key
- [ ] You have Bun installed (`curl -fsSL https://bun.sh/install | bash`)

## Step 1: Get Your Information Ready

You'll need these 3 pieces of information:

1. **Gaia Node URL**: e.g., `https://abc123.gaia.domains`
   - Find this in your Gaia Node dashboard

2. **Ethereum Private Key**: e.g., `0x1234abcd...`
   - Export from MetaMask: Settings → Security & Privacy → Reveal Private Key
   - **Keep this secret!**

3. **Ethereum Address**: e.g., `0xYourAddress...`
   - This is where you'll receive payments
   - Find it in your wallet (the public address)

## Step 2: Install Dependencies

```bash
bun install
```

## Step 3: Configure Environment

```bash
cp env.example .env
```

Edit `.env` file:

```env
# Paste your private key here
EVM_PRIVATE_KEY=0xYourPrivateKeyHere

# Paste your Gaia Node URL here
GAIA_NODE_URL=https://your-node-id.gaia.domains

# Paste your wallet address here
RECIPIENT_ADDRESS=0xYourWalletAddressHere

# Optional: Set your prices (in USD)
CHAT_COMPLETIONS_PRICE=0.01
EMBEDDINGS_PRICE=0.005

# For testing, use base-sepolia. For production, use base
PAYMENT_NETWORK=base-sepolia

# Optional: Change port if needed
PORT=3000
```

## Step 4: Start the Server

```bash
bun run dev
```

You should see:
```
Server running at http://localhost:3000
```

## Step 5: Test Your Setup

Open your browser or use curl:

```bash
curl http://localhost:3000/
```

You should see:
```json
{
  "message": "X402 Protected Gaia Node Server",
  "status": "configured",
  "gaiaNodeUrl": "https://your-node-id.gaia.domains",
  "endpoints": {
    "chat": {
      "path": "/v1/chat/completions",
      "price": "$0.01",
      "protected": true
    },
    "embeddings": {
      "path": "/v1/embeddings",
      "price": "$0.005",
      "protected": true
    }
  }
}
```

If `status` is `"configured"` - you're good to go!

## Step 6: Test a Protected Endpoint

```bash
curl -X POST http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

You should get a `402 Payment Required` response - this means it's working!

## Next Steps

### For Testing (No Real Money)

1. Get test ETH from [Base Sepolia faucet](https://www.alchemy.com/faucets/base-sepolia)
2. Use the client examples in `/examples` directory
3. Make test payments and API calls
4. Verify everything works

### For Production (Real Money)

1. Change `.env`: `PAYMENT_NETWORK=base`
2. Restart server: `bun run dev`
3. Your wallet needs real ETH on Base network (for gas fees)
4. Share your server URL with users
5. Start earning!

## Common Issues

### "GAIA_NODE_URL is not configured"

**Fix**: Make sure you created `.env` file and added your Gaia Node URL

### "Cannot connect to Gaia Node"

**Fix**:
- Check your Gaia Node is running
- Verify the URL is correct (include `https://`)
- Test the URL in your browser

### "Invalid private key"

**Fix**:
- Make sure private key starts with `0x`
- Check for extra spaces or quotes
- Export the key again from your wallet

### Server won't start

**Fix**:
- Run `bun install` first
- Check port 3000 isn't already in use
- Try a different port in `.env`: `PORT=3001`

## Security Reminders

- **NEVER** share your private key
- **NEVER** commit `.env` to git (it's already in `.gitignore`)
- Use a **dedicated wallet** for receiving payments
- Keep some ETH in wallet for gas fees
- Test on **testnet** before going to production

## Getting Testnet ETH

For Base Sepolia (testing):
1. Visit [Base Sepolia Faucet](https://www.alchemy.com/faucets/base-sepolia)
2. Enter your wallet address
3. Get free test ETH
4. Use for testing payments

## Monitoring Your Earnings

Check your wallet in:
- MetaMask
- Rainbow Wallet
- Etherscan: `https://basescan.org/address/YOUR_ADDRESS`
- Base Sepolia Etherscan (testnet): `https://sepolia.basescan.org/address/YOUR_ADDRESS`

## Client Setup

Your users need:
1. X402 client library: `npm install @x402-sovereign/client`
2. An Ethereum wallet with some ETH
3. Your server URL

See `/examples` directory for complete client code examples.

## Need Help?

- Check [README.md](./README.md) for detailed docs
- See [examples/README.md](./examples/README.md) for client examples
- Visit [X402 Docs](https://docs.x402.org)
- Visit [Gaia Docs](https://docs.gaianet.ai/)

## Updating Prices

Edit `.env` and restart server:

```env
CHAT_COMPLETIONS_PRICE=0.05    # $0.05 per chat request
EMBEDDINGS_PRICE=0.02          # $0.02 per embeddings request
```

Then restart:
```bash
bun run dev
```

That's it! You're now running a monetized Gaia Node API.
