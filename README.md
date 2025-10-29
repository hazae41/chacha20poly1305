# ChaCha20Poly1305

ChaCha20Poly1305 adapter for WebAssembly and JS implementations

```bash
npm install @hazae41/chacha20poly1305
```

```bash
deno install jsr:@hazae41/chacha20poly1305
```

[**📦 NPM**](https://www.npmjs.com/package/@hazae41/chacha20poly1305) • [**📦 JSR**](https://jsr.io/@hazae41/chacha20poly1305)

## Features

### Current features
- 100% TypeScript and ESM
- No external dependencies

## Usage

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

### Noble (JavaScript)

```bash
npm i @noble/ciphers
```

```typescript
import { chaCha20Poly1305 } from "@hazae41/chacha20poly1305"
import * as chaChaNoble from "@noble/ciphers/chacha"

chaCha20Poly1305.set(chaCha20Poly1305.fromNoble(chaChaNoble))
```
