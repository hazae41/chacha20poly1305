import "@hazae41/symbol-dispose-polyfill"

import { assert, test } from "@hazae41/phobos"
import { Zepar } from "@hazae41/zepar"
import { ChaCha20Poly1305 } from "index.js"

test("chacha", async () => {
  await Zepar.initBundledOnce()

  const adapter = await ChaCha20Poly1305.fromZepar()
  // const adapter = ChaCha20Poly1305.fromNoble()

  const key = crypto.getRandomValues(new Uint8Array(32)) as Uint8Array & { length: 32 }
  const cipher = adapter.Cipher.tryImport(key).unwrap()

  const message = crypto.getRandomValues(new Uint8Array(256))
  const nonce = crypto.getRandomValues(new Uint8Array(12)) as Uint8Array & { length: 12 }

  const encrypted = cipher.tryEncrypt(message, nonce).unwrap().copyAndDispose()
  const decrypted = cipher.tryDecrypt(encrypted, nonce).unwrap().copyAndDispose()

  assert(message.toString() === decrypted.toString())
})