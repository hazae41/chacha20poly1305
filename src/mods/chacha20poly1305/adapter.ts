import { Lengthed } from "@hazae41/lengthed"
import { None, Nullable, Option } from "@hazae41/option"

let global: Option<Adapter> = new None()

export function get() {
  return global
}

export function set(value: Nullable<Adapter>) {
  global = Option.wrap(value)
}

export interface Adapter {

  readonly Memory: typeof Memory

  readonly ChaCha20Cipher: typeof ChaCha20Cipher

  readonly ChaCha20Poly1305Cipher: typeof ChaCha20Poly1305Cipher

}

export abstract class Memory<N extends number = number> {

  constructor(..._: any[]) { }

  static importOrThrow<N extends number = number>(bytes: Uint8Array & Lengthed<N>): Memory<N> {
    return get().getOrThrow().Memory.importOrThrow(bytes)
  }

  abstract [Symbol.dispose](): void

  abstract readonly bytes: Uint8Array & Lengthed<N>

}

export abstract class ChaCha20Cipher implements Disposable {

  constructor(..._: any[]) { }

  static importOrThrow(key: Memory<32>, nonce: Memory<12>): ChaCha20Cipher {
    return get().getOrThrow().ChaCha20Cipher.importOrThrow(key, nonce)
  }

  abstract [Symbol.dispose](): void

  abstract applyOrThrow(message: Memory): void

}

export abstract class ChaCha20Poly1305Cipher implements Disposable {

  constructor(..._: any[]) { }

  static importOrThrow(key: Memory<32>): ChaCha20Poly1305Cipher {
    return get().getOrThrow().ChaCha20Poly1305Cipher.importOrThrow(key)
  }

  abstract [Symbol.dispose](): void

  abstract encryptOrThrow(message: Memory, nonce: Memory<12>): Memory

  abstract decryptOrThrow(message: Memory, nonce: Memory<12>): Memory

}