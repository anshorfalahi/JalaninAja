import React, { useState } from "react";
import RunDetails from "./components/RunDetails";
import MapRoute from "./components/MapRoute";
import DownloadGPX from "./components/DownloadGPX";

function getDistanceMeters(a, b) {
  const R = 6371000;
  const dLat = (b[0] - a[0]) * Math.PI / 180;
  const dLon = (b[1] - a[1]) * Math.PI / 180;
  const lat1 = a[0] * Math.PI / 180;
  const lat2 = b[0] * Math.PI / 180;
  const x = dLon * Math.cos((lat1 + lat2) / 2);
  const y = dLat;
  return Math.sqrt(x * x + y * y) * R;
}
function getTotalDistance(route) {
  let dist = 0;
  for (let i = 1; i < route.length; i++) {
    dist += getDistanceMeters(route[i - 1], route[i]);
  }
  return dist / 1000;
}
function getSimulatedElevationArr(route) {
  return route.map((_, i) => 15 + Math.sin(i / 3) * 6); // simulasi
}
function getTotalElevationGain(elevArr) {
  let gain = 0;
  for (let i = 1; i < elevArr.length; i++) {
    const diff = elevArr[i] - elevArr[i - 1];
    if (diff > 0) gain += diff;
  }
  return Math.round(gain);
}
function getDurationFromPaceAndDistance(pace, distance, type, paceUnit) {
  if (distance === 0) return "00:00:00";
  if (type === "run") {
    let paceMinPerKm = pace;
    if (paceUnit === "min/mile") paceMinPerKm = pace / 1.60934;
    const totalMinutes = paceMinPerKm * distance;
    const h = Math.floor(totalMinutes / 60);
    const m = Math.floor(totalMinutes % 60);
    const s = Math.round((totalMinutes - h * 60 - m) * 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  } else {
    let speedKmH = pace;
    if (paceUnit === "mph") speedKmH = pace * 1.60934;
    const totalHours = distance / speedKmH;
    const totalSeconds = totalHours * 3600;
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.round(totalSeconds % 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
}

export default function App() {
  const [type, setType] = useState("run");
  const [averagePace, setAveragePace] = useState(5.5);
  const [paceUnit, setPaceUnit] = useState("min/km");
  const [paceInconsistency, setPaceInconsistency] = useState(0);
  const [includeHR, setIncludeHR] = useState(false);

  const [runData, setRunData] = useState({
    name: "Morning Run",
    date: new Date().toISOString().slice(0, 10),
    time: "06:30",
    description: "",
  });

  const [route, setRoute] = useState([]);

  // Realtime stats dari route
  const distance = getTotalDistance(route);
  const elevationArr = getSimulatedElevationArr(route);
  const elevation = getTotalElevationGain(elevationArr);
  const duration = getDurationFromPaceAndDistance(averagePace, distance, type, paceUnit);

  const stats = { distance: distance.toFixed(2), duration, elevation };

  React.useEffect(() => {
    if (type === "run" && paceUnit !== "min/km" && paceUnit !== "min/mile") setPaceUnit("min/km");
    if (type === "bike" && paceUnit !== "km/h" && paceUnit !== "mph") setPaceUnit("km/h");
  }, [type]); // eslint-disable-line

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-1/3 bg-white p-6 shadow-lg">
        <RunDetails
          type={type}
          setType={setType}
          stats={stats}
          averagePace={averagePace}
          setAveragePace={setAveragePace}
          paceUnit={paceUnit}
          setPaceUnit={setPaceUnit}
          paceInconsistency={paceInconsistency}
          setPaceInconsistency={setPaceInconsistency}
          includeHR={includeHR}
          setIncludeHR={setIncludeHR}
          runData={runData}
          setRunData={setRunData}
        />
        <DownloadGPX runData={{ ...runData, pace: averagePace, paceUnit, includeHR }} route={route} />
      </div>
      <div className="w-full md:w-2/3 h-[500px] md:h-screen">
        <MapRoute route={route} setRoute={setRoute} />
      </div>
    </div>
  );
}
