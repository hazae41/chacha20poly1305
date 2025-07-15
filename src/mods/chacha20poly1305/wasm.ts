import { type ChaCha20Poly1305Wasm } from "@hazae41/chacha20poly1305.wasm"

import { Lengthed } from "@hazae41/lengthed"
import * as Abstract from "./adapter.js"
import { Adapter } from "./adapter.js"

export function fromWasm(Wasm: typeof ChaCha20Poly1305Wasm) {

  class Memory<N extends number = number> extends Abstract.Memory {

    constructor(
      readonly inner: ChaCha20Poly1305Wasm.Memory
    ) {
      super()
    }

    static importOrThrow<N extends number = number>(bytes: Uint8Array & Lengthed<N>) {
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
      using _ = this.inner
    }

    static create(inner: ChaCha20Poly1305Wasm.ChaCha20Cipher) {
      return new ChaCha20Cipher(inner)
    }

    static importOrThrow(key: Memory<32>, nonce: Memory<12>) {
      return new ChaCha20Cipher(new Wasm.ChaCha20Cipher(key.inner, nonce.inner))
    }

    applyOrThrow(message: Memory) {
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
      using _ = this.inner
    }

    static create(inner: ChaCha20Poly1305Wasm.ChaCha20Poly1305Cipher) {
      return new ChaCha20Poly1305Cipher(inner)
    }

    static importOrThrow(key: Memory<32>) {
      return new ChaCha20Poly1305Cipher(new Wasm.ChaCha20Poly1305Cipher(key.inner))
    }

    encryptOrThrow(message: Memory, nonce: Memory<12>) {
      return new Memory(this.inner.encrypt(message.inner, nonce.inner))
    }

    decryptOrThrow(message: Memory, nonce: Memory<12>) {
      return new Memory(this.inner.decrypt(message.inner, nonce.inner))
    }

  }

  return { Memory, ChaCha20Cipher, ChaCha20Poly1305Cipher } satisfies Adapter
}