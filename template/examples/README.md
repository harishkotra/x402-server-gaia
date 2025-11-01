# Client Examples

These examples show how to use your X402 protected Gaia Node from client applications.

## Quick Test with cURL

### 1. First Request (Returns 402 Payment Required)

```bash
curl -X POST http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

Response will be `402 Payment Required` with payment instructions.

### 2. Check Server Status

```bash
curl http://localhost:3000/
```

This shows your server configuration, pricing, and available endpoints.

## JavaScript/Node.js Example

See [`client.js`](./client.js) for a complete example.

### Setup

```bash
# Install dependencies
npm install @x402-sovereign/client

# Set your private key for making payments
export CLIENT_PRIVATE_KEY=0xYourPrivateKeyHere

# Run the example
node client.js
```

### Using with OpenAI SDK

The protected endpoints are OpenAI-compatible, so you can use the OpenAI SDK:

```javascript
import OpenAI from "openai";
import { X402Client } from "@x402-sovereign/client";

// Create custom fetch function that handles x402 payments
const x402Client = new X402Client({
  evmPrivateKey: process.env.CLIENT_PRIVATE_KEY,
});

const openai = new OpenAI({
  baseURL: "http://localhost:3000/v1",
  apiKey: "not-needed", // x402 handles auth
  fetch: x402Client.fetch.bind(x402Client), // Use x402 fetch
});

// Now use OpenAI SDK normally
const completion = await openai.chat.completions.create({
  model: "llama",
  messages: [{ role: "user", content: "Hello!" }],
});

console.log(completion.choices[0].message.content);
```

## Python Example

See [`client.py`](./client.py) for a complete example.

### Setup

```bash
# Install dependencies
pip install x402-client requests

# Set your private key for making payments
export CLIENT_PRIVATE_KEY=0xYourPrivateKeyHere

# Run the example
python client.py
```

### Using with OpenAI Python SDK

```python
import os
from openai import OpenAI
from x402_client import X402Client

# Create custom HTTP client that handles x402 payments
x402_client = X402Client(
    evm_private_key=os.getenv("CLIENT_PRIVATE_KEY")
)

client = OpenAI(
    base_url="http://localhost:3000/v1",
    api_key="not-needed",  # x402 handles auth
    http_client=x402_client.http_client,  # Use x402 HTTP client
)

# Now use OpenAI SDK normally
completion = client.chat.completions.create(
    model="llama",
    messages=[{"role": "user", "content": "Hello!"}]
)

print(completion.choices[0].message.content)
```

## How Payment Works

1. **First Request**: When you make a request, the server returns `402 Payment Required` with payment details:
   ```json
   {
     "error": "Payment required",
     "payment": {
       "amount": "0.01",
       "currency": "USD",
       "facilitator": "http://localhost:3000/facilitator"
     }
   }
   ```

2. **Client Pays**: The x402 client library automatically:
   - Detects the 402 response
   - Initiates payment to the facilitator
   - Waits for confirmation
   - Retries the original request

3. **Access Granted**: After payment, your request is forwarded to the Gaia Node and you get the AI response.

4. **Subsequent Requests**: The client library caches payment proof, so you don't pay for every single request (depending on the payment model configured).

## Payment Model

The default setup uses **pay-per-request**:
- Each API call requires a payment
- Pricing set in server's `.env` file
- Payments go directly to the Gaia Node operator

You can customize this in your server configuration.

## Client Setup Checklist

- [ ] Install x402 client library
- [ ] Get an Ethereum wallet (MetaMask, Rainbow, etc.)
- [ ] Export private key from wallet
- [ ] Add some ETH for payments (testnet or mainnet)
- [ ] Set `CLIENT_PRIVATE_KEY` environment variable
- [ ] Point to your x402 server URL
- [ ] Make requests!

## Testing on Testnet

For testing without real money:

1. Use Base Sepolia testnet (server should have `PAYMENT_NETWORK=base-sepolia`)
2. Get test ETH from [Base Sepolia faucet](https://www.alchemy.com/faucets/base-sepolia)
3. Use the same examples above - they work on both testnet and mainnet

## Production Usage

For production with real payments:

1. Server uses `PAYMENT_NETWORK=base`
2. Client wallet needs real ETH on Base network
3. All payments are real and go to the Gaia Node operator
4. Users pay for AI inference in crypto

## Need Help?

- Check the main [README](../README.md) for server setup
- Visit [X402 Documentation](https://docs.x402.org)
- See [Gaia Node docs](https://docs.gaianet.ai/)
