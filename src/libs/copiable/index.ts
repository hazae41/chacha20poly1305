import { Lengthed } from "@hazae41/lengthed"
import { Memory } from "@hazae41/memory"

export type BytesOrMemory<N extends number = number> =
  | Uint8Array & Lengthed<N>
  | Memory<N>