import { assert, test } from "@hazae41/phobos";
import { chaCha20Poly1305 } from "./mod.ts";

test("chacha", () => {
  const key = crypto.getRandomValues(new Uint8Array(32))
  const cipher = chaCha20Poly1305.Cipher.import(key)

  const message = crypto.getRandomValues(new Uint8Array(256))
  const nonce = crypto.getRandomValues(new Uint8Array(12))

  const encrypted = cipher.encrypt(message, nonce)
  const decrypted = cipher.decrypt(encrypted, nonce)

  assert(message.toString() === decrypted.toString())
})