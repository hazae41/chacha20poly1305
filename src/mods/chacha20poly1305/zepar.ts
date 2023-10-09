import { Box, Copiable } from "@hazae41/box"
import { Result } from "@hazae41/result"
import { Zepar } from "@hazae41/zepar"
import { Adapter } from "./adapter.js"
import { DecryptError, EncryptError, ImportError } from "./errors.js"

export async function fromZepar(): Promise<Adapter> {
  await Zepar.initBundledOnce()

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

    static tryImport(key: Box<Copiable<Uint8Array & { length: 32 }>>) {
      return Result.runAndWrapSync(() => {
        return new Zepar.ChaCha20Poly1305Cipher(key)
      }).mapErrSync(ImportError.from).mapSync(Cipher.new)
    }

    tryEncrypt(message: Box<Copiable>, nonce: Box<Copiable<Uint8Array & { length: 12 }>>) {
      return Result.runAndWrapSync(() => {
        return this.inner.encrypt(message, nonce)
      }).mapErrSync(EncryptError.from)
    }

    tryDecrypt(message: Box<Copiable>, nonce: Box<Copiable<Uint8Array & { length: 12 }>>) {
      return Result.runAndWrapSync(() => {
        return this.inner.decrypt(message, nonce)
      }).mapErrSync(DecryptError.from)
    }

  }

  return { Cipher }
}