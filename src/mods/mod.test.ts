import { assert, test } from "@hazae41/phobos";

import { chaCha20Poly1305 } from "@/mod.ts";
import { chaCha20Poly1305Wasm } from "@hazae41/chacha20poly1305-wasm";
import type { Lengthed } from "../libs/lengthed/mod.ts";

test("chacha", async () => {
  await chaCha20Poly1305Wasm.load()

  chaCha20Poly1305.set(chaCha20Poly1305.fromWasm(chaCha20Poly1305Wasm))

  const { Memory, ChaCha20Poly1305Cipher } = chaCha20Poly1305.get().getOrThrow()

  const key = Memory.fromOrThrow(crypto.getRandomValues(new Uint8Array(32)) as Uint8Array & Lengthed<32>)
  const cipher = ChaCha20Poly1305Cipher.importOrThrow(key)

  const message = Memory.fromOrThrow(crypto.getRandomValues(new Uint8Array(256)))
  const nonce = Memory.fromOrThrow(crypto.getRandomValues(new Uint8Array(12)) as Uint8Array & { length: 12 })

  const encrypted = cipher.encryptOrThrow(message, nonce)
  const decrypted = cipher.decryptOrThrow(encrypted, nonce)

  assert(message.bytes.toString() === decrypted.bytes.toString())
})