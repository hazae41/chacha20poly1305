import { Box, BytesOrCopiable } from "@hazae41/box"
import { Result } from "@hazae41/result"
import { Zepar } from "@hazae41/zepar"
import { Adapter } from "./adapter.js"
import { DecryptError, EncryptError, ImportError } from "./errors.js"

export async function fromZepar(): Promise<Adapter> {
  await Zepar.initBundledOnce()

  function getMemory(bytesOrCopiable: BytesOrCopiable) {
    if (bytesOrCopiable instanceof Zepar.Memory)
      return Box.greedy(bytesOrCopiable)
    if (bytesOrCopiable instanceof Uint8Array)
      return Box.new(new Zepar.Memory(bytesOrCopiable))
    return Box.new(new Zepar.Memory(bytesOrCopiable.bytes))
  }

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

    static tryImport(key: BytesOrCopiable<32>) {
      using mkey = getMemory(key)

      return Result.runAndWrapSync(() => {
        return new Zepar.ChaCha20Poly1305Cipher(mkey.inner)
      }).mapErrSync(ImportError.from).mapSync(Cipher.new)
    }

    tryEncrypt(message: BytesOrCopiable, nonce: BytesOrCopiable<12>) {
      using mmessage = getMemory(message)
      using mnonce = getMemory(nonce)

      return Result.runAndWrapSync(() => {
        return this.inner.encrypt(mmessage.inner, mnonce.inner)
      }).mapErrSync(EncryptError.from)
    }

    tryDecrypt(message: BytesOrCopiable, nonce: BytesOrCopiable<12>) {
      using mmessage = getMemory(message)
      using mnonce = getMemory(nonce)

      return Result.runAndWrapSync(() => {
        return this.inner.decrypt(mmessage.inner, mnonce.inner)
      }).mapErrSync(DecryptError.from)
    }

  }

  return { Cipher }
}