"use client";

import { useEffect, useState } from "react";
import { getHistory, clearHistory, getHistorySizeBytes, removeHistoryItem, HistoryItem } from "@/lib/history";

function fmtBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let v = bytes;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(2)} ${units[i]}`;
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [size, setSize] = useState<number>(0);

  const refresh = () => {
    setItems(getHistory());
    setSize(getHistorySizeBytes());
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleClear = () => {
    if (!confirm("Hapus seluruh riwayat tontonan?")) return;
    clearHistory();
    refresh();
  };

  const handleRemove = (index: number) => {
    if (!confirm("Hapus item ini?")) return;
    removeHistoryItem(index);
    refresh();
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Riwayat Tontonan</h1>

      <div className="mb-4 flex items-center gap-4">
        <div className="px-3 py-2 bg-zinc-900 text-white rounded">Items: {items.length}</div>
        <div className="px-3 py-2 bg-zinc-900 text-white rounded">Ukuran: {fmtBytes(size)}</div>
        <button className="ml-auto px-3 py-2 bg-red-600 text-white rounded" onClick={handleClear}>Hapus Semua</button>
        <button className="px-3 py-2 bg-primary text-white rounded" onClick={refresh}>Segarkan</button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-white/70">Belum ada riwayat.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((it, idx) => (
            <li key={`${it.id}-${idx}`} className="p-3 bg-zinc-900 rounded flex items-start justify-between">
              <div>
                <div className="font-semibold">{it.title || it.id}</div>
                <div className="text-sm text-white/70">{it.platform || "-"} • Ep {it.episode ?? "-"}</div>
                <div className="text-xs text-white/60">{new Date(it.playedAt).toLocaleString()}</div>
                {it.url && (
                  <a className="text-xs text-primary hover:underline" href={it.url} target="_blank" rel="noreferrer">Buka</a>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button className="px-2 py-1 bg-red-600 rounded text-sm" onClick={() => handleRemove(idx)}>Hapus</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
