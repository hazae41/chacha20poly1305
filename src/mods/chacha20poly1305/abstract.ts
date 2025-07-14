import { Memory } from "@hazae41/memory"
import { BytesOrMemory } from "libs/copiable/index.js"

export abstract class Messenger implements Disposable {

  constructor(..._: any[]) { }

  static importOrThrow(key: BytesOrMemory<32>): Messenger {
    throw new Error("Method not implemented.")
  }

  abstract [Symbol.dispose](): void

  abstract encryptOrThrow(message: BytesOrMemory, nonce: BytesOrMemory<12>): Memory

  abstract decryptOrThrow(message: BytesOrMemory, nonce: BytesOrMemory<12>): Memory

}

export abstract class Streamer implements Disposable {

  constructor(..._: any[]) { }

  static importOrThrow(key: BytesOrMemory<32>, nonce: BytesOrMemory<12>): Streamer {
    throw new Error("Method not implemented.")
  }

  abstract [Symbol.dispose](): void

  abstract applyOrThrow(message: BytesOrMemory): void

}