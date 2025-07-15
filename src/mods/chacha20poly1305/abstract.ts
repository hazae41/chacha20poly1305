import { Lengthed } from "@hazae41/lengthed"

export abstract class Memory<N extends number = number> {

  constructor(..._: any[]) { }

  static importOrThrow<N extends number = number>(bytes: Uint8Array & Lengthed<N>): Memory<N> {
    throw new Error("Method not implemented.")
  }

  abstract [Symbol.dispose](): void

  abstract readonly bytes: Uint8Array & Lengthed<N>

}

export abstract class Messenger implements Disposable {

  constructor(..._: any[]) { }

  static importOrThrow(key: Memory<32>): Messenger {
    throw new Error("Method not implemented.")
  }

  abstract [Symbol.dispose](): void

  abstract encryptOrThrow(message: Memory, nonce: Memory<12>): Memory

  abstract decryptOrThrow(message: Memory, nonce: Memory<12>): Memory

}

export abstract class Streamer implements Disposable {

  constructor(..._: any[]) { }

  static importOrThrow(key: Memory<32>, nonce: Memory<12>): Streamer {
    throw new Error("Method not implemented.")
  }

  abstract [Symbol.dispose](): void

  abstract applyOrThrow(message: Memory): void

}