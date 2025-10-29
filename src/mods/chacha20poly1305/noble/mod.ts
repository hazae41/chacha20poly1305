import type * as chaChaNoble from "@noble/ciphers/chacha.js";

import type { Lengthed } from "@/libs/lengthed/mod.ts";
import { Abstract } from "../abstract/abstract.ts";
import type { Adapter } from "../adapter/mod.ts";

export function fromNoble(noble: typeof chaChaNoble) {
  const { chacha20, chacha20poly1305 } = noble

  class Memory<N extends number = number> extends Abstract.Memory {

    constructor(
      readonly inner: Uint8Array
    ) {
      super()
    }

    [Symbol.dispose]() { }

    static fromOrThrow<N extends number = number>(memory: Abstract.MemoryLike<N>): Memory<N> {
      if (memory instanceof Memory)
        return memory

      if (memory instanceof Uint8Array)
        return new Memory<N>(memory)

      if (memory.inner instanceof Uint8Array)
        return new Memory<N>(memory.inner)

      return new Memory<N>(new Uint8Array(memory.bytes))
    }

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
      if (key instanceof Memory === false)
        throw new Error()
      if (nonce instanceof Memory === false)
        throw new Error()
      return new ChaCha20Cipher(key.bytes, nonce.bytes)
    }

    applyOrThrow(message: Memory) {
      if (message instanceof Memory === false)
        throw new Error()
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
      if (key instanceof Memory === false)
        throw new Error()
      return new ChaCha20Poly1305Cipher(new Uint8Array(key.bytes))
    }

    encryptOrThrow(message: Memory, nonce: Memory<12>) {
      if (message instanceof Memory === false)
        throw new Error()
      if (nonce instanceof Memory === false)
        throw new Error()
      return new Memory(chacha20poly1305(this.key, nonce.bytes).encrypt(message.bytes))
    }

    decryptOrThrow(message: Memory, nonce: Memory<12>) {
      if (message instanceof Memory === false)
        throw new Error()
      return new Memory(chacha20poly1305(this.key, nonce.bytes).decrypt(message.bytes))
    }

  }

  return { Memory, ChaCha20Cipher, ChaCha20Poly1305Cipher } satisfies Adapter
}