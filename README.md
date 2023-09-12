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

```typescript
import { ChaCha20Poly1305 } from "@hazae41/chacha20poly1305"
import { Zepar } from "@hazae41/zepar"

await Zepar.initBundledOnce()
const chacha20poly1305 = ChaCha20Poly1305.fromZepar(Zepar)

/**
 * Set it globally (optional)
 **/
ChaCha20Poly1305.set(chacha20poly1305)
```

### Noble (JavaScript)

```typescript
import { ChaCha20Poly1305 } from "@hazae41/chacha20poly1305"
import * as noble_chacha from "@noble/ciphers/chacha"

const chacha20poly1305 = ChaCha20Poly1305.fromNoble(noble_chacha.chacha20poly1305)

/**
 * Set it globally (optional)
 **/
ChaCha20Poly1305.set(chacha20poly1305)
```
