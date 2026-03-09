"use client";

import { useAccount } from "wagmi";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ArrowLeft, Database, Store, Settings, CreditCard } from "lucide-react";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 bg-slate-50">
        <p className="text-slate-600">Connect your wallet to access the dashboard.</p>
        <ConnectButton />
        <Link href="/" className="text-cyan-600 hover:underline flex items-center gap-1 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </div>
    );
  }

  const cards = [
    { href: "/dashboard/vault", icon: Database, title: "Data Vault", desc: "Upload and manage your data", color: "from-cyan-500 to-cyan-600" },
    { href: "/marketplace", icon: Store, title: "Marketplace", desc: "Permissions & requests", color: "from-teal-500 to-teal-600" },
    { href: "/dashboard/permissions", icon: Settings, title: "Permissions", desc: "Who can access what", color: "from-emerald-500 to-emerald-600" },
    { href: "/dashboard/payments", icon: CreditCard, title: "Payment options", desc: "Google Pay, PayPal, bank & more", color: "from-sky-500 to-sky-600" },
  ];

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
        <h1 className="text-2xl font-bold mb-2 text-slate-800 animate-fade-in-up">Dashboard</h1>
        <p className="text-slate-600 text-sm mb-8">
          DID: <code className="text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded">did:pde:{address?.slice(0, 10)}...</code>
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 stagger-children">
          {cards.map(({ href, icon: Icon, title, desc, color }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover-lift transition-all"
            >
              <span className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg shadow-cyan-500/20`}>
                <Icon className="w-6 h-6 text-white" />
              </span>
              <div>
                <h2 className="font-semibold text-slate-800">{title}</h2>
                <p className="text-slate-600 text-sm">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
