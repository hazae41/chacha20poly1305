import { Cursor, CursorWriteError } from "@hazae41/cursor"
import { None, Option } from "@hazae41/option"
import { Ok, Result } from "@hazae41/result"
import { CryptoError } from "libs/crypto/crypto.js"

let global: Option<Adapter> = new None()

export function get() {
  return global.unwrap()
}

export function set(value?: Adapter) {
  global = Option.wrap(value)
}

export interface Copiable extends Disposable {
  readonly bytes: Uint8Array

  copyAndDispose(): Uint8Array

  trySize(): Result<number, never>

  tryWrite(cursor: Cursor): Result<void, CursorWriteError>
}

export class Copied implements Copiable {

  /**
   * A copiable that's already copied
   * @param bytes 
   */
  constructor(
    readonly bytes: Uint8Array
  ) { }

  [Symbol.dispose]() { }

  static new(bytes: Uint8Array) {
    return new Copied(bytes)
  }

  static from(buffer: ArrayBuffer) {
    return new Copied(new Uint8Array(buffer))
  }

  copyAndDispose() {
    return this.bytes
  }

  trySize(): Result<number, never> {
    return new Ok(this.bytes.length)
  }

  tryWrite(cursor: Cursor): Result<void, CursorWriteError> {
    return cursor.tryWrite(this.bytes)
  }

}

export interface Cipher extends Disposable {
  tryEncrypt(message: Uint8Array, nonce: Uint8Array & { length: 12 }): Result<Copiable, CryptoError>
  tryDecrypt(message: Uint8Array, nonce: Uint8Array & { length: 12 }): Result<Copiable, CryptoError>
}

export interface CipherFactory {
  tryImport(key: Uint8Array & { length: 32 }): Result<Cipher, CryptoError>
}

export interface Adapter {
  readonly Cipher: CipherFactory
}