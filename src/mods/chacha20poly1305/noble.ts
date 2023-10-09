import { Box, Copiable, Copied } from "@hazae41/box"
import { Ok, Result } from "@hazae41/result"
import { chacha20poly1305 } from "@noble/ciphers/chacha"
import { Adapter } from "./adapter.js"
import { DecryptError, EncryptError } from "./errors.js"

export function fromNoble(): Adapter {

  class Cipher {

    constructor(
      readonly key: Box<Copiable<Uint8Array & { length: 32 }>>
    ) { }

    [Symbol.dispose]() {
      this.key[Symbol.dispose]()
    }

    static new(key: Box<Copiable<Uint8Array & { length: 32 }>>) {
      return new Cipher(key)
    }

    static tryImport(key: Box<Copiable<Uint8Array & { length: 32 }>>) {
      return new Ok(new Cipher(new Box(new Copied(key.unwrap().copyAndDispose().bytes.slice() as Uint8Array & { length: 32 }))))
    }

    tryEncrypt(message: Box<Copiable>, nonce: Box<Copiable<Uint8Array & { length: 12 }>>) {
      return Result.runAndWrapSync(() => {
        return chacha20poly1305(this.key.get().bytes, nonce.get().bytes.slice()).encrypt(message.get().bytes)
      }).mapErrSync(EncryptError.from).mapSync(Copied.new)
    }

    tryDecrypt(message: Box<Copiable>, nonce: Box<Copiable<Uint8Array & { length: 12 }>>) {
      return Result.runAndWrapSync(() => {
        return chacha20poly1305(this.key.get().bytes, nonce.get().bytes.slice()).decrypt(message.get().bytes)
      }).mapErrSync(DecryptError.from).mapSync(Copied.new)
    }

  }

  return { Cipher }
}