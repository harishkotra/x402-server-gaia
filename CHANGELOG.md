# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-01

### Added

- Initial release of `create-x402-gaia` package
- CLI tool to scaffold X402 protected Gaia Node servers
- Support for OpenAI-compatible endpoints:
  - `/v1/chat/completions` - Chat completions with x402 payment protection
  - `/v1/embeddings` - Embeddings with x402 payment protection
- Environment-based configuration:
  - Gaia Node URL configuration
  - Configurable pricing in USD
  - Network selection (Base Sepolia testnet / Base mainnet)
  - Custom recipient address
  - Configurable server port
- Automatic proxy to Gaia Node after payment verification
- Self-hosted x402 facilitator for payment processing
- Status endpoint showing configuration and pricing
- Comprehensive documentation:
  - Main README with quick start guide
  - Template README with detailed setup
  - QUICKSTART.md for 5-minute setup
  - Examples documentation
  - Publishing guide
  - Implementation summary
- Client examples:
  - JavaScript/Node.js example with x402 client
  - Python example with x402 client
  - cURL examples
  - OpenAI SDK integration examples
- Error handling and validation
- TypeScript support
- Bun runtime optimization

### Features

- **For Gaia Node Operators**:
  - Simple 3-step setup process
  - Earn crypto for AI inference requests
  - Self-custody of funds
  - No third-party payment processors

- **For API Users**:
  - Pay-per-use model
  - OpenAI-compatible endpoints
  - Works with standard OpenAI SDKs
  - Testnet support for development

### Technical Details

- Built with Hono web framework
- Uses x402-hono middleware for payment protection
- Uses @x402-sovereign/core for payment processing
- Viem for Ethereum interactions
- Full TypeScript implementation
- Support for both Bun and Node.js runtimes

---

## [Unreleased]

### Planned

- Rate limiting support
- Usage analytics dashboard
- Multiple pricing tiers
- Subscription models
- API key management
- Webhook notifications for payments
- Docker deployment support
- Additional network support (Ethereum, Polygon, etc.)

---

## Version History

- **1.0.0** - Initial public release

[1.0.0]: https://github.com/yourusername/x402-server-gaia/releases/tag/v1.0.0
