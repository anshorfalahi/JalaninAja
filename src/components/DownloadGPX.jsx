import React from "react";
import { buildGPXFile } from "../utils/gpxBuilder";

export default function DownloadGPX({ runData, route, type }) {
  if (!route || route.length < 2) {
    return (
      <div className="mt-6 text-sm text-gray-500">
        Tambahkan rute di peta untuk bisa generate GPX.
      </div>
    );
  }

  const handleDownload = () => {
    const gpxContent = buildGPXFile(runData, route, type);
    const nameBase = type === "run"
      ? (runData.name || "Run")
      : (runData.name || "Ride");
    const blob = new Blob([gpxContent], { type: "application/gpx+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${nameBase.replace(/\s+/g, "_")}.gpx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      className="mt-6 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 w-full"
      onClick={handleDownload}
    >
      Download GPX
    </button>
  );
}
