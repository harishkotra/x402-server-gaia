/**
 * Example: Using X402 Protected Gaia Node with JavaScript/Node.js
 *
 * This example shows how to:
 * 1. Make a request to a protected endpoint
 * 2. Handle the 402 Payment Required response
 * 3. Make payment using the x402 client
 * 4. Access the protected resource after payment
 */

// You'll need the x402 client library
// npm install @x402-sovereign/client

import { X402Client } from "@x402-sovereign/client";

// Your x402 server URL
const SERVER_URL = "http://localhost:3000";

async function chatWithGaiaNode() {
  // Create an x402 client
  const client = new X402Client({
    // Your Ethereum private key for making payments
    evmPrivateKey: process.env.CLIENT_PRIVATE_KEY,
  });

  try {
    // Make a request to the protected chat completions endpoint
    const response = await client.fetch(`${SERVER_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant.",
          },
          {
            role: "user",
            content: "What is the meaning of life?",
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log("AI Response:", data.choices[0].message.content);

    return data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

async function generateEmbeddings() {
  const client = new X402Client({
    evmPrivateKey: process.env.CLIENT_PRIVATE_KEY,
  });

  try {
    const response = await client.fetch(`${SERVER_URL}/v1/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-ada-002",
        input: "The food was delicious and the waiter was very friendly.",
      }),
    });

    const data = await response.json();
    console.log("Embedding dimensions:", data.data[0].embedding.length);
    console.log("First few values:", data.data[0].embedding.slice(0, 5));

    return data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

// Usage
async function main() {
  console.log("=== X402 Protected Gaia Node Example ===\n");

  // Example 1: Chat Completions
  console.log("1. Making a chat completion request...");
  await chatWithGaiaNode();
  console.log("\n");

  // Example 2: Embeddings
  console.log("2. Generating embeddings...");
  await generateEmbeddings();
  console.log("\n");

  console.log("Done! All requests completed successfully.");
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { chatWithGaiaNode, generateEmbeddings };
