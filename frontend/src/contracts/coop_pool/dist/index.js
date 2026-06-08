import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
if (typeof window !== "undefined") {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABQAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAANTmV4dFJlcXVlc3RJZAAAAAAAAAEAAAAAAAAAB1JlcXVlc3QAAAAAAQAAAAQAAAABAAAAAAAAAA1Ecml2ZXJCYWxhbmNlAAAAAAAAAQAAABMAAAAAAAAAAAAAAAVUb2tlbgAAAA==",
            "AAAAAQAAAAAAAAAAAAAADVBheW91dFJlcXVlc3QAAAAAAAAEAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAACGFwcHJvdmVkAAAAAQAAAAAAAAAGZHJpdmVyAAAAAAATAAAAAAAAAAZyZWFzb24AAAAAABE=",
            "AAAAAAAAAAAAAAAKY29udHJpYnV0ZQAAAAAAAgAAAAAAAAAGZHJpdmVyAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
            "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAV0b2tlbgAAAAAAABMAAAAA",
            "AAAAAAAAAAAAAAALZ2V0X3JlcXVlc3QAAAAAAQAAAAAAAAAKcmVxdWVzdF9pZAAAAAAABAAAAAEAAAfQAAAADVBheW91dFJlcXVlc3QAAAA=",
            "AAAAAAAAAAAAAAAOYXBwcm92ZV9wYXlvdXQAAAAAAAEAAAAAAAAACnJlcXVlc3RfaWQAAAAAAAQAAAAA",
            "AAAAAAAAAAAAAAAOcmVxdWVzdF9wYXlvdXQAAAAAAAMAAAAAAAAABmRyaXZlcgAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAZyZWFzb24AAAAAABEAAAABAAAABA==",
            "AAAAAAAAAAAAAAAQZ2V0X3Bvb2xfYmFsYW5jZQAAAAAAAAABAAAACw==",
            "AAAAAAAAAAAAAAATZ2V0X25leHRfcmVxdWVzdF9pZAAAAAAAAAAAAQAAAAQ=",
            "AAAAAAAAAAAAAAAXZ2V0X2RyaXZlcl9jb250cmlidXRpb24AAAAAAQAAAAAAAAAGZHJpdmVyAAAAAAATAAAAAQAAAAs="]), options);
        this.options = options;
    }
    fromJSON = {
        contribute: (this.txFromJSON),
        initialize: (this.txFromJSON),
        get_request: (this.txFromJSON),
        approve_payout: (this.txFromJSON),
        request_payout: (this.txFromJSON),
        get_pool_balance: (this.txFromJSON),
        get_next_request_id: (this.txFromJSON),
        get_driver_contribution: (this.txFromJSON)
    };
}
