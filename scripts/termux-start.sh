#!/usr/bin/env bash
set -euo pipefail

echo "== SekaiDrama Termux helper =="

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js tidak ditemukan. Pasang dengan: pkg install nodejs-lts yarn" >&2
  exit 1
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

# Check if .next build exists; if not, try building or suggest build on PC
if [ ! -d ".next" ]; then
  echo ""
  echo "⚠️  Direktori build .next tidak ditemukan."
  echo "Dua pilihan:"
  echo "  1. Build di PC/laptop terlebih dahulu, transfer folder .next ke Termux"
  echo "  2. Build di Termux (butuh ~500MB RAM, mungkin lambat)"
  echo ""
  read -p "Lanjut build di Termux? (y/n): " -n 1 -r BUILD_CHOICE
  echo ""
  
  if [[ $BUILD_CHOICE =~ ^[Yy]$ ]]; then
    echo "Building... (ini butuh waktu & RAM)"
    export NODE_OPTIONS="--max_old_space_size=512"
    if command -v yarn >/dev/null 2>&1; then
      yarn build || { echo "Build gagal! Coba build di PC lalu transfer /.next folder"; exit 1; }
    else
      npm run build || { echo "Build gagal! Coba build di PC lalu transfer /.next folder"; exit 1; }
    fi
  else
    echo "Build dimulai... silahkan tunggu atau transfer build dari PC"
    echo "(Cek README-TERMUX.md untuk instruksi transfer build)"
    exit 1
  fi
fi

echo "Memulai server pada $HOST:$PORT"
echo "Buka di browser perangkat: http://127.0.0.1:$PORT"

# Tampilkan IP lokal jika ada (berguna untuk akses dari device lain di LAN)
if command -v ip >/dev/null 2>&1; then
  IP_ADDR=$(ip -4 addr show wlan0 2>/dev/null | grep -oP '(?<=inet\s)\d+(?:\.\d+){3}' || true)
  if [ -n "$IP_ADDR" ]; then
    echo "Akses dari LAN: http://$IP_ADDR:$PORT"
  fi
fi

# Check jika ada script dev atau hanya bisa start (production)
if grep -q '"dev"' package.json 2>/dev/null; then
  echo "Jalankan dev server..."
  if command -v yarn >/dev/null 2>&1; then
    HOST=$HOST PORT=$PORT yarn dev
  else
    HOST=$HOST PORT=$PORT npm run dev
  fi
else
  echo "Jalankan production server..."
  if command -v yarn >/dev/null 2>&1; then
    HOST=$HOST PORT=$PORT yarn start
  else
    HOST=$HOST PORT=$PORT npm start
  fi
fi
