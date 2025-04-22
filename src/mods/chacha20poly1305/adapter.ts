import { None, Nullable, Option } from "@hazae41/option"
import { Cipher } from "./abstract.js"

let global: Option<Adapter> = new None()

export function get() {
  return global
}

export function set(value: Nullable<Adapter>) {
  global = Option.wrap(value)
}

export interface Adapter {
  readonly Cipher: typeof Cipher
}