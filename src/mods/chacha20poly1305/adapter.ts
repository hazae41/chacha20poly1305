import { Box, Copiable } from "@hazae41/box"
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
  tryEncrypt(message: Box<Copiable>, nonce: Box<Copiable<Uint8Array & { length: 12 }>>): Result<Copiable, EncryptError>
  tryDecrypt(message: Box<Copiable>, nonce: Box<Copiable<Uint8Array & { length: 12 }>>): Result<Copiable, DecryptError>
}

export interface CipherFactory {
  tryImport(key: Box<Copiable<Uint8Array & { length: 32 }>>): Result<Cipher, ImportError>
}

export interface Adapter {
  readonly Cipher: CipherFactory
}