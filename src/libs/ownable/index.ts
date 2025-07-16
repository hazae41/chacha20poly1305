export type Ownable<T extends Disposable> =
  | Owned<T>
  | Unowned<T>

export class Owned<T extends Disposable> {

  constructor(
    readonly value: T
  ) { }

  [Symbol.dispose]() {
    this.value[Symbol.dispose]()
  }

  get() {
    return this.value
  }

}

export class Unowned<T extends Disposable> {

  constructor(
    readonly value: T
  ) { }

  [Symbol.dispose]() {
    // NOOP
  }

  get() {
    return this.value
  }

}