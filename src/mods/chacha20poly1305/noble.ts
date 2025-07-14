import { Slice } from "@hazae41/memory"
import type * as ChaChaNoble from "@noble/ciphers/chacha"
import { BytesOrMemory } from "libs/copiable/index.js"
import * as Abstract from "./abstract.js"
import { Adapter } from "./adapter.js"

export function fromNoble(noble: typeof ChaChaNoble) {
  const { chacha20, chacha20poly1305 } = noble

  function getBytes(bytes: BytesOrMemory) {
    return "bytes" in bytes ? bytes.bytes : bytes
  }

  class ChaCha20Cipher extends Abstract.Streamer {

    counter = 0

    constructor(
      readonly key: Uint8Array,
      readonly nonce: Uint8Array
    ) {
      super()
    }

    [Symbol.dispose]() { }

    static create(key: Uint8Array, nonce: Uint8Array) {
      return new ChaCha20Cipher(key, nonce)
    }

    static importOrThrow(key: BytesOrMemory<32>, nonce: BytesOrMemory<12>) {
      return new ChaCha20Cipher(getBytes(key).slice(), getBytes(nonce).slice())
    }

    applyOrThrow(message: BytesOrMemory) {
      const input = getBytes(message)

      chacha20(this.key, this.nonce, input, input, this.counter++)
    }

  }

  class ChaCha20Poly1305Cipher extends Abstract.Messenger {

    constructor(
      readonly key: Uint8Array
    ) {
      super()
    }

    [Symbol.dispose]() { }

    static create(key: Uint8Array) {
      return new ChaCha20Poly1305Cipher(key)
    }

    static importOrThrow(key: BytesOrMemory<32>) {
      return new ChaCha20Poly1305Cipher(getBytes(key).slice())
    }

    encryptOrThrow(message: BytesOrMemory, nonce: BytesOrMemory<12>) {
      return new Slice(chacha20poly1305(this.key, getBytes(nonce).slice()).encrypt(getBytes(message)))
    }

    decryptOrThrow(message: BytesOrMemory, nonce: BytesOrMemory<12>) {
      return new Slice(chacha20poly1305(this.key, getBytes(nonce).slice()).decrypt(getBytes(message)))
    }

  }

  return { ChaCha20Cipher, ChaCha20Poly1305Cipher } satisfies Adapter
}