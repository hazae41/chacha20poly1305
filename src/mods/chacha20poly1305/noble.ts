import { Lengthed } from "@hazae41/lengthed"
import type * as ChaChaNoble from "@noble/ciphers/chacha"
import * as Abstract from "./abstract.js"
import { Adapter } from "./adapter.js"

export function fromNoble(noble: typeof ChaChaNoble) {
  const { chacha20, chacha20poly1305 } = noble

  class Memory<N extends number = number> extends Abstract.Memory {

    constructor(
      readonly bytes: Uint8Array & Lengthed<N>
    ) {
      super()
    }

    static importOrThrow<N extends number = number>(bytes: Uint8Array & Lengthed<N>) {
      return new Memory(bytes)
    }

    [Symbol.dispose]() { }

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

    static importOrThrow(key: Memory<32>, nonce: Memory<12>) {
      return new ChaCha20Cipher(key.bytes.slice(), nonce.bytes.slice())
    }

    applyOrThrow(message: Memory) {
      chacha20(this.key, this.nonce, message.bytes, message.bytes, this.counter++)
    }

  }

  class ChaCha20Poly1305Cipher extends Abstract.Messenger {

    constructor(
      readonly key: Uint8Array
    ) {
      super()
    }

    [Symbol.dispose]() { }

    static importOrThrow(key: Memory<32>) {
      return new ChaCha20Poly1305Cipher(key.bytes.slice())
    }

    encryptOrThrow(message: Memory, nonce: Memory<12>) {
      return new Memory(chacha20poly1305(this.key, nonce.bytes.slice()).encrypt(message.bytes))
    }

    decryptOrThrow(message: Memory, nonce: Memory<12>) {
      return new Memory(chacha20poly1305(this.key, nonce.bytes.slice()).decrypt(message.bytes))
    }

  }

  return { Memory, ChaCha20Cipher, ChaCha20Poly1305Cipher } satisfies Adapter
}