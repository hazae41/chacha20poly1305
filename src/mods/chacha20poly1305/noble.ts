import type * as ChaChaNoble from "@noble/ciphers/chacha"

import { Lengthed } from "@hazae41/lengthed"
import { Owned, Unowned } from "libs/ownable/index.js"
import { Abstract } from "./abstract.js"
import { Adapter } from "./adapter.js"

export function fromNoble(noble: typeof ChaChaNoble) {
  const { chacha20, chacha20poly1305 } = noble

  class Memory<N extends number = number> extends Abstract.Memory {

    constructor(
      readonly inner: Uint8Array
    ) {
      super()
    }

    static fromOrThrow<N extends number = number>(memory: Abstract.Memory<N>) {
      if (memory instanceof Memory)
        return new Unowned(memory)

      const inner = new Uint8Array(memory.bytes)

      return new Owned(new Memory<N>(inner))
    }

    static importOrThrow<N extends number = number>(bytes: Uint8Array & Lengthed<N>) {
      return new Memory<N>(new Uint8Array(bytes))
    }

    [Symbol.dispose]() { }

    get bytes() {
      return this.inner as Uint8Array & Lengthed<N>
    }

  }

  class ChaCha20Cipher extends Abstract.ChaCha20Cipher {

    counter = 0

    constructor(
      readonly key: Uint8Array,
      readonly nonce: Uint8Array
    ) {
      super()
    }

    [Symbol.dispose]() { }

    static importOrThrow(key: Memory<32>, nonce: Memory<12>) {
      return new ChaCha20Cipher(new Uint8Array(key.bytes), new Uint8Array(nonce.bytes))
    }

    applyOrThrow(message: Memory) {
      chacha20(this.key, this.nonce, message.bytes, message.bytes, this.counter++)
    }

  }

  class ChaCha20Poly1305Cipher extends Abstract.ChaCha20Poly1305Cipher {

    constructor(
      readonly key: Uint8Array
    ) {
      super()
    }

    [Symbol.dispose]() { }

    static importOrThrow(key: Memory<32>) {
      return new ChaCha20Poly1305Cipher(new Uint8Array(key.bytes))
    }

    encryptOrThrow(message: Memory, nonce: Memory<12>) {
      return new Memory(chacha20poly1305(this.key, nonce.bytes).encrypt(message.bytes))
    }

    decryptOrThrow(message: Memory, nonce: Memory<12>) {
      return new Memory(chacha20poly1305(this.key, nonce.bytes).decrypt(message.bytes))
    }

  }

  return { Memory, ChaCha20Cipher, ChaCha20Poly1305Cipher } satisfies Adapter
}