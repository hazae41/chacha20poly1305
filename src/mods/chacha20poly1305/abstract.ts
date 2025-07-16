import { Lengthed } from "@hazae41/lengthed"
import { Ownable } from "libs/ownable/index.js"

export namespace Abstract {

  export abstract class Memory<N extends number = number> {

    constructor(..._: any[]) { }

    static fromOrThrow<N extends number = number>(memory: Memory<N>): Ownable<Memory<N>> {
      throw new Error("Not implemented")
    }

    static importOrThrow<N extends number = number>(bytes: Uint8Array & Lengthed<N>): Memory<N> {
      throw new Error("Not implemented")
    }

    abstract [Symbol.dispose](): void

    abstract readonly inner: unknown

    abstract readonly bytes: Uint8Array & Lengthed<N>

  }

  export abstract class ChaCha20Cipher implements Disposable {

    constructor(..._: any[]) { }

    static importOrThrow(key: Memory<32>, nonce: Memory<12>): ChaCha20Cipher {
      throw new Error("Not implemented")
    }

    abstract [Symbol.dispose](): void

    abstract applyOrThrow(message: Memory): void

  }

  export abstract class ChaCha20Poly1305Cipher implements Disposable {

    constructor(..._: any[]) { }

    static importOrThrow(key: Memory<32>): ChaCha20Poly1305Cipher {
      throw new Error("Not implemented")
    }

    abstract [Symbol.dispose](): void

    abstract encryptOrThrow(message: Memory, nonce: Memory<12>): Memory

    abstract decryptOrThrow(message: Memory, nonce: Memory<12>): Memory

  }

}