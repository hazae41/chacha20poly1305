import { BytesOrCopiable, Copied } from "@hazae41/box"
import { Ok, Result } from "@hazae41/result"
import { chacha20poly1305 } from "@noble/ciphers/chacha"
import { Adapter } from "./adapter.js"
import { DecryptError, EncryptError } from "./errors.js"

export function fromNoble(): Adapter {

  function getBytes<T extends number>(bytes: BytesOrCopiable<T>) {
    return "bytes" in bytes ? bytes.bytes : bytes
  }

  class Cipher {

    constructor(
      readonly key: Uint8Array
    ) { }

    [Symbol.dispose]() { }

    static new(key: Uint8Array) {
      return new Cipher(key)
    }

    static tryImport(key: BytesOrCopiable<32>) {
      return new Ok(new Cipher(getBytes(key).slice()))
    }

    tryEncrypt(message: BytesOrCopiable, nonce: BytesOrCopiable<12>) {
      return Result.runAndWrapSync(() => {
        return chacha20poly1305(this.key, getBytes(nonce).slice()).encrypt(getBytes(message))
      }).mapErrSync(EncryptError.from).mapSync(Copied.new)
    }

    tryDecrypt(message: BytesOrCopiable, nonce: BytesOrCopiable<12>) {
      return Result.runAndWrapSync(() => {
        return chacha20poly1305(this.key, getBytes(nonce).slice()).decrypt(getBytes(message))
      }).mapErrSync(DecryptError.from).mapSync(Copied.new)
    }

  }

  return { Cipher }
}