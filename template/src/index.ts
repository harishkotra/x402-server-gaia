import { Hono } from "hono";
import { paymentMiddleware } from "x402-hono";
import { Facilitator, createHonoAdapter } from "@x402-sovereign/core";
import { baseSepolia, base } from "viem/chains";

const app = new Hono();

// Configuration from environment variables
const GAIA_NODE_URL = process.env.GAIA_NODE_URL;
const RECIPIENT_ADDRESS = process.env.RECIPIENT_ADDRESS || "0x0ED6Cec17F860fb54E21D154b49DAEFd9Ca04106";
const CHAT_PRICE = process.env.CHAT_COMPLETIONS_PRICE || "0.01";
const EMBEDDINGS_PRICE = process.env.EMBEDDINGS_PRICE || "0.005";
const PAYMENT_NETWORK = process.env.PAYMENT_NETWORK || "base-sepolia";
const PORT = process.env.PORT || 3000;

// Determine the network chain
const networkChain = PAYMENT_NETWORK === "base" ? base : baseSepolia;

// Initialize your sovereign facilitator
const facilitator = new Facilitator({
  evmPrivateKey: process.env.EVM_PRIVATE_KEY as `0x${string}`,
  networks: [networkChain],
});

createHonoAdapter(facilitator, app, "/facilitator");

// Helper function to proxy requests to Gaia Node
async function proxyToGaiaNode(endpoint: string, requestBody: any, headers: Record<string, string>) {
  if (!GAIA_NODE_URL) {
    throw new Error("GAIA_NODE_URL is not configured. Please set it in your .env file");
  }

  const url = `${GAIA_NODE_URL}${endpoint}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gaia Node request failed: ${response.status} ${errorText}`);
  }

  return await response.json();
}

// Configure the payment middleware for OpenAI-compatible endpoints
const protectedRoutes: Record<string, any> = {};

// Only add Gaia Node routes if URL is configured
if (GAIA_NODE_URL) {
  protectedRoutes["/v1/chat/completions"] = {
    price: `$${CHAT_PRICE}`,
    network: PAYMENT_NETWORK,
    config: {
      description: "AI Chat Completions - Pay per request",
    },
  };

  protectedRoutes["/v1/embeddings"] = {
    price: `$${EMBEDDINGS_PRICE}`,
    network: PAYMENT_NETWORK,
    config: {
      description: "AI Embeddings - Pay per request",
    },
  };
}

// Example protected route (optional - you can remove this)
protectedRoutes["/protected-route"] = {
  price: "$0.10",
  network: PAYMENT_NETWORK,
  config: {
    description: "Access to premium content",
  },
};

app.use(
  paymentMiddleware(
    RECIPIENT_ADDRESS,
    protectedRoutes,
    {
      url: `http://localhost:${PORT}/facilitator` as `${string}://${string}`,
    }
  )
);

// OpenAI-compatible Chat Completions endpoint (proxied to Gaia Node)
app.post("/v1/chat/completions", async (c) => {
  try {
    const body = await c.req.json();
    const headers: Record<string, string> = {};

    // Forward authorization header if present
    const authHeader = c.req.header("Authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const result = await proxyToGaiaNode("/v1/chat/completions", body, headers);
    return c.json(result);
  } catch (error: any) {
    console.error("Error proxying to Gaia Node:", error);
    return c.json({ error: error.message }, 500);
  }
});

// OpenAI-compatible Embeddings endpoint (proxied to Gaia Node)
app.post("/v1/embeddings", async (c) => {
  try {
    const body = await c.req.json();
    const headers: Record<string, string> = {};

    // Forward authorization header if present
    const authHeader = c.req.header("Authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const result = await proxyToGaiaNode("/v1/embeddings", body, headers);
    return c.json(result);
  } catch (error: any) {
    console.error("Error proxying to Gaia Node:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Example protected route (you can remove this if not needed)
app.get("/protected-route", (c) => {
  return c.json({ message: "This content is behind a paywall" });
});

// Root endpoint with setup information
app.get("/", (c) => {
  const isConfigured = !!GAIA_NODE_URL;

  return c.json({
    message: "X402 Protected Gaia Node Server",
    status: isConfigured ? "configured" : "not_configured",
    gaiaNodeUrl: GAIA_NODE_URL || "Not set - please configure GAIA_NODE_URL in .env",
    endpoints: {
      chat: {
        path: "/v1/chat/completions",
        price: `$${CHAT_PRICE}`,
        method: "POST",
        protected: isConfigured,
      },
      embeddings: {
        path: "/v1/embeddings",
        price: `$${EMBEDDINGS_PRICE}`,
        method: "POST",
        protected: isConfigured,
      },
    },
    paymentNetwork: PAYMENT_NETWORK,
    recipientAddress: RECIPIENT_ADDRESS,
  });
});

export default app;
