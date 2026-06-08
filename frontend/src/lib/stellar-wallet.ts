import { isConnected, getAddress, signTransaction } from "@stellar/freighter-api";

export async function checkConnection() {
  return await isConnected();
}

export async function connectWallet() {
  if (await isConnected()) {
    const result = await getAddress();
    return result.address ? result.address : null;
  }
  return null;
}

export async function signWithFreighter(xdr: string, network: string, signWith?: string) {
  return await signTransaction(xdr, { networkPassphrase: network, address: signWith });
}
