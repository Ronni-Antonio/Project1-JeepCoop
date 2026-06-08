"use client";

import { useState, useEffect } from "react";
import { connectWallet } from "@/lib/stellar-wallet";
import { Client as CoopClient } from "@/contracts/coop_pool";

const CONTRACT_ID = "CC..."; // Replace with deployed contract ID
const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
const RPC_URL = "https://soroban-testnet.stellar.org";

export default function Home() {
  const [address, setAddress] = useState<string | null>(null);
  const [poolBalance, setPoolBalance] = useState<string>("0");
  const [myContribution, setMyContribution] = useState<string>("0");
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [showForm, setShowForm] = useState<"contribute" | "request" | null>(null);

  const client = new CoopClient({
    contractId: CONTRACT_ID,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
  });

  useEffect(() => {
    if (address) {
      refreshData();
    }
  }, [address]);

  async function refreshData() {
    if (CONTRACT_ID.startsWith("CC")) return; // Skip if placeholder
    try {
      const balance = await client.get_pool_balance();
      setPoolBalance(balance.result.toString());
      
      const contribution = await client.get_driver_contribution({ driver: address! });
      setMyContribution(contribution.result.toString());

      const nextId = await client.get_next_request_id();
      const reqs = [];
      for (let i = 0; i < Number(nextId.result); i++) {
        const req = await client.get_request({ request_id: i });
        reqs.push({ id: i, ...req.result });
      }
      setRequests(reqs.reverse());
    } catch (e) {
      console.warn("Could not fetch data from contract", e);
    }
  }

  async function handleConnect() {
    const pubKey = await connectWallet();
    if (pubKey) setAddress(pubKey);
  }

  async function handleContribute() {
    if (!address || !amount) return;
    setLoading(true);
    try {
      const tx = await client.contribute({ 
        driver: address, 
        amount: BigInt(amount) 
      });
      await tx.signAndSend();
      alert("Contribution successful!");
      setShowForm(null);
      setAmount("");
      refreshData();
    } catch (e: any) {
      console.error(e);
      alert("Error: " + (e.message || "Check console"));
    }
    setLoading(false);
  }

  async function handleRequestPayout() {
    if (!address || !amount || !reason) return;
    setLoading(true);
    try {
      const tx = await client.request_payout({
        driver: address,
        amount: BigInt(amount),
        reason: reason
      });
      await tx.signAndSend();
      alert("Payout request submitted!");
      setShowForm(null);
      setAmount("");
      setReason("");
      refreshData();
    } catch (e: any) {
      console.error(e);
      alert("Error: " + (e.message || "Check console"));
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-blue-800">JeepneyCoop Wallet</h1>
            <p className="text-gray-600">Mutual Aid & Savings for Jeepney Drivers</p>
          </div>
          {address ? (
            <div className="text-right">
              <p className="text-sm text-gray-500">Connected as</p>
              <p className="font-mono text-sm font-bold text-blue-600">{address.slice(0, 6)}...{address.slice(-6)}</p>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg"
            >
              Connect Wallet
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
            <h2 className="text-gray-400 uppercase text-xs font-black tracking-widest mb-2">Total Pool Balance</h2>
            <p className="text-5xl font-black text-gray-900">{poolBalance} <span className="text-xl font-normal text-gray-400">XLM</span></p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
            <h2 className="text-gray-400 uppercase text-xs font-black tracking-widest mb-2">My Contributions</h2>
            <p className="text-5xl font-black text-blue-600">{myContribution} <span className="text-xl font-normal text-gray-400">XLM</span></p>
          </div>
        </div>

        {showForm && (
          <div className="bg-blue-50 border-2 border-blue-200 p-8 rounded-2xl mb-12 shadow-inner">
            <h3 className="text-xl font-bold mb-6 text-blue-900">
              {showForm === "contribute" ? "Add to Cooperative Pool" : "Request Emergency Payout"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-blue-800 mb-1">Amount (XLM)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 outline-none"
                  placeholder="e.g. 10"
                />
              </div>
              {showForm === "request" && (
                <div>
                  <label className="block text-sm font-bold text-blue-800 mb-1">Reason (Short)</label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 outline-none"
                    placeholder="e.g. sick_day"
                  />
                </div>
              )}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={showForm === "contribute" ? handleContribute : handleRequestPayout}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Confirm Transaction"}
                </button>
                <button
                  onClick={() => setShowForm(null)}
                  className="px-6 py-3 font-bold text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <button
            onClick={() => setShowForm("contribute")}
            disabled={!address || loading}
            className="bg-white border-2 border-green-100 text-green-700 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-green-200 disabled:opacity-50 transition flex flex-col items-center gap-3"
          >
            <span className="text-3xl">💰</span>
            <span className="font-black uppercase text-sm tracking-tight">Contribute Daily</span>
          </button>
          <button
            onClick={() => setShowForm("request")}
            disabled={!address || loading}
            className="bg-white border-2 border-orange-100 text-orange-700 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-200 disabled:opacity-50 transition flex flex-col items-center gap-3"
          >
            <span className="text-3xl">🚑</span>
            <span className="font-black uppercase text-sm tracking-tight">Request Payout</span>
          </button>
          <button
            disabled={!address || loading}
            className="bg-white border-2 border-purple-100 text-purple-700 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-200 disabled:opacity-50 transition flex flex-col items-center gap-3"
          >
            <span className="text-3xl">🗳️</span>
            <span className="font-black uppercase text-sm tracking-tight">Governance</span>
          </button>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-xl font-black text-gray-800 tracking-tight">COMMUNITY FEED</h3>
            <span className="bg-blue-100 text-blue-700 text-xs font-black px-3 py-1 rounded-full">LIVE</span>
          </div>
          <div className="p-0">
            {requests.length === 0 ? (
              <div className="p-16 text-center text-gray-400 italic">
                The cooperative is quiet. No active requests.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {requests.map((req) => (
                  <div key={req.id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition">
                    <div>
                      <p className="font-mono text-xs text-gray-400 mb-1">{req.driver}</p>
                      <p className="font-bold text-gray-800">{req.reason}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-900">{req.amount.toString()} XLM</p>
                      <p className={`text-xs font-bold uppercase ${req.approved ? "text-green-600" : "text-orange-500"}`}>
                        {req.approved ? "✓ Approved" : "⏳ Pending"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
