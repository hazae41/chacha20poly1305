import { Box } from "@hazae41/box"
import type { ChaCha20Poly1305Cipher, ChaCha20Poly1305Wasm } from "@hazae41/chacha20poly1305.wasm"
import { BytesOrCopiable } from "libs/copiable/index.js"
import { Adapter } from "./adapter.js"

export function fromWasm(wasm: typeof ChaCha20Poly1305Wasm) {
  const { Memory, ChaCha20Poly1305Cipher } = wasm

  function getMemory(bytesOrCopiable: BytesOrCopiable) {
    if (bytesOrCopiable instanceof Memory)
      return Box.createAsDropped(bytesOrCopiable)
    if (bytesOrCopiable instanceof Uint8Array)
      return Box.create(new Memory(bytesOrCopiable))
    return Box.create(new Memory(bytesOrCopiable.bytes))
  }

  class Cipher {

    constructor(
      readonly inner: ChaCha20Poly1305Cipher
    ) { }

    [Symbol.dispose]() {
      using _ = this.inner
    }

    static create(inner: ChaCha20Poly1305Cipher) {
      return new Cipher(inner)
    }

    static importOrThrow(key: BytesOrCopiable<32>) {
      using mkey = getMemory(key)

      return new Cipher(new ChaCha20Poly1305Cipher(mkey.value))
    }

    encryptOrThrow(message: BytesOrCopiable, nonce: BytesOrCopiable<12>) {
      using mmessage = getMemory(message)
      using mnonce = getMemory(nonce)

      return this.inner.encrypt(mmessage.value, mnonce.value)
    }

    decryptOrThrow(message: BytesOrCopiable, nonce: BytesOrCopiable<12>) {
      using mmessage = getMemory(message)
      using mnonce = getMemory(nonce)

      return this.inner.decrypt(mmessage.value, mnonce.value)
    }

  }

  return { Cipher } satisfies Adapter
}