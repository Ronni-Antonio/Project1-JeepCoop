import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}




export type DataKey = {tag: "Admin", values: void} | {tag: "NextRequestId", values: void} | {tag: "Request", values: readonly [u32]} | {tag: "DriverBalance", values: readonly [string]} | {tag: "Token", values: void};


export interface PayoutRequest {
  amount: i128;
  approved: boolean;
  driver: string;
  reason: string;
}

export interface Client {
  /**
   * Construct and simulate a contribute transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  contribute: ({driver, amount}: {driver: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: ({admin, token}: {admin: string, token: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_request transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_request: ({request_id}: {request_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<PayoutRequest>>

  /**
   * Construct and simulate a approve_payout transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  approve_payout: ({request_id}: {request_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a request_payout transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  request_payout: ({driver, amount, reason}: {driver: string, amount: i128, reason: string}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a get_pool_balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_pool_balance: (options?: MethodOptions) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a get_next_request_id transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_next_request_id: (options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a get_driver_contribution transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_driver_contribution: ({driver}: {driver: string}, options?: MethodOptions) => Promise<AssembledTransaction<i128>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABQAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAANTmV4dFJlcXVlc3RJZAAAAAAAAAEAAAAAAAAAB1JlcXVlc3QAAAAAAQAAAAQAAAABAAAAAAAAAA1Ecml2ZXJCYWxhbmNlAAAAAAAAAQAAABMAAAAAAAAAAAAAAAVUb2tlbgAAAA==",
        "AAAAAQAAAAAAAAAAAAAADVBheW91dFJlcXVlc3QAAAAAAAAEAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAACGFwcHJvdmVkAAAAAQAAAAAAAAAGZHJpdmVyAAAAAAATAAAAAAAAAAZyZWFzb24AAAAAABE=",
        "AAAAAAAAAAAAAAAKY29udHJpYnV0ZQAAAAAAAgAAAAAAAAAGZHJpdmVyAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAV0b2tlbgAAAAAAABMAAAAA",
        "AAAAAAAAAAAAAAALZ2V0X3JlcXVlc3QAAAAAAQAAAAAAAAAKcmVxdWVzdF9pZAAAAAAABAAAAAEAAAfQAAAADVBheW91dFJlcXVlc3QAAAA=",
        "AAAAAAAAAAAAAAAOYXBwcm92ZV9wYXlvdXQAAAAAAAEAAAAAAAAACnJlcXVlc3RfaWQAAAAAAAQAAAAA",
        "AAAAAAAAAAAAAAAOcmVxdWVzdF9wYXlvdXQAAAAAAAMAAAAAAAAABmRyaXZlcgAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAZyZWFzb24AAAAAABEAAAABAAAABA==",
        "AAAAAAAAAAAAAAAQZ2V0X3Bvb2xfYmFsYW5jZQAAAAAAAAABAAAACw==",
        "AAAAAAAAAAAAAAATZ2V0X25leHRfcmVxdWVzdF9pZAAAAAAAAAAAAQAAAAQ=",
        "AAAAAAAAAAAAAAAXZ2V0X2RyaXZlcl9jb250cmlidXRpb24AAAAAAQAAAAAAAAAGZHJpdmVyAAAAAAATAAAAAQAAAAs=" ]),
      options
    )
  }
  public readonly fromJSON = {
    contribute: this.txFromJSON<null>,
        initialize: this.txFromJSON<null>,
        get_request: this.txFromJSON<PayoutRequest>,
        approve_payout: this.txFromJSON<null>,
        request_payout: this.txFromJSON<u32>,
        get_pool_balance: this.txFromJSON<i128>,
        get_next_request_id: this.txFromJSON<u32>,
        get_driver_contribution: this.txFromJSON<i128>
  }
}