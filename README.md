# ChaCha20Poly1305

ChaCha20Poly1305 for the web

```bash
npm install @hazae41/chacha20poly1305
```

[**📦 NPM**](https://www.npmjs.com/package/@hazae41/chacha20poly1305)

## Features

### Current features
- 100% TypeScript and ESM
- No external dependencies

## Usage 

```tsx
const key = crypto.getRandomValues(new Uint8Array(32))
const cipher = chaCha20Poly1305.Cipher.import(key)

const message = new TextEncoder().encode("Hello world")
const nonce = crypto.getRandomValues(new Uint8Array(12))

const encrypted = cipher.encrypt(message, nonce)
const decrypted = cipher.decrypt(encrypted, nonce)
```