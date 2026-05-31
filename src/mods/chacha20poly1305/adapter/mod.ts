import type { Nullable } from "@/libs/nullable/mod.ts";
import { Option, Result } from "@hazae41/result-and-option";
import type { Abstract } from "../abstract/mod.ts";
import { fromWasm } from "../wasm/mod.ts";

let global: Option<Adapter> = await Result.runAndWrap(async () => {
  return await import("@hazae41/chacha20poly1305-wasm").then(x => fromWasm(x.chaCha20Poly1305Wasm))
}).then(r => r.ok())

export function get(): Option<Adapter> {
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