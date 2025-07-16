import { Lengthed } from "@hazae41/lengthed"
import { Ownable } from "libs/ownable/index.js"

export namespace Abstract {

  export abstract class Memory<N extends number = number> {

    abstract [Symbol.dispose](): void

    abstract readonly inner: unknown

    abstract readonly bytes: Uint8Array & Lengthed<N>

  }

  export namespace Memory {

    export interface Static {

      fromOrThrow<N extends number>(memory: Memory<N>): Ownable<Memory<N>>

      importOrThrow<N extends number>(bytes: Uint8Array & Lengthed<N>): Memory<N>

    }

  }

  export abstract class ChaCha20Cipher implements Disposable {

    abstract [Symbol.dispose](): void

    abstract applyOrThrow(message: Memory): void

  }

  export namespace ChaCha20Cipher {

    export interface Static {

      importOrThrow(key: Memory<32>, nonce: Memory<12>): ChaCha20Cipher

    }

  }

  export abstract class ChaCha20Poly1305Cipher implements Disposable {

    abstract [Symbol.dispose](): void

    abstract encryptOrThrow(message: Memory, nonce: Memory<12>): Memory

    abstract decryptOrThrow(message: Memory, nonce: Memory<12>): Memory

  }

  export namespace ChaCha20Poly1305Cipher {

    export interface Static {

      importOrThrow(key: Memory<32>): ChaCha20Poly1305Cipher

    }

  }

}