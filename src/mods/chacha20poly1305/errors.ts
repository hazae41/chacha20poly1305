export type AnyError =
  | ImportError
  | EncryptError
  | DecryptError

export class ImportError extends Error {
  readonly #class = ImportError
  readonly name = this.#class.name

  constructor(options?: ErrorOptions) {
    super(`Could not import`, options)
  }

  static from(cause: unknown) {
    return new ImportError({ cause })
  }

}

export class EncryptError extends Error {
  readonly #class = EncryptError
  readonly name = this.#class.name

  constructor(options?: ErrorOptions) {
    super(`Could not encrypt`, options)
  }

  static from(cause: unknown) {
    return new EncryptError({ cause })
  }

}

export class DecryptError extends Error {
  readonly #class = DecryptError
  readonly name = this.#class.name

  constructor(options?: ErrorOptions) {
    super(`Could not decrypt`, options)
  }

  static from(cause: unknown) {
    return new DecryptError({ cause })
  }

}