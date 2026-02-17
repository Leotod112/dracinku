#!/usr/bin/env bash
set -euo pipefail

echo "== SekaiDrama Termux helper =="

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js tidak ditemukan. Pasang dengan: pkg install nodejs-lts yarn" >&2
fi

if [ ! -f .env ]; then
  echo "Peringatan: file .env tidak ditemukan di root proyek." >&2
  echo "Silakan salin .env dari sumber lain atau buat sendiri sebelum lanjut." >&2
fi

PORT=${PORT:-3000}
HOST=${HOST:-0.0.0.0}

echo "Instal dependencies (yarn jika tersedia, fallback npm)..."
if command -v yarn >/dev/null 2>&1; then
  yarn install --frozen-lockfile || yarn install
else
  npm ci || npm install
fi

echo "Memulai dev server pada $HOST:$PORT"
echo "Buka di browser perangkat: http://127.0.0.1:$PORT"

# Tampilkan IP lokal jika ada (berguna untuk akses dari device lain di LAN)
if command -v ip >/dev/null 2>&1; then
  IP_ADDR=$(ip -4 addr show wlan0 2>/dev/null | grep -oP '(?<=inet\s)\d+(?:\.\d+){3}' || true)
  if [ -n "$IP_ADDR" ]; then
    echo "Akses dari LAN: http://$IP_ADDR:$PORT"
  fi
fi

# Jalankan dev server (Next.js/Vite/whatever script `dev` di package.json)
if npm run | grep -q " dev"; then
  # prefer yarn if available
  if command -v yarn >/dev/null 2>&1; then
    HOST=$HOST PORT=$PORT yarn dev
  else
    HOST=$HOST PORT=$PORT npm run dev
  fi
else
  echo "Tidak menemukan script 'dev' di package.json. Jalankan server sesuai dokumentasi proyek." >&2
  exit 1
fi
