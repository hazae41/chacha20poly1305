import type { chaCha20Poly1305Wasm } from "@hazae41/chacha20poly1305-wasm";

import type { Lengthed } from "@/libs/lengthed/mod.ts";
import { Abstract } from "../abstract/mod.ts";
import type { Adapter } from "../adapter/mod.ts";

export function fromWasm(wasm: typeof chaCha20Poly1305Wasm): Adapter {

  class Memory<N extends number = number> extends Abstract.Memory {

    constructor(
      readonly inner: chaCha20Poly1305Wasm.Memory
    ) {
      super()
    }

    [Symbol.dispose]() {
      this.inner[Symbol.dispose]()
    }

    static fromOrThrow<N extends number = number>(memory: Abstract.MemoryLike<N>): Memory<N> {
      if (memory instanceof Memory)
        return memory

      if (memory instanceof Uint8Array)
        return new Memory<N>(new wasm.Memory(memory))

      if (memory.inner instanceof wasm.Memory)
        return new Memory<N>(memory.inner)

      return new Memory<N>(new wasm.Memory(memory.bytes))
    }

    get bytes() {
      return this.inner.bytes as Uint8Array & Lengthed<N>
    }

  }

  class ChaCha20Cipher extends Abstract.ChaCha20Cipher {

    constructor(
      readonly inner: chaCha20Poly1305Wasm.ChaCha20Cipher
    ) {
      super()
    }

    [Symbol.dispose]() {
      this.inner[Symbol.dispose]()
    }

    static importOrThrow(key: Memory<32>, nonce: Memory<12>) {
      if (key instanceof Memory === false)
        throw new Error()
      if (nonce instanceof Memory === false)
        throw new Error()
      return new ChaCha20Cipher(new wasm.ChaCha20Cipher(key.inner, nonce.inner))
    }

    applyOrThrow(message: Memory) {
      if (message instanceof Memory === false)
        throw new Error()
      this.inner.apply_keystream(message.inner)
    }

  }

  class ChaCha20Poly1305Cipher extends Abstract.ChaCha20Poly1305Cipher {

    constructor(
      readonly inner: chaCha20Poly1305Wasm.ChaCha20Poly1305Cipher
    ) {
      super()
    }

    [Symbol.dispose]() {
      this.inner[Symbol.dispose]()
    }

    static importOrThrow(key: Memory<32>) {
      if (key instanceof Memory === false)
        throw new Error()
      return new ChaCha20Poly1305Cipher(new wasm.ChaCha20Poly1305Cipher(key.inner))
    }

    encryptOrThrow(message: Memory, nonce: Memory<12>) {
      if (message instanceof Memory === false)
        throw new Error()
      if (nonce instanceof Memory === false)
        throw new Error()
      return new Memory(this.inner.encrypt(message.inner, nonce.inner))
    }

    decryptOrThrow(message: Memory, nonce: Memory<12>) {
      if (message instanceof Memory === false)
        throw new Error()
      return new Memory(this.inner.decrypt(message.inner, nonce.inner))
    }

  }

  return { Memory, ChaCha20Cipher, ChaCha20Poly1305Cipher }
}