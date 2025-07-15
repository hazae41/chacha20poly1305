import "@hazae41/symbol-dispose-polyfill"

import { assert, test } from "@hazae41/phobos"
import { ChaCha20Poly1305 } from "index.js"

import { ChaCha20Poly1305Wasm } from "@hazae41/chacha20poly1305.wasm"
import { Lengthed } from "@hazae41/lengthed"

test("chacha", async () => {
  await ChaCha20Poly1305Wasm.initBundled()

  const { Memory, ChaCha20Poly1305Cipher } = ChaCha20Poly1305.fromWasm(ChaCha20Poly1305Wasm)
  // const adapter = ChaCha20Poly1305.fromNoble()

  using key = Memory.importOrThrow(crypto.getRandomValues(new Uint8Array(32)) as Uint8Array & Lengthed<32>)
  using cipher = ChaCha20Poly1305Cipher.importOrThrow(key)

  using message = Memory.importOrThrow(crypto.getRandomValues(new Uint8Array(256)))
  using nonce = Memory.importOrThrow(crypto.getRandomValues(new Uint8Array(12)) as Uint8Array & { length: 12 })

  using encrypted = cipher.encryptOrThrow(message, nonce)
  using decrypted = cipher.decryptOrThrow(encrypted, nonce)

  assert(message.bytes.toString() === decrypted.bytes.toString())
})