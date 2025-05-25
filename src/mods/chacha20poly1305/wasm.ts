import { Pin, Ref } from "@hazae41/box"
import type { ChaCha20Poly1305Cipher, ChaCha20Poly1305Wasm } from "@hazae41/chacha20poly1305.wasm"
import { BytesOrCopiable } from "libs/copiable/index.js"
import * as Abstract from "./abstract.js"
import { Adapter } from "./adapter.js"

export function fromWasm(wasm: typeof ChaCha20Poly1305Wasm) {
  const { Memory, ChaCha20Poly1305Cipher } = wasm

  function getMemory(bytesOrCopiable: BytesOrCopiable) {
    if (bytesOrCopiable instanceof Memory)
      return new Ref(bytesOrCopiable)

    if (bytesOrCopiable instanceof Uint8Array)
      return Pin.from(new Memory(bytesOrCopiable))

    return Pin.from(new Memory(bytesOrCopiable.bytes))
  }

  class Cipher extends Abstract.Cipher {

    constructor(
      readonly inner: ChaCha20Poly1305Cipher
    ) {
      super()
    }

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