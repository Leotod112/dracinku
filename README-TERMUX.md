Ringkasan singkat menjalankan proyek SekaiDrama di Termux (Android)

Prasyarat di Termux:
- Termux terbaru
- Paket: `git`, `nodejs-lts` (atau `nodejs`), `yarn` (opsional)

Langkah cepat:

1. Perbarui paket dan pasang dependensi dasar:

```bash
pkg update -y
pkg upgrade -y
pkg install git nodejs-lts yarn -y
```

2. Clone atau salin repo ke Termux:

```bash
git clone <repo-url> SekaiDrama
cd SekaiDrama
```

3. Pastikan file `.env` tersedia di root (sama seperti di PC).

4. Gunakan skrip helper untuk instal dan menjalankan dev server:

```bash
chmod +x scripts/termux-start.sh
./scripts/termux-start.sh
```

Catatan:
- Pemutaran video dilakukan di browser Android (Chrome/Firefox). Termux hanya menjalankan server.
- Jika perangkat memiliki RAM terbatas, jalankan build produksi di mesin lain lalu jalankan `yarn start` di Termux.
- Untuk akses publik, gunakan ngrok atau tunneling lain (periksa kompatibilitas ngrok untuk arsitektur perangkat).
