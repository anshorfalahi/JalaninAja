# JalaninAja

**JalaninAja** adalah aplikasi web untuk membuat rute lari atau sepeda, menghitung statistik, dan mengunduh file GPX dari rute yang digambar di peta. Aplikasi ini dibuat sepenuhnya dengan bantuan GPT.

---

## Fitur

- Gambar rute lari/sepeda di peta (klik untuk menambah marker)
- Statistik otomatis: jarak, durasi, elevasi, pace/speed
- Pilihan tipe aktivitas: Run atau Ride
- Pilihan satuan pace/speed (min/km, min/mile, km/h, mph)
- Simulasi variasi pace (Pace Inconsistency)
- Input nama, tanggal, jam mulai, deskripsi aktivitas
- Download file GPX dari rute yang dibuat
- Visualisasi dummy data pace & elevasi (grafik)
- Fitur pencarian lokasi (OpenStreetMap)
- Fitur align path ke jalan (OSRM)

---

## Cara Menjalankan

1. **Clone repo & install dependencies**

   ```sh
   git clone https://github.com/anshorfalahi/JalaninAja.git
   cd JalaninAja
   npm install
   ```

2. **Jalankan aplikasi**
   ```sh
   npm start
   ```
   Aplikasi akan berjalan di `http://localhost:3000`

---

## Struktur Folder

```
src/
  App.jsx / App.js
  components/
    RunDetails.jsx
    MapRoute.jsx
    DownloadGPX.jsx
    DataVisualization.jsx
  utils/
    gpxBuilder.js
public/
  index.html
  ...
```

---

## Catatan & Bug Diketahui

- ~~**BUG Marker Map:** Marker pada peta muncul di belakang bar pencarian dan tombol "Align Path to Road". Ini masalah z-index/urutan layer pada komponen Leaflet dan elemen custom di atas peta.~~ **(SUDAH FIX)**
- **Visual Masih Berantakan:** UI belum sepenuhnya rapi, terutama pada tampilan mobile dan beberapa elemen masih kurang konsisten.
- **Fitur Heart Rate:** Opsi "Include Heart Rate Data" sudah ada, namun data HR pada GPX masih dummy/simulasi, belum ada input HR detail.
- **Icon Masih Ngasal:** Icon pada beberapa tombol/statistik masih menggunakan SVG sederhana/buatan sendiri, belum konsisten atau sesuai standar.
- **Dibuat Full Bantuan GPT:** Seluruh kode, logika, dan dokumentasi dibuat dengan bantuan AI (GPT).

---

## Penggunaan

1. **Pilih tipe aktivitas** (Run/Ride) di panel kiri.
2. **Atur detail aktivitas**: pace/speed, variasi pace, nama, tanggal, jam, deskripsi.
3. **Gambar rute** di peta dengan klik pada lokasi-lokasi yang diinginkan.
4. (Opsional) **Cari lokasi** dengan search bar di atas peta.
5. (Opsional) **Align path ke jalan** dengan tombol "Align Path to Road".
6. **Download GPX** dengan tombol di bawah panel.
7. **Lihat visualisasi** dummy data pace & elevasi di bawah tombol download.

### Cara Menggunakan File GPX di Strava

1. Login ke [strava.com](https://www.strava.com/).
2. Masuk ke menu **Upload Activity** dan pilih **File** ([link upload file Strava](https://www.strava.com/upload/select)).
3. Pilih file GPX yang sudah kamu download dari aplikasi ini.
4. Submit dan sesuaikan detail aktivitas di Strava sesuai kebutuhan.

---

## Teknologi

- React 19
- TailwindCSS
- Leaflet & React-Leaflet
- OSRM (untuk align path)
- Recharts (visualisasi)
- gpx-builder (generate file GPX)
- Nominatim OpenStreetMap API (pencarian lokasi, menggantikan leaflet-geosearch)

---

## TODO / Pengembangan Selanjutnya

- Rapiin tampilan UI (mobile responsive, konsistensi warna/icon)
- Fitur Heart Rate: input manual HR, visualisasi HR, export HR ke GPX lebih realistis
- Customisasi icon dengan library icon profesional (misal Lucide, Feather, dsb)
- Simulasi data pace/elevasi berdasarkan rute asli, bukan dummy

---

## Lisensi

Proyek ini dibuat untuk pembelajaran dan eksperimen. Silakan gunakan, modifikasi, dan kembangkan sesuai kebutuhan.

---

**Dibuat sepenuhnya dengan bantuan GPT**
