import { Box, Copiable, Copied } from "@hazae41/box"
import { Ok, Result } from "@hazae41/result"
import { chacha20poly1305 } from "@noble/ciphers/chacha"
import { Adapter } from "./adapter.js"
import { DecryptError, EncryptError } from "./errors.js"

export function fromNoble(): Adapter {

  class Cipher {

    constructor(
      readonly key: Uint8Array
    ) { }

    [Symbol.dispose]() { }

    static new(key: Uint8Array) {
      return new Cipher(key)
    }

    static tryImport(key: Box<Copiable<Uint8Array & { length: 32 }>>) {
      return new Ok(new Cipher(key.get().bytes.slice() as Uint8Array & { length: 32 }))
    }

    tryEncrypt(message: Box<Copiable>, nonce: Box<Copiable<Uint8Array & { length: 12 }>>) {
      return Result.runAndWrapSync(() => {
        return chacha20poly1305(this.key, nonce.get().bytes.slice()).encrypt(message.get().bytes)
      }).mapErrSync(EncryptError.from).mapSync(Copied.new)
    }

    tryDecrypt(message: Box<Copiable>, nonce: Box<Copiable<Uint8Array & { length: 12 }>>) {
      return Result.runAndWrapSync(() => {
        return chacha20poly1305(this.key, nonce.get().bytes.slice()).decrypt(message.get().bytes)
      }).mapErrSync(DecryptError.from).mapSync(Copied.new)
    }

  }

  return { Cipher }
}