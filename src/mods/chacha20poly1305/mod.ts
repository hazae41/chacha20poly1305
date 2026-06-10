import { ChaCha20Poly1305Cipher, load, Memory } from "@hazae41/chacha20poly1305-wasm";

await load()

export class Cipher {

  /**
   * Do not use
   * @param inner 
   */
  constructor(
    readonly inner: ChaCha20Poly1305Cipher
  ) { }

  /**
   * Import a key
   * @param key 
   * @returns 
   */
  static import(key: Uint8Array): Cipher {
    return new Cipher(new ChaCha20Poly1305Cipher(new Memory(key)))
  }

  /**
   * Encrypt a message with a nonce
   * @param message 
   * @param nonce 
   * @returns 
   */
  encrypt(message: Uint8Array, nonce: Uint8Array): Uint8Array<ArrayBuffer> {
    return new Uint8Array(this.inner.encrypt(new Memory(message), new Memory(nonce)).bytes)
  }

  /**
   * Decrypt a message with a nonce
   * @param message 
   * @param nonce 
   * @returns 
   */
  decrypt(message: Uint8Array, nonce: Uint8Array): Uint8Array<ArrayBuffer> {
    return new Uint8Array(this.inner.decrypt(new Memory(message), new Memory(nonce)).bytes)
  }

}