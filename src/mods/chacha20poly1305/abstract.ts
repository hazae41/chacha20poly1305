import { BytesOrCopiable, Copiable } from "libs/copiable/index.js"

export abstract class Cipher implements Disposable {

  constructor(..._: any[]) { }

  static importOrThrow(bytes: BytesOrCopiable<32>): Cipher {
    throw new Error("Method not implemented.")
  }

  abstract [Symbol.dispose](): void

  abstract encryptOrThrow(message: BytesOrCopiable, nonce: BytesOrCopiable<12>): Copiable

  abstract decryptOrThrow(message: BytesOrCopiable, nonce: BytesOrCopiable<12>): Copiable

}