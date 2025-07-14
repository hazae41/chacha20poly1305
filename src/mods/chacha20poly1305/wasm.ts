import { Ref } from "@hazae41/box"
import { type ChaCha20Poly1305Wasm } from "@hazae41/chacha20poly1305.wasm"
import { BytesOrMemory } from "libs/copiable/index.js"
import * as Abstract from "./abstract.js"
import { Adapter } from "./adapter.js"

export function fromWasm(Wasm: typeof ChaCha20Poly1305Wasm) {

  function getMemory(bytesOrCopiable: BytesOrMemory) {
    if (bytesOrCopiable instanceof Wasm.Memory)
      return Ref.with(bytesOrCopiable, () => { })

    if (bytesOrCopiable instanceof Uint8Array)
      return Ref.wrap(new Wasm.Memory(bytesOrCopiable))

    return Ref.wrap(new Wasm.Memory(bytesOrCopiable.bytes))
  }

  class ChaCha20Cipher extends Abstract.Streamer {

    constructor(
      readonly inner: ChaCha20Poly1305Wasm.ChaCha20Cipher
    ) {
      super()
    }

    [Symbol.dispose]() {
      using _ = this.inner
    }

    static create(inner: ChaCha20Poly1305Wasm.ChaCha20Cipher) {
      return new ChaCha20Cipher(inner)
    }

    static importOrThrow(key: BytesOrMemory<32>, nonce: BytesOrMemory<12>) {
      using mkey = getMemory(key)
      using mnonce = getMemory(nonce)

      return new ChaCha20Cipher(new Wasm.ChaCha20Cipher(mkey.value, mnonce.value))
    }

    applyOrThrow(message: BytesOrMemory) {
      using mmessage = getMemory(message)

      this.inner.apply_keystream(mmessage.value)
    }

  }

  class ChaCha20Poly1305Cipher extends Abstract.Messenger {

    constructor(
      readonly inner: ChaCha20Poly1305Wasm.ChaCha20Poly1305Cipher
    ) {
      super()
    }

    [Symbol.dispose]() {
      using _ = this.inner
    }

    static create(inner: ChaCha20Poly1305Wasm.ChaCha20Poly1305Cipher) {
      return new ChaCha20Poly1305Cipher(inner)
    }

    static importOrThrow(key: BytesOrMemory<32>) {
      using mkey = getMemory(key)

      return new ChaCha20Poly1305Cipher(new Wasm.ChaCha20Poly1305Cipher(mkey.value))
    }

    encryptOrThrow(message: BytesOrMemory, nonce: BytesOrMemory<12>) {
      using mmessage = getMemory(message)
      using mnonce = getMemory(nonce)

      return this.inner.encrypt(mmessage.value, mnonce.value)
    }

    decryptOrThrow(message: BytesOrMemory, nonce: BytesOrMemory<12>) {
      using mmessage = getMemory(message)
      using mnonce = getMemory(nonce)

      return this.inner.decrypt(mmessage.value, mnonce.value)
    }

  }

  return { ChaCha20Cipher, ChaCha20Poly1305Cipher } satisfies Adapter
}