import React, { useState, useEffect } from "react";
import RunDetails from "./components/RunDetails";
import MapRoute from "./components/MapRoute";
import DownloadGPX from "./components/DownloadGPX";
import DataVisualization from "./components/DataVisualization";

// Haversine formula untuk jarak (meter)
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
// Total distance (km)
function getTotalDistance(route) {
  let dist = 0;
  for (let i = 1; i < route.length; i++) {
    dist += getDistanceMeters(route[i - 1], route[i]);
  }
  return dist / 1000;
}
// Simulasi elevation array
function getSimulatedElevationArr(route) {
  return route.map((_, i) => 15 + Math.sin(i / 3) * 6); // meter, just for display
}
function getTotalElevationGain(elevArr) {
  let gain = 0;
  for (let i = 1; i < elevArr.length; i++) {
    const diff = elevArr[i] - elevArr[i - 1];
    if (diff > 0) gain += diff;
  }
  return Math.round(gain); // meter
}
// Durasi (dari pace/speed dan distance)
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

  // States for HR and visualization data
  const [avgHR, setAvgHR] = useState(150);
  const [hrVariation, setHrVariation] = useState(7);
  const [paceData, setPaceData] = useState({ avg: 0, chartData: [] });
  const [elevationData, setElevationData] = useState({ totalGain: 0, chartData: [] });
  const [hrData, setHrData] = useState({ avg: 0, chartData: [] });

  // Calculate stats (otomatis dari route)
  const distance = getTotalDistance(route);
  const elevationArr = getSimulatedElevationArr(route);
  const elevation = getTotalElevationGain(elevationArr);
  const duration = getDurationFromPaceAndDistance(averagePace, distance, type, paceUnit);
  const stats = { distance: distance.toFixed(2), duration, elevation };

  useEffect(() => {
    if (type === "run" && paceUnit !== "min/km" && paceUnit !== "min/mile") {
      setPaceUnit("min/km");
    }
    if (type === "ride" && paceUnit !== "km/h" && paceUnit !== "mph") {
      setPaceUnit("km/h");
    }
  }, [type, paceUnit]);

  // Generate real-time data for visualization
  useEffect(() => {
    if (route.length < 2) {
      setPaceData({ avg: 0, chartData: [] });
      setElevationData({ totalGain: 0, chartData: [] });
      setHrData({ avg: 0, chartData: [] });
      return;
    }

    // First pass: Calculate distance and a random elevation profile
    let cumulativeDistance = 0;
    const elevationProfile = route.map((point, i) => {
        if (i > 0) {
            cumulativeDistance += getDistanceMeters(route[i-1], point) / 1000;
        }
        const randomElevationFactor = (Math.sin(i / 12) * 0.6) + (Math.sin(i/5) * 0.4) + ((Math.random() - 0.5) * 0.2);
        const elevation = 40 + (randomElevationFactor * 30);
        return {
            distance: parseFloat(cumulativeDistance.toFixed(2)),
            elevation: parseFloat(elevation.toFixed(2))
        };
    });

    // Second pass: Calculate gradient and correlate pace and HR
    let smoothedHR = avgHR;
    const hrInertiaFactor = 0.1; 

    const finalChartData = elevationProfile.map((dataPoint, i) => {
        let gradient = 0;
        if (i > 0) {
            const eleDiff = dataPoint.elevation - elevationProfile[i - 1].elevation;
            const distDiff = (dataPoint.distance - elevationProfile[i - 1].distance) * 1000;
            if (distDiff > 0) {
                gradient = (eleDiff / distDiff) * 100;
            }
        }

        // --- Simulate Pace ---
        let currentPace = averagePace;
        const inconsistencyFactor = paceInconsistency / 50.0; // Scale from 0 to 1

        if (inconsistencyFactor > 0) {
            const gradientPaceEffect = (gradient > 0 ? (gradient * 0.2) : (gradient * 0.1)) * inconsistencyFactor;
            
            const randomInconsistencyEffect = (averagePace * inconsistencyFactor) * (Math.sin(i / 15) * 0.5 + Math.sin(i/5) * 0.5) * 0.5;

            currentPace += gradientPaceEffect + randomInconsistencyEffect;
        }
        
        // Widen the clamp to allow for variations at extreme average paces
        currentPace = Math.max(2.5, Math.min(25.0, currentPace));

        // --- Simulate HR with Inertia (Always affected by gradient) ---
        const gradientHrEffect = gradient > 0 ? (gradient * 3.5) : (gradient * 0.5);
        const hrVariabilityFactor = hrVariation / 100;
        const randomHrNoise = (Math.random() - 0.5) * 3 * (1 + hrVariabilityFactor);
        
        const targetHR = avgHR + gradientHrEffect + randomHrNoise;
        smoothedHR += (targetHR - smoothedHR) * hrInertiaFactor;

        const hrMax = avgHR * (1 + hrVariabilityFactor * 1.5);
        const hrMin = avgHR * (1 - hrVariabilityFactor);
        const currentHR = Math.round(Math.max(hrMin, Math.min(hrMax, smoothedHR)));


        return {
            ...dataPoint,
            pace: parseFloat(currentPace.toFixed(2)),
            hr: currentHR
        };
    });
    
    const totalGain = getTotalElevationGain(finalChartData.map(d => d.elevation));

    setPaceData({ avg: averagePace, chartData: finalChartData });
    setElevationData({ totalGain: totalGain, chartData: finalChartData });
    if (includeHR) {
      setHrData({ avg: avgHR, chartData: finalChartData });
    } else {
      setHrData({ avg: 0, chartData: [] });
    }
  }, [route, averagePace, paceInconsistency, avgHR, hrVariation, includeHR, type, paceUnit]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-[400px] xl:w-[430px] bg-white p-6 shadow-lg overflow-y-auto">
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
          avgHR={avgHR}
          setAvgHR={setAvgHR}
          hrVariation={hrVariation}
          setHrVariation={setHrVariation}
          runData={runData}
          setRunData={setRunData}
        />
        <DownloadGPX runData={{ ...runData, pace: averagePace, paceUnit, includeHR, avgHR, hrVariation }} route={route} type={type} />
      </div>

      {/* Main Content (Map + Visualization) */}
      <div className="w-full md:flex-1 flex flex-col">
        {/* Map Container */}
        <div className="h-[60vh]">
          <MapRoute route={route} setRoute={setRoute} />
        </div>

        {/* Data Visualization Container */}
        <div className="flex-1 p-4 overflow-y-auto">
          <DataVisualization paceData={paceData} elevationData={elevationData} hrData={hrData} />
        </div>
      </div>
    </div>
  );
}