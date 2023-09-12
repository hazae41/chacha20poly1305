import { Ok, Result } from "@hazae41/result"
import { chacha20poly1305 } from "@noble/ciphers/chacha"
import { Adapter, Copied } from "./adapter.js"
import { DecryptError, EncryptError } from "./errors.js"

export function fromNoble(): Adapter {

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
      return Result.runAndWrapSync(() => {
        return chacha20poly1305(this.key, nonce.slice()).encrypt(message)
      }).mapErrSync(EncryptError.from).mapSync(Copied.new)
    }

    tryDecrypt(message: Uint8Array, nonce: Uint8Array & { length: 12 }) {
      return Result.runAndWrapSync(() => {
        return chacha20poly1305(this.key, nonce.slice()).decrypt(message)
      }).mapErrSync(DecryptError.from).mapSync(Copied.new)
    }

  }

  return { Cipher }
}