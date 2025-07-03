import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import axios from "axios";

// Fix marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Komponen handle klik map & tambahkan marker
function ClickHandler({ setRoute, route }) {
  useMapEvents({
    click(e) {
      setRoute([...route, [e.latlng.lat, e.latlng.lng]]);
    }
  });
  return null;
}

// Search bar + Button (akses map context langsung)
function SearchBarWithButtons({ setRoute, aligning, onAlign, onClear, disableAlign }) {
  const map = useMap(); // AKSES MAP LANGSUNG
  const inputRef = useRef();
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug] = useState(false);

  // Cari lokasi saat input
  const onChange = async e => {
    const val = e.target.value;
    if (val.length < 3) {
      setSuggestions([]);
      setShowSug(false);
      return;
    }
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: val });
    setSuggestions(results);
    setShowSug(true);
  };

  // Saat user tekan Enter
  const onKeyDown = async (e) => {
    if (e.key === "Enter" && inputRef.current.value.length >= 3) {
      const val = inputRef.current.value;
      const provider = new OpenStreetMapProvider();
      const results = await provider.search({ query: val });
      setSuggestions(results);
      setShowSug(false);
      if (results && results[0] && map) {
        const { y: lat, x: lng } = results[0];
        map.flyTo([lat, lng], 14, { animate: true }); // smooth zoom
        inputRef.current.value = results[0].label;
      }
    }
  };

  return (
    <div
        style={{
            position: "relative",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1002,
            width: "600px",
            maxWidth: "94vw",
            display: "flex",
            alignItems: "center",
            gap: 10,
            pointerEvents: "auto"
        }}
        onClick={e => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
        onMouseDown={e => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
     >
      <div style={{ flex: 1, position: "relative" }}>
        <input
          ref={inputRef}
          onMouseDown={e => e.stopPropagation()}
          type="text"
          placeholder="Cari lokasi (min. 3 huruf)..."
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={() => setShowSug(true)}
          className="w-full px-4 py-2 border border-orange-400 rounded-lg text-base outline-none focus:ring-2 focus:ring-orange-400 transition-all search-bar"
          style={{ position: "relative", zIndex: 10, width: "100%", minWidth: 0, fontSize: 15 }}
        />
        {/* Suggestions dropdown */}
        {showSug && suggestions.length > 0 && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #eee",
              borderRadius: 6,
              marginTop: 2,
              maxHeight: 180,
              overflowY: "auto",
              position: "absolute",
              width: "100%",
              zIndex: 1001,
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)"
            }}
          >
            {suggestions.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: "8px 16px",
                  cursor: "pointer",
                  borderBottom: "1px solid #f2f2f2"
                }}
                onMouseDown={e => {
                  e.preventDefault();
                  if (map) map.flyTo([s.y, s.x], 14, { animate: true }); // flyTo & zoom smooth
                  if (inputRef.current) inputRef.current.value = s.label;
                  setSuggestions([]);
                  setShowSug(false);
                }}
              >
                {s.label}
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        className={`transition-all px-4 py-2 font-semibold rounded-lg shadow ${disableAlign ? "bg-orange-200 text-white" : "bg-orange-500 hover:bg-orange-600 text-white"}`}
        style={{ minWidth: 120 }}
        onClick={(e) => {
          e.stopPropagation();
          onAlign();
        }}
        onMouseDown={e => e.stopPropagation()}
        disabled={disableAlign}
        
      >
        {aligning ? "Aligning..." : "Align Path to Road"}
      </button>
      <button
        className="transition-all px-4 py-2 font-semibold rounded-lg shadow bg-gray-100 text-orange-500 border border-orange-200 hover:bg-orange-100"
        style={{ minWidth: 120 }}
        onClick={onClear}
      >
        Clear Marker
      </button>
    </div>
  );
}

export default function MapRoute({ route, setRoute }) {
  const mapRef = useRef();
  const [aligning, setAligning] = useState(false);

  const handleClear = () => setRoute([]);

  // Button align to road
  const handleAlign = async () => {
    if (!route || route.length < 2) return;
    setAligning(true);
    try {
      const coordsStr = route.map(([lat, lng]) => `${lng},${lat}`).join(';');
      const url = `https://router.project-osrm.org/match/v1/driving/${coordsStr}?geometries=geojson&overview=full`;
      const resp = await axios.get(url);
      if (
        resp.data &&
        resp.data.matchings &&
        resp.data.matchings.length > 0 &&
        resp.data.matchings[0].geometry
      ) {
        const coords = resp.data.matchings[0].geometry.coordinates;
        const aligned = coords.map(([lng, lat]) => [lat, lng]);
        setRoute(aligned);
        // Fit polyline setelah align
        if (mapRef.current) {
          const map = mapRef.current;
          const bounds = L.latLngBounds(aligned.map(([lat, lng]) => [lat, lng]));
          map.fitBounds(bounds, { padding: [30, 30] });
        }
      }
    } catch (err) {
      alert("Gagal align path ke jalan, coba ulangi atau tambahkan titik lagi!");
    }
    setAligning(false);
  };

  // Fit polyline ketika route berubah
  useEffect(() => {
    if (mapRef.current && route.length > 1) {
      const map = mapRef.current;
      const bounds = L.latLngBounds(route.map(([lat, lng]) => [lat, lng]));
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [route]);

  return (
    <div style={{ position: "relative", height: "100%", minHeight: 400 }}>
      <MapContainer
        center={[-3.3197063662471615, 114.59764582739444]}
        zoom={13}
        style={{ height: "100%", minHeight: "400px", width: "100%" }}
        className="rounded-lg shadow"
        whenCreated={map => (mapRef.current = map)}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler setRoute={setRoute} route={route} />
        {route.map((point, idx) => (
          <Marker position={point} key={idx} />
        ))}
        {route.length > 1 && (
          <Polyline positions={route} color="orange" />
        )}
        <SearchBarWithButtons
          setRoute={setRoute}
          aligning={aligning}
          onAlign={handleAlign}
          onClear={handleClear}
          disableAlign={aligning || route.length < 2}
        />
      </MapContainer>
    </div>
  );
}
