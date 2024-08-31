export type BytesOrCopiable<N extends number = number> =
  | Uint8Array & { readonly length: N }
  | Copiable<N>

export interface Copiable<N extends number = number> extends Disposable {
  readonly bytes: Uint8Array & { readonly length: N }
}

export class Copied<N extends number = number> implements Copiable<N> {

  constructor(
    readonly bytes: Uint8Array & { readonly length: N }
  ) { }

  [Symbol.dispose]() { }

}