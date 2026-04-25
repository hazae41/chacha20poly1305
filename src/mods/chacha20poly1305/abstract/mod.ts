export namespace Abstract {

  export type MemoryLike = Memory | Uint8Array

  export abstract class Memory implements Disposable {

    abstract [Symbol.dispose](): void

    abstract readonly inner: unknown

    abstract readonly bytes: Uint8Array

  }

  export namespace Memory {

    export interface Static {

      fromOrThrow(memory: MemoryLike): Memory

    }

  }

  export abstract class ChaCha20Cipher implements Disposable {

    abstract [Symbol.dispose](): void

    abstract applyOrThrow(message: Memory): void

  }

  export namespace ChaCha20Cipher {

    export interface Static {

      importOrThrow(key: Memory, nonce: Memory): ChaCha20Cipher

    }

  }

  export abstract class ChaCha20Poly1305Cipher implements Disposable {

    abstract [Symbol.dispose](): void

    abstract encryptOrThrow(message: Memory, nonce: Memory): Memory

    abstract decryptOrThrow(message: Memory, nonce: Memory): Memory

  }

  export namespace ChaCha20Poly1305Cipher {

    export interface Static {

      importOrThrow(key: Memory): ChaCha20Poly1305Cipher

    }

  }

}