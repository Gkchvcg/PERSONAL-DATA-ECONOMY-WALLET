"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

const CATEGORIES = ["HEALTH", "SHOPPING", "FITNESS", "LOCATION", "SOCIAL"];

export default function PermissionsPage() {
  const { isConnected } = useAccount();
  const [category, setCategory] = useState("FITNESS");
  const [price, setPrice] = useState("5");
  const [allowFitness, setAllowFitness] = useState(true);
  const [allowHealthcare, setAllowHealthcare] = useState(false);
  const [allowMarketing, setAllowMarketing] = useState(true);
  const [allowInsurance, setAllowInsurance] = useState(false);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Connect wallet first.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium transition">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2 text-slate-800 animate-fade-in-up">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Shield className="w-5 h-5 text-white" />
          </span>
          Auto Data Licensing
        </h1>
        <p className="text-slate-600 mb-8">
          Set rules per category. Smart contracts enforce who can access your data and at what price.
        </p>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 max-w-xl shadow-sm hover-lift">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Data category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-slate-800 focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500"
                aria-label="Data category"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Price per access (DATA tokens)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-slate-800 focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-slate-600">Allow requests from</label>
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input type="checkbox" checked={allowFitness} onChange={(e) => setAllowFitness(e.target.checked)} className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />
                Fitness companies
              </label>
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input type="checkbox" checked={allowHealthcare} onChange={(e) => setAllowHealthcare(e.target.checked)} className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />
                Healthcare / Pharma
              </label>
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input type="checkbox" checked={allowMarketing} onChange={(e) => setAllowMarketing(e.target.checked)} className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />
                Marketing / Brands
              </label>
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input type="checkbox" checked={allowInsurance} onChange={(e) => setAllowInsurance(e.target.checked)} className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />
                Insurance companies
              </label>
            </div>
            <button
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-4 py-2.5 font-medium w-full shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              onClick={() => alert("Call DataMarketplace.createPermission() with your wallet. Deploy contracts first (see README).")}
            >
              Create permission (on-chain)
            </button>
          </div>
        </div>

        <p className="text-slate-500 text-sm mt-4">
          Deploy contracts with <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">npm run contracts:compile</code> and run
          deploy script, then add contract addresses to .env to enable on-chain actions.
        </p>
      </main>
    </div>
  );
}
