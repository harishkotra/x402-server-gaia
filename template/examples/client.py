"""
Example: Using X402 Protected Gaia Node with Python

This example shows how to:
1. Make a request to a protected endpoint
2. Handle the 402 Payment Required response
3. Make payment using the x402 client
4. Access the protected resource after payment

Requirements:
    pip install x402-client requests
"""

import os
from x402_client import X402Client

# Your x402 server URL
SERVER_URL = "http://localhost:3000"


def chat_with_gaia_node():
    """Example: Chat completions with payment"""

    # Create an x402 client
    client = X402Client(
        evm_private_key=os.getenv("CLIENT_PRIVATE_KEY")
    )

    try:
        # Make a request to the protected chat completions endpoint
        response = client.post(
            f"{SERVER_URL}/v1/chat/completions",
            json={
                "model": "llama",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a helpful assistant."
                    },
                    {
                        "role": "user",
                        "content": "What is the meaning of life?"
                    }
                ],
                "temperature": 0.7
            }
        )

        data = response.json()
        print("AI Response:", data["choices"][0]["message"]["content"])

        return data

    except Exception as error:
        print(f"Error: {error}")
        raise


def generate_embeddings():
    """Example: Embeddings with payment"""

    client = X402Client(
        evm_private_key=os.getenv("CLIENT_PRIVATE_KEY")
    )

    try:
        response = client.post(
            f"{SERVER_URL}/v1/embeddings",
            json={
                "model": "text-embedding-ada-002",
                "input": "The food was delicious and the waiter was very friendly."
            }
        )

        data = response.json()
        embedding = data["data"][0]["embedding"]
        print(f"Embedding dimensions: {len(embedding)}")
        print(f"First few values: {embedding[:5]}")

        return data

    except Exception as error:
        print(f"Error: {error}")
        raise


def main():
    """Run examples"""
    print("=== X402 Protected Gaia Node Example ===\n")

    # Example 1: Chat Completions
    print("1. Making a chat completion request...")
    chat_with_gaia_node()
    print("\n")

    # Example 2: Embeddings
    print("2. Generating embeddings...")
    generate_embeddings()
    print("\n")

    print("Done! All requests completed successfully.")


if __name__ == "__main__":
    main()
