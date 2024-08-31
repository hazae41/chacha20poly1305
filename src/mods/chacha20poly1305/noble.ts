import type * as ChaChaNoble from "@noble/ciphers/chacha"
import { BytesOrCopiable, Copied } from "libs/copiable/index.js"
import { Adapter } from "./adapter.js"

export function fromNoble(noble: typeof ChaChaNoble) {
  const { chacha20poly1305 } = noble

  function getBytes(bytes: BytesOrCopiable) {
    return "bytes" in bytes ? bytes.bytes : bytes
  }

  class Cipher {

    constructor(
      readonly key: Uint8Array
    ) { }

    [Symbol.dispose]() { }

    static create(key: Uint8Array) {
      return new Cipher(key)
    }

    static importOrThrow(key: BytesOrCopiable<32>) {
      return new Cipher(getBytes(key).slice())
    }

    encryptOrThrow(message: BytesOrCopiable, nonce: BytesOrCopiable<12>) {
      return new Copied(chacha20poly1305(this.key, getBytes(nonce).slice()).encrypt(getBytes(message)))
    }

    decryptOrThrow(message: BytesOrCopiable, nonce: BytesOrCopiable<12>) {
      return new Copied(chacha20poly1305(this.key, getBytes(nonce).slice()).decrypt(getBytes(message)))
    }

  }

  return { Cipher } satisfies Adapter
}