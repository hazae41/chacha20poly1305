import { None, Nullable, Option } from "@hazae41/option"
import { Messenger, Streamer } from "./abstract.js"

let global: Option<Adapter> = new None()

export function get() {
  return global
}

export function set(value: Nullable<Adapter>) {
  global = Option.wrap(value)
}

export interface Adapter {

  readonly ChaCha20Cipher: typeof Streamer

  readonly ChaCha20Poly1305Cipher: typeof Messenger

}