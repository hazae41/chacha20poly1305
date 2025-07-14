import "@hazae41/symbol-dispose-polyfill"

import { assert, test } from "@hazae41/phobos"
import { ChaCha20Poly1305 } from "index.js"

import { ChaCha20Poly1305Wasm } from "@hazae41/chacha20poly1305.wasm"

test("chacha", async () => {
  await ChaCha20Poly1305Wasm.initBundled()

  const adapter = ChaCha20Poly1305.fromWasm(ChaCha20Poly1305Wasm)
  // const adapter = ChaCha20Poly1305.fromNoble()

  const key = crypto.getRandomValues(new Uint8Array(32)) as Uint8Array & { length: 32 }
  using cipher = adapter.ChaCha20Poly1305Cipher.importOrThrow(key)

  const message = crypto.getRandomValues(new Uint8Array(256))
  const nonce = crypto.getRandomValues(new Uint8Array(12)) as Uint8Array & { length: 12 }

  using encrypted = cipher.encryptOrThrow(message, nonce)
  using decrypted = cipher.decryptOrThrow(encrypted, nonce)

  assert(message.toString() === decrypted.bytes.toString())
})