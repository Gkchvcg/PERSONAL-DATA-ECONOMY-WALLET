"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  Building2,
  Smartphone,
  Check,
  Plus,
  DollarSign,
} from "lucide-react";

const STORAGE_KEY = "pde-payment-methods";
const DEFAULT_KEY = "pde-default-payment";

type PaymentMethodId = "crypto" | "google_pay" | "paypal" | "apple_pay" | "bank";

type PaymentMethod = {
  id: PaymentMethodId;
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  detail?: string; // masked email, phone, last4
};

const METHOD_META: Record<PaymentMethodId, { name: string; description: string; icon: React.ReactNode }> = {
  crypto: {
    name: "Crypto (Wallet)",
    description: "Receive DATA tokens or ETH to your connected wallet",
    icon: <Wallet className="w-6 h-6" />,
  },
  google_pay: {
    name: "Google Pay",
    description: "Get paid to your Google Pay account",
    icon: <Smartphone className="w-6 h-6" />,
  },
  paypal: {
    name: "PayPal",
    description: "Withdraw to your PayPal email",
    icon: <CreditCard className="w-6 h-6" />,
  },
  apple_pay: {
    name: "Apple Pay",
    description: "Receive to your Apple Pay–linked card",
    icon: <CreditCard className="w-6 h-6" />,
  },
  bank: {
    name: "Bank transfer",
    description: "Direct deposit to your bank account",
    icon: <Building2 className="w-6 h-6" />,
  },
};

function loadMethods(address: string | undefined): PaymentMethod[] {
  if (typeof window === "undefined" || !address) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return (data[address.toLowerCase()] ?? []).map((m: PaymentMethod) => ({
      ...METHOD_META[m.id],
      ...m,
      icon: METHOD_META[m.id]?.icon ?? m.icon,
    }));
  } catch {
    return [];
  }
}

function saveMethods(address: string, methods: PaymentMethod[]) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    data[address.toLowerCase()] = methods.map(({ id, connected, detail }) => ({ id, connected, detail }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
}

export default function PaymentsPage() {
  const { address, isConnected } = useAccount();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [defaultId, setDefaultId] = useState<PaymentMethodId>("crypto");
  const [showAdd, setShowAdd] = useState<PaymentMethodId | null>(null);
  const [formValue, setFormValue] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && address) {
      try {
        const raw = localStorage.getItem(DEFAULT_KEY);
        const data = raw ? JSON.parse(raw) : {};
        const saved = data[address.toLowerCase()];
        if (saved && ["crypto", "google_pay", "paypal", "apple_pay", "bank"].includes(saved)) {
          setDefaultId(saved);
        }
      } catch {}
    }
  }, [address]);

  const persistDefault = (id: PaymentMethodId) => {
    setDefaultId(id);
    if (typeof window !== "undefined" && address) {
      try {
        const raw = localStorage.getItem(DEFAULT_KEY);
        const data = raw ? JSON.parse(raw) : {};
        data[address.toLowerCase()] = id;
        localStorage.setItem(DEFAULT_KEY, JSON.stringify(data));
      } catch {}
    }
  };

  useEffect(() => {
    const loaded = loadMethods(address);
    if (loaded.length > 0) {
      setMethods(loaded);
    } else {
      setMethods(
        (Object.keys(METHOD_META) as PaymentMethodId[]).map((id) => ({
          id,
          connected: id === "crypto",
          detail: id === "crypto" && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : undefined,
          ...METHOD_META[id],
          icon: METHOD_META[id].icon,
        }))
      );
    }
  }, [address]);

  useEffect(() => {
    if (address && methods.length > 0) saveMethods(address, methods);
  }, [address, methods]);

  function connectMethod(id: PaymentMethodId, detail: string) {
    const meta = METHOD_META[id];
    setMethods((prev) => {
      const next = prev.map((m) => (m.id === id ? { ...m, connected: true, detail } : m));
      return next;
    });
    setShowAdd(null);
    setFormValue("");
  }

  function disconnectMethod(id: PaymentMethodId) {
    if (id === "crypto") return;
    setMethods((prev) => prev.map((m) => (m.id === id ? { ...m, connected: false, detail: undefined } : m)));
  }

  function getPlaceholder(id: PaymentMethodId): string {
    switch (id) {
      case "paypal":
        return "PayPal email";
      case "google_pay":
        return "Phone number or email linked to Google Pay";
      case "apple_pay":
        return "Email linked to Apple Pay";
      case "bank":
        return "Account number (last 4) or IBAN";
      default:
        return "";
    }
  }

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
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <DollarSign className="w-5 h-5 text-white" />
          </span>
          Payment options
        </h1>
        <p className="text-slate-600 mb-8">
          Choose how you want to receive payouts when companies buy access to your data.
        </p>

        <div className="space-y-4 mb-8 stagger-children">
          {methods.map((m) => (
            <div
              key={m.id}
              className={`rounded-2xl border p-5 flex items-center justify-between gap-4 shadow-sm transition-all ${
                m.connected ? "border-cyan-200 bg-white ring-1 ring-cyan-100" : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-cyan-600">
                  {m.icon}
                </div>
                <div>
                  <div className="font-semibold flex items-center gap-2 text-slate-800">
                    {m.name}
                    {m.id === "crypto" && (
                      <span className="text-xs font-normal text-cyan-600">(connected wallet)</span>
                    )}
                  </div>
                  <p className="text-slate-600 text-sm">{m.description}</p>
                  {m.connected && m.detail && (
                    <p className="text-slate-500 text-xs mt-1">{m.detail}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {m.connected ? (
                  <>
                    <button
                      type="button"
                      onClick={() => persistDefault(m.id)}
                      className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${
                        defaultId === m.id
                          ? "bg-cyan-500 text-white shadow shadow-cyan-500/30"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {defaultId === m.id ? "Default" : "Set default"}
                    </button>
                    {m.id !== "crypto" && (
                      <button
                        type="button"
                        onClick={() => disconnectMethod(m.id)}
                        className="text-slate-500 hover:text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAdd(m.id)}
                    className="rounded-xl bg-slate-200 text-slate-700 px-3 py-1.5 text-sm flex items-center gap-1 hover:bg-slate-300 font-medium transition"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {showAdd && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 max-w-md shadow-lg animate-fade-in-up">
            <h3 className="font-semibold mb-2 text-slate-800">Add {METHOD_META[showAdd]?.name}</h3>
            <p className="text-slate-600 text-sm mb-4">{METHOD_META[showAdd]?.description}</p>
            <input
              type="text"
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              placeholder={getPlaceholder(showAdd)}
              className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-slate-800 mb-4 focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500"
              aria-label={getPlaceholder(showAdd)}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => connectMethod(showAdd, formValue.trim() || "Connected")}
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-4 py-2 text-sm font-medium shadow-lg shadow-cyan-500/25 hover:shadow-xl transition"
              >
                Connect
              </button>
              <button
                type="button"
                onClick={() => { setShowAdd(null); setFormValue(""); }}
                className="rounded-xl bg-slate-200 text-slate-700 px-4 py-2 text-sm hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-cyan-50/50 p-5 text-sm text-slate-700">
          <p className="flex items-center gap-2">
            <Check className="w-4 h-4 text-cyan-600 shrink-0" />
            Default payout is <strong className="text-slate-800">{METHOD_META[defaultId]?.name ?? "Crypto"}</strong>.
            When you withdraw earnings, funds go to this method. Crypto withdrawals use your connected wallet on-chain.
          </p>
        </div>
      </main>
    </div>
  );
}
