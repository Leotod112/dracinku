Ringkasan singkat menjalankan proyek SekaiDrama di Termux (Android)

Prasyarat di Termux:
- Termux terbaru (arm64/armv8)
- Paket: `git`, `nodejs-lts`, `yarn` (opsional tapi recommended)

⚠️  **CATATAN PENTING:** Next.js 16 tidak kompatibel build langsung di ARM Termux karena keterbatasan Turbopack. **GUNAKAN OPSI 1** (build di PC/laptop).

---

**OPSI 1: Build di PC/Laptop, Transfer ke Termux (RECOMMENDED)**

Paling stabil karena compiler Turbopack tidak kompatibel dengan ARM Termux archive.

**Langkah di PC (Ubuntu/macOS/Windows):**

1. Pastikan Node.js versi 20.9+ tersedia:
   ```bash
   node --version
   # butuh v20.9.0 atau lebih tinggi
   ```

2. Build aplikasi Next.js:
   ```bash
   cd /path/to/SekaiDrama
   npm run build
   # atau
   yarn build
   ```
   Tunggu sampai selesai (~2-5 menit). Folder `.next` akan dibuat.

3. Compress dan transfer ke Termux:
   ```bash
   tar -czf next-build.tar.gz .next node_modules
   # transfer ke HP via USB/adb/cloud
   ```

**Langkah di Termux:**

1. Extract build:
   ```bash
   tar -xzf next-build.tar.gz
   ```

2. Setup & jalankan server:
   ```bash
   pkg update -y
   pkg install nodejs-lts -y
   PORT=3000 npm start
   ```

3. Buka browser HP: `http://127.0.0.1:3000`

---

**OPSI 2: Jalankan Dev Server dari PC, Akses dari HP**

Jika ingin development/testing cepat tanpa transfer build.

Langkah di PC:
```bash
cd /path/to/SekaiDrama
npm run dev
```

Catatan akses:
- Dari HP (WiFi lokal): buka `http://<IP-PC>:3000`
- Temukan IP PC dengan `ipconfig` (Windows) atau `ifconfig` (Linux/macOS)
- Pastikan firewall HP & PC memungkinkan koneksi lokal

---

**Akses dari Browser Android:**
- Perangkat lokal: http://127.0.0.1:3000 atau http://localhost:3000
- Dari device lain di LAN: http://<IP-Termux>:3000
  
  Cari IP Termux dengan: `ip -4 addr show wlan0`

---

**Catatan Penting:**
- Pemutaran video berjalan di browser Android (Chrome/Firefox), bukan terminal
- Next.js 16 menggunakan Turbopack, tidak tersedia untuk ARM/Termux
- Jika sering out-of-memory, gunakan mode production (`npm start`) daripada dev
- Jika perlu update code, edit di PC, rebuild, transfer `.next` lagi ke Termux

**File Helper:** `scripts/termux-start.sh` — otomatis handle instalasi & konfigurasi dasar


