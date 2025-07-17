import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

// Fix marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Component to handle map clicks and add markers
function ClickHandler({ setRoute, route }) {
  useMapEvents({
    click(e) {
      setRoute([...route, [e.latlng.lat, e.latlng.lng]]);
    }
  });
  return null;
}

// Search bar + Button (Search, Align, Clear)
function SearchBarWithButtons({ setRoute, aligning, onAlign, onClear, disableAlign }) {
  const map = useMap();
  const inputRef = useRef();
  const searchBarRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug] = useState(false);
  const [searching, setSearching] = useState(false);

  // Disable click propagation on the search bar
  useEffect(() => {
    if (searchBarRef.current) {
      L.DomEvent.disableClickPropagation(searchBarRef.current);
    }
  }, []);

  // Call Nominatim API
  const doSearch = async (val) => {
    if (!val || val.length < 3) {
      setSuggestions([]);
      setShowSug(false);
      return;
    }
    setSearching(true);
    try {
      const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}`);
      const results = await resp.json();
      setSuggestions(results);
      setShowSug(true);
    } catch (err) {
      setSuggestions([]);
      setShowSug(false);
    }
    setSearching(false);
  };

  // Handle input change
  const onChange = e => {
    const val = e.target.value;
    if (val.length < 3) {
      setSuggestions([]);
      setShowSug(false);
      return;
    }
    setShowSug(true);
  };

  // Handle Enter key press
  const onKeyDown = async (e) => {
    if (e.key === "Enter" && inputRef.current.value.length >= 3) {
      await doSearch(inputRef.current.value);
    }
  };

  // Handle search button click
  const onSearchClick = async (e) => {
    if (inputRef.current.value.length >= 3) {
      await doSearch(inputRef.current.value);
    }
  };

  // Handle clear all button click
  const handleClearAll = () => {
    // Clear markers from the map by calling parent's onClear
    onClear(); 
    // Clear search suggestions and input field
    setSuggestions([]);
    setShowSug(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      ref={searchBarRef} // Attach ref to the search bar container
      style={{
        position: "absolute", // Use absolute positioning relative to the map container
        top: 12,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1002,
        width: "900px",
        maxWidth: "98vw",
        display: "flex",
        alignItems: "center",
        gap: 10,
        pointerEvents: "auto"
      }}
    >
      <div style={{ flex: 1, position: "relative", display: "flex", gap: 6 }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search location..."
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={() => setShowSug(true)}
          className="w-full px-4 py-2 border border-orange-400 rounded-lg text-base outline-none focus:ring-2 focus:ring-orange-400 transition-all search-bar"
          style={{ position: "relative", zIndex: 10, width: "100%", minWidth: 0, fontSize: 15, height: 44, flex: 2 }}
        />
        <button
          className="font-semibold rounded-lg shadow bg-orange-400 text-white hover:bg-orange-500 transition-all"
          style={{ minWidth: 90, height: 44, flex: 0 }}
          onClick={onSearchClick}
          disabled={searching || (inputRef.current && inputRef.current.value.length < 3)}
          type="button"
        >
          {searching ? "..." : "Search"}
        </button>
        {/* Suggestions dropdown */}
        {showSug && suggestions.length > 0 && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #eee",
              borderRadius: 6,
              marginTop: 46, // Adjusted to appear below the input bar
              maxHeight: 180,
              overflowY: "auto",
              position: "absolute",
              width: "calc(100% - 96px)", // Adjust width to match input field area
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
                onClick={() => {
                  if (map) map.flyTo([parseFloat(s.lat), parseFloat(s.lon)], 14, { animate: true });
                  if (inputRef.current) inputRef.current.value = s.display_name;
                  setSuggestions([]);
                  setShowSug(false);
                }}
              >
                {s.display_name}
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        className={`transition-all px-4 py-2 font-semibold rounded-lg shadow ${disableAlign ? "bg-orange-200 text-white" : "bg-orange-500 hover:bg-orange-600 text-white"}`}
        style={{ minWidth: 120, height: 44 }}
        onClick={onAlign}
        disabled={disableAlign}
      >
        {aligning ? "Aligning..." : "Align Path to Road"}
      </button>
      <button
        className="transition-all px-4 py-2 font-semibold rounded-lg shadow bg-gray-100 text-orange-500 border border-orange-200 hover:bg-gray-100"
        style={{ minWidth: 120, height: 44 }}
        onClick={handleClearAll}
      >
        Clear All
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
    {/* Move SearchBarWithButtons inside MapContainer */}
    <MapContainer
      center={[-3.3197063662471615, 114.59764582739444]}
      zoom={13}
      style={{ height: "100%", minHeight: "400px", width: "100%" }}
      className="rounded-lg shadow"
      whenCreated={map => (mapRef.current = map)}
    >
      <SearchBarWithButtons
        setRoute={setRoute}
        aligning={aligning}
        onAlign={handleAlign}
        onClear={handleClear}
        disableAlign={aligning || route.length < 2}
      />
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
    </MapContainer>
  </div>
);

}