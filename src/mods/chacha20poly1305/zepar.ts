import type { Zepar } from "@hazae41/zepar"
import { tryCryptoSync } from "libs/crypto/crypto.js"
import { Adapter } from "./adapter.js"

export function fromZepar(zepar: typeof Zepar): Adapter {

  class Cipher {

    constructor(
      readonly inner: Zepar.ChaCha20Poly1305Cipher
    ) { }

    [Symbol.dispose]() {
      this.inner.free()
    }

    static new(inner: Zepar.ChaCha20Poly1305Cipher) {
      return new Cipher(inner)
    }

    static tryImport(key: Uint8Array & { length: 32 }) {
      return tryCryptoSync(() => new zepar.ChaCha20Poly1305Cipher(key)).mapSync(Cipher.new)
    }

    tryEncrypt(message: Uint8Array, nonce: Uint8Array & { length: 12 }) {
      return tryCryptoSync(() => this.inner.encrypt(message, nonce))
    }

    tryDecrypt(message: Uint8Array, nonce: Uint8Array & { length: 12 }) {
      return tryCryptoSync(() => this.inner.decrypt(message, nonce))
    }

  }

  return { Cipher }
}