import { None, Nullable, Option } from "@hazae41/option"
import { BytesOrCopiable, Copiable } from "libs/copiable/index.js"

let global: Option<Adapter> = new None()

export function get() {
  return global
}

export function set(value: Nullable<Adapter>) {
  global = Option.wrap(value)
}

export interface Cipher extends Disposable {
  encryptOrThrow(message: BytesOrCopiable, nonce: BytesOrCopiable<12>): Copiable
  decryptOrThrow(message: BytesOrCopiable, nonce: BytesOrCopiable<12>): Copiable
}

export interface CipherFactory {
  importOrThrow(key: BytesOrCopiable<32>): Cipher
}

export interface Adapter {
  readonly Cipher: CipherFactory
}