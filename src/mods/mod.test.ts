import { assert, test } from "@hazae41/phobos";

import { chaCha20Poly1305Wasm } from "@hazae41/chacha20poly1305-wasm";
import { fromWasm, get, set, } from "./mod.ts";

test("chacha", async () => {
  await chaCha20Poly1305Wasm.load()

  set(fromWasm(chaCha20Poly1305Wasm))

  const { Memory, ChaCha20Poly1305Cipher } = get().getOrThrow()

  const key = Memory.fromOrThrow(crypto.getRandomValues(new Uint8Array(32)))
  const cipher = ChaCha20Poly1305Cipher.importOrThrow(key)

  const message = Memory.fromOrThrow(crypto.getRandomValues(new Uint8Array(256)))
  const nonce = Memory.fromOrThrow(crypto.getRandomValues(new Uint8Array(12)))

  const encrypted = cipher.encryptOrThrow(message, nonce)
  const decrypted = cipher.decryptOrThrow(encrypted, nonce)

  assert(message.bytes.toString() === decrypted.bytes.toString())
})