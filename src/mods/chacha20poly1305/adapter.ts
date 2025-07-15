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

  readonly Memory: typeof Abstract.Memory

  readonly ChaCha20Cipher: typeof Abstract.ChaCha20Cipher

  readonly ChaCha20Poly1305Cipher: typeof Abstract.ChaCha20Poly1305Cipher

}