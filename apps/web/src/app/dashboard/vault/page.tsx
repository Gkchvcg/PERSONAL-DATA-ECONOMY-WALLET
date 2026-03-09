"use client";

import { useState, useRef } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import { ArrowLeft, Upload, FileJson, FolderUp, X } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const CATEGORIES = ["HEALTH", "SHOPPING", "FITNESS", "LOCATION", "SOCIAL"];
const ACCEPT = ".json,.csv,.txt,application/json,text/csv,text/plain";

function parseCSV(text: string): { rows: Record<string, string>[] } {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length === 0) return { rows: [] };
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  const rows = lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => (obj[h] = values[i] ?? ""));
    return obj;
  });
  return { rows };
}

export default function VaultPage() {
  const { address, isConnected } = useAccount();
  const [category, setCategory] = useState("FITNESS");
  const [payload, setPayload] = useState('{"activityLevel":"moderate","weeklySessions":3}');
  const [uploaded, setUploaded] = useState<{ cid: string; category: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function parseFile(content: string, name: string): object {
    const ext = name.split(".").pop()?.toLowerCase();
    if (ext === "json") return JSON.parse(content);
    if (ext === "csv") return parseCSV(content);
    return { text: content };
  }

  function onFile(file: File) {
    const name = file.name;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const parsed = parseFile(text, name);
        setPayload(JSON.stringify(parsed, null, 2));
        setFileName(name);
      } catch (e) {
        console.error(e);
        setPayload(JSON.stringify({ text: (reader.result as string).slice(0, 5000) }));
        setFileName(name);
      }
    };
    reader.readAsText(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && /\.(json|csv|txt)$/i.test(file.name)) onFile(file);
  }

  function handleBrowse() {
    fileInputRef.current?.click();
  }

  async function handleUpload() {
    if (!address) return;
    setLoading(true);
    try {
      const payloadObj = JSON.parse(payload);
      const res = await fetch(`${API}/api/data/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: address,
          category,
          payload: payloadObj,
        }),
      });
      const data = await res.json();
      if (data.cid) {
        setUploaded((u) => [{ cid: data.cid, category: data.category }, ...u]);
        setFileName(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
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
        <h1 className="text-2xl font-bold mb-6 text-slate-800 animate-fade-in-up">Data Vault</h1>
        <p className="text-slate-600 mb-8">
          Data is encrypted and stored in a decentralized way. AI will anonymize it before any company sees it.
        </p>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-8 shadow-sm hover-lift transition-shadow">
          <h2 className="font-semibold mb-4 flex items-center gap-2 text-slate-800">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
              <Upload className="w-4 h-4 text-white" />
            </span>
            Upload data
          </h2>

          {/* Upload from computer / drive */}
          <div className="mb-6">
            <label className="block text-sm text-slate-600 mb-2">From your computer</label>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPT}
              className="hidden"
              aria-label="Choose file from computer"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
                e.target.value = "";
              }}
            />
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload file: drag and drop or click to browse"
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={handleBrowse}
              onKeyDown={(e) => e.key === "Enter" && handleBrowse()}
              className={`
                border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
                ${dragActive ? "border-cyan-500 bg-cyan-50" : "border-slate-300 hover:border-cyan-400 hover:bg-slate-50"}
              `}
            >
              <FolderUp className="w-10 h-10 mx-auto text-slate-400 mb-2" />
              <p className="text-slate-600 text-sm">
                {dragActive ? "Drop file here" : "Drag & drop a file here, or click to browse"}
              </p>
              <p className="text-slate-500 text-xs mt-1">JSON, CSV or TXT (max 5MB)</p>
            </div>
            {fileName && (
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span className="text-cyan-600 truncate font-medium">Added: {fileName}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFileName(null);
                  }}
                  className="text-slate-500 hover:text-slate-800 p-0.5 transition"
                  aria-label="Clear file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-slate-800 focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition"
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
              <label className="block text-sm text-slate-600 mb-1">Data (edit if needed)</label>
              <textarea
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                rows={6}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-slate-800 font-mono text-sm focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition"
                placeholder="Paste JSON or upload a file above"
              />
            </div>
            <button
              onClick={handleUpload}
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-5 py-2.5 font-medium shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 transition-all"
            >
              {loading ? "Uploading…" : "Encrypt & Store"}
            </button>
          </div>
        </div>

        {uploaded.length > 0 && (
          <div className="animate-fade-in-up">
            <h2 className="font-semibold mb-3 text-slate-800">Stored items</h2>
            <ul className="space-y-2">
              {uploaded.map(({ cid, category: cat }) => (
                <li
                  key={cid}
                  className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-sm shadow-sm"
                >
                  <FileJson className="w-4 h-4 text-cyan-500" />
                  <span className="text-slate-600 truncate flex-1">{cid}</span>
                  <span className="text-cyan-600 font-medium">{cat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
