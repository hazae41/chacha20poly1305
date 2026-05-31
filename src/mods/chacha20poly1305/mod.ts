import { chaCha20Poly1305Wasm } from "@hazae41/chacha20poly1305-wasm";

await chaCha20Poly1305Wasm.load()

export class Cipher {

  /**
   * Do not use
   * @param inner 
   */
  constructor(
    readonly inner: chaCha20Poly1305Wasm.ChaCha20Poly1305Cipher
  ) { }

  /**
   * Import a key
   * @param key 
   * @returns 
   */
  static import(key: Uint8Array) {
    const { Memory, ChaCha20Poly1305Cipher } = chaCha20Poly1305Wasm

    const inner = new ChaCha20Poly1305Cipher(new Memory(key))

    return new Cipher(inner)
  }

  /**
   * Encrypt a message with a nonce
   * @param message 
   * @param nonce 
   * @returns 
   */
  encrypt(message: Uint8Array, nonce: Uint8Array): Uint8Array {
    const { Memory } = chaCha20Poly1305Wasm

    const result = this.inner.encrypt(new Memory(message), new Memory(nonce))

    return new Uint8Array(result.bytes)
  }

  /**
   * Decrypt a message with a nonce
   * @param message 
   * @param nonce 
   * @returns 
   */
  decrypt(message: Uint8Array, nonce: Uint8Array): Uint8Array {
    const { Memory } = chaCha20Poly1305Wasm

    const result = this.inner.decrypt(new Memory(message), new Memory(nonce))

    return new Uint8Array(result.bytes)
  }

}