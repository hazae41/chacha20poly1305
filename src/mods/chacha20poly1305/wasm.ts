import { type ChaCha20Poly1305Wasm } from "@hazae41/chacha20poly1305.wasm"

import { Lengthed } from "@hazae41/lengthed"
import { Ownable, Owned, Unowned } from "libs/ownable/index.js"
import { Abstract } from "./abstract.js"
import { Adapter } from "./adapter.js"

export function fromWasm(Wasm: typeof ChaCha20Poly1305Wasm) {

  class Memory<N extends number = number> extends Abstract.Memory {

    constructor(
      readonly inner: ChaCha20Poly1305Wasm.Memory
    ) {
      super()
    }

    static fromOrThrow<N extends number = number>(memory: Abstract.Memory<N>): Ownable<Memory<N>> {
      if (memory instanceof Memory)
        return new Unowned(memory)
      if (memory.inner instanceof Wasm.Memory)
        return new Unowned(new Memory(memory.inner))

      const inner = new Wasm.Memory(memory.bytes)

      return new Owned(new Memory<N>(inner))
    }

    static importOrThrow<N extends number = number>(bytes: Uint8Array & Lengthed<N>): Memory<N> {
      return new Memory<N>(new Wasm.Memory(bytes))
    }

    [Symbol.dispose]() {
      this.inner[Symbol.dispose]()
    }

    get bytes() {
      return this.inner.bytes as Uint8Array & Lengthed<N>
    }

  }

  class ChaCha20Cipher extends Abstract.ChaCha20Cipher {

    constructor(
      readonly inner: ChaCha20Poly1305Wasm.ChaCha20Cipher
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
      return new ChaCha20Cipher(new Wasm.ChaCha20Cipher(key.inner, nonce.inner))
    }

    applyOrThrow(message: Memory) {
      if (message instanceof Memory === false)
        throw new Error()
      this.inner.apply_keystream(message.inner)
    }

  }

  class ChaCha20Poly1305Cipher extends Abstract.ChaCha20Poly1305Cipher {

    constructor(
      readonly inner: ChaCha20Poly1305Wasm.ChaCha20Poly1305Cipher
    ) {
      super()
    }

    [Symbol.dispose]() {
      this.inner[Symbol.dispose]()
    }

    static importOrThrow(key: Memory<32>) {
      if (key instanceof Memory === false)
        throw new Error()
      return new ChaCha20Poly1305Cipher(new Wasm.ChaCha20Poly1305Cipher(key.inner))
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

  return { Memory, ChaCha20Cipher, ChaCha20Poly1305Cipher } satisfies Adapter
}