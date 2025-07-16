import { None, Nullable, Option } from "@hazae41/option"
import { Abstract } from "./abstract.js"

let global: Option<Adapter> = new None()

export function get() {
  return global
}

export function set(value: Nullable<Adapter>) {
  global = Option.wrap(value)
}

export interface Adapter {

  readonly Memory: Abstract.Memory.Static

  readonly ChaCha20Cipher: Abstract.ChaCha20Cipher.Static

  readonly ChaCha20Poly1305Cipher: Abstract.ChaCha20Poly1305Cipher.Static

}