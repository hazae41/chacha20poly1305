import { chaCha20Poly1305Wasm } from "@hazae41/chacha20poly1305-wasm";

await chaCha20Poly1305Wasm.load()

export class Cipher {

  #inner: chaCha20Poly1305Wasm.ChaCha20Poly1305Cipher

  constructor(key: Uint8Array) {
    const { Memory, ChaCha20Poly1305Cipher } = chaCha20Poly1305Wasm

    this.#inner = new ChaCha20Poly1305Cipher(new Memory(key))

    return
  }

  encrypt(message: Uint8Array, nonce: Uint8Array): Uint8Array {
    const { Memory } = chaCha20Poly1305Wasm

    const result = this.#inner.encrypt(new Memory(message), new Memory(nonce))

    return result.bytes
  }

  decrypt(message: Uint8Array, nonce: Uint8Array): Uint8Array {
    const { Memory } = chaCha20Poly1305Wasm

    const result = this.#inner.decrypt(new Memory(message), new Memory(nonce))

    return result.bytes
  }

}