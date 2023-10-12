import { BytesOrCopiable, Copiable } from "@hazae41/box"
import { None, Option } from "@hazae41/option"
import { Result } from "@hazae41/result"
import { DecryptError, EncryptError, ImportError } from "./errors.js"

let global: Option<Adapter> = new None()

export function get() {
  return global.unwrap()
}

export function set(value?: Adapter) {
  global = Option.wrap(value)
}

export interface Cipher extends Disposable {
  tryEncrypt(message: BytesOrCopiable, nonce: BytesOrCopiable<12>): Result<Copiable, EncryptError>
  tryDecrypt(message: BytesOrCopiable, nonce: BytesOrCopiable<12>): Result<Copiable, DecryptError>
}

export interface CipherFactory {
  tryImport(key: BytesOrCopiable<32>): Result<Cipher, ImportError>
}

export interface Adapter {
  readonly Cipher: CipherFactory
}