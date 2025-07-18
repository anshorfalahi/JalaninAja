import React from "react";
import { buildGPXFile } from "../utils/gpxBuilder";

export default function DownloadGPX({ runData, route, type }) {
  // Jika tidak ada rute yang digambar, tampilkan pesan.
  if (!route || route.length < 2) {
    return (
      <div className="mt-6 text-sm text-gray-500">
        Tambahkan rute di peta untuk bisa generate GPX.
      </div>
    );
  }

  // Fungsi untuk menangani proses unduh file GPX.
  const handleDownload = () => {
    // Membuat konten file GPX dari data yang ada
    const gpxContent = buildGPXFile(runData, route, type);
    
    // Menentukan nama file berdasarkan tipe aktivitas
    const nameBase = type === "run"
      ? (runData.name || "Run")
      : (runData.name || "Ride");
      
    // Membuat file Blob dan URL untuk mengunduh
    const blob = new Blob([gpxContent], { type: "application/gpx+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${nameBase.replace(/\s+/g, "_")}.gpx`; // Mengganti spasi dengan underscore
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Tombol untuk mengunduh file GPX */}
      <button
        className="mt-6 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 w-full"
        onClick={handleDownload}
      >
        Download GPX
      </button>

      {/* Bagian baru: Panduan penggunaan file GPX */}
      <div className="mt-4 p-4 border-t border-gray-200 text-sm text-gray-600">
        <h3 className="font-semibold text-base text-gray-700 mb-2">Cara Menggunakan File GPX di Strava</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Login ke <a href="https://www.strava.com/upload/select" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">situs Strava</a>.</li>
          <li>Pilih opsi untuk mengunggah <strong>File</strong>.</li>
          <li>Pilih file GPX yang baru saja Anda unduh.</li>
          <li>Sesuaikan detail aktivitas Anda dan simpan.</li>
        </ol>
      </div>
    </div>
  );
}