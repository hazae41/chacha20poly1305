# ChaCha20Poly1305

ChaCha20Poly1305 adapter for WebAssembly and JS implementations

```bash
npm install --save-peer @hazae41/chacha20poly1305
```

[**📦 NPM**](https://www.npmjs.com/package/@hazae41/chacha20poly1305)

## Features

### Current features
- 100% TypeScript and ESM
- No external dependencies

## Implementation

### WebAssembly

```bash
npm i @hazae41/chacha20poly1305-wasm
```

```typescript
import { chaCha20Poly1305 } from "@hazae41/chacha20poly1305"
import { chaCha20Poly1305Wasm } from "@hazae41/chacha20poly1305-wasm"

await chaCha20Poly1305Wasm.load() // or chaCha20Poly1305Wasm.loadSync() 

chaCha20Poly1305.set(chaCha20Poly1305.fromWasm(chaCha20Poly1305Wasm))
```
