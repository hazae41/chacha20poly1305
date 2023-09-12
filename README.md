# ChaCha20Poly1305

ChaCha20Poly1305 adapter for WebAssembly and JS implementations

```bash
npm i @hazae41/chacha20poly1305
```

[**Node Package 📦**](https://www.npmjs.com/package/@hazae41/chacha20poly1305)

## Features

### Current features
- 100% TypeScript and ESM
- No external dependencies

## Usage

### Zepar (WebAssembly)

```bash
npm i @hazae41/zepar
```

```typescript
import { ChaCha20Poly1305 } from "@hazae41/chacha20poly1305"

ChaCha20Poly1305.set(await ChaCha20Poly1305.fromZepar())
```

### Noble (JavaScript)

```bash
npm i @noble/ciphers
```

```typescript
import { ChaCha20Poly1305 } from "@hazae41/chacha20poly1305"

ChaCha20Poly1305.set(ChaCha20Poly1305.fromNoble())
```
