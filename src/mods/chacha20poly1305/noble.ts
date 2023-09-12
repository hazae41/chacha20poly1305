import { Ok } from "@hazae41/result"
import type { chacha20poly1305 } from "@noble/ciphers/chacha"
import { tryCryptoSync } from "libs/crypto/crypto.js"
import { Adapter, Copied } from "./adapter.js"


export function fromNoble(noble: typeof chacha20poly1305): Adapter {

  class Cipher {

    constructor(
      readonly key: Uint8Array & { length: 32 }
    ) { }

    [Symbol.dispose]() { }

    static new(key: Uint8Array & { length: 32 }) {
      return new Cipher(key)
    }

    static tryImport(key: Uint8Array & { length: 32 }) {
      return new Ok(new Cipher(key.slice() as Uint8Array & { length: 32 }))
    }

    tryEncrypt(message: Uint8Array, nonce: Uint8Array & { length: 12 }) {
      return tryCryptoSync(() => noble(this.key, nonce.slice()).encrypt(message)).mapSync(Copied.new)
    }

    tryDecrypt(message: Uint8Array, nonce: Uint8Array & { length: 12 }) {
      return tryCryptoSync(() => noble(this.key, nonce.slice()).decrypt(message)).mapSync(Copied.new)
    }

  }

  return { Cipher }
}