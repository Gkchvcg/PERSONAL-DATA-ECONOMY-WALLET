"use client";

import { useAccount } from "wagmi";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ArrowLeft, Store, DollarSign, CreditCard } from "lucide-react";

export default function MarketplacePage() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200/80 sticky top-0 z-10 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium transition">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <ConnectButton />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2 text-slate-800 animate-fade-in-up">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Store className="w-5 h-5 text-white" />
          </span>
          Data Marketplace
        </h1>
        <p className="text-slate-600 mb-8">
          Companies request access to anonymized insights. You approve and set price. Smart contracts handle payments.
        </p>

        {!isConnected ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm animate-fade-in-up">
            <p className="text-slate-600 mb-4">Connect your wallet to create permissions and see requests.</p>
            <ConnectButton />
          </div>
        ) : (
          <div className="grid gap-6 stagger-children">
            <div className="rounded-2xl border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-teal-50 p-6 shadow-sm">
              <h3 className="font-semibold text-cyan-800 mb-2">How it works</h3>
              <ol className="list-decimal list-inside text-slate-700 space-y-1 text-sm">
                <li>Set permissions in Dashboard → Permissions (category, price, who can access).</li>
                <li>Companies create requests and pay into the smart contract.</li>
                <li>You approve; backend delivers anonymized insight (AI Privacy Layer).</li>
                <li>You fulfill the request and withdraw earnings from the contract.</li>
              </ol>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 flex items-center gap-4 shadow-sm hover-lift">
              <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
                <DollarSign className="w-6 h-6 text-white" />
              </span>
              <div>
                <h3 className="font-semibold text-slate-800">Data Pricing Engine</h3>
                <p className="text-slate-600 text-sm">
                  Health ≈ $8, Shopping ≈ $5, Fitness ≈ $4, Location ≈ $2, Social ≈ $3 (base). Reputation increases payouts.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 flex items-center gap-4 shadow-sm hover-lift">
              <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/20 shrink-0">
                <CreditCard className="w-6 h-6 text-white" />
              </span>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">Receive payouts your way</h3>
                <p className="text-slate-600 text-sm">
                  Crypto (wallet), Google Pay, PayPal, Apple Pay, or bank transfer. Set your preferred method and get paid when companies buy your data.
                </p>
              </div>
              <Link
                href="/dashboard/payments"
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-4 py-2 font-medium shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all shrink-0"
              >
                Payment options
              </Link>
            </div>
            <Link
              href="/dashboard/permissions"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-5 py-2.5 font-medium shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all w-fit"
            >
              Set permissions
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
