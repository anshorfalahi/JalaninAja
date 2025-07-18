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

// Fungsi untuk memadatkan rute dengan titik-titik perantara
function interpolateRoute(route, stepMeter = 20) {
  if (route.length < 2) return route;
  
  const newRoute = [];
  newRoute.push(route[0]);

  for (let i = 0; i < route.length - 1; i++) {
    const startPoint = route[i];
    const endPoint = route[i+1];
    const distance = getDistanceMeters(startPoint, endPoint);
    
    const numSegments = Math.max(1, Math.floor(distance / stepMeter));

    for (let j = 1; j <= numSegments; j++) {
      const ratio = j / numSegments;
      const lat = startPoint[0] + (endPoint[0] - startPoint[0]) * ratio;
      const lon = startPoint[1] + (endPoint[1] - startPoint[1]) * ratio;
      newRoute.push([lat, lon]);
    }
  }
  return newRoute;
}

// Total distance (km)
function getTotalDistance(route) {
  let dist = 0;
  for (let i = 1; i < route.length; i++) {
    dist += getDistanceMeters(route[i - 1], route[i]);
  }
  return dist / 1000;
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

  const distance = getTotalDistance(route);
  const duration = getDurationFromPaceAndDistance(averagePace, distance, type, paceUnit);
  // Elevation di-generate di useEffect
  const stats = { distance: distance.toFixed(2), duration, elevation: elevationData.totalGain };


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
    
    const interpolatedRoute = interpolateRoute(route, 20);

    let cumulativeDistance = 0;
    const elevationProfile = interpolatedRoute.map((point, i) => {
        if (i > 0) {
            cumulativeDistance += getDistanceMeters(interpolatedRoute[i - 1], point) / 1000;
        }
        const elevation = 40 + (Math.sin(i / 25) * 15) + (Math.sin(i / 8) * 5) + ((Math.random() - 0.5) * 2);
        return {
            distance: parseFloat(cumulativeDistance.toFixed(2)),
            elevation: parseFloat(elevation.toFixed(2))
        };
    });
    const totalGain = getTotalElevationGain(elevationProfile.map(d => d.elevation));
    setElevationData({ totalGain: totalGain, chartData: elevationProfile });

    let smoothedHR = avgHR;
    const hrInertiaFactor = 0.1;

    // Tahap 1: Buat data kecepatan yang "berisik"
    const noisyChartData = elevationProfile.map((dataPoint, i) => {
        let gradient = 0;
        if (i > 0) {
            const eleDiff = dataPoint.elevation - elevationProfile[i - 1].elevation;
            const distDiff = (dataPoint.distance - elevationProfile[i - 1].distance) * 1000;
            if (distDiff > 0) {
                gradient = (eleDiff / distDiff) * 100;
            }
        }
        let currentPace = averagePace;
        const inconsistencyValue = paceInconsistency / 100.0;
        if (inconsistencyValue > 0) {
            const gradientPaceEffect = (gradient * 0.1); 
            const randomNoise = (Math.random() - 0.5) * 2; 
            const randomInconsistencyEffect = averagePace * inconsistencyValue * 0.5 * randomNoise;
            currentPace += gradientPaceEffect + randomInconsistencyEffect;
        }
        currentPace = Math.max(2.5, Math.min(25.0, currentPace));
        return { ...dataPoint, pace: currentPace };
    });

    // Tahap 2: Haluskan data kecepatan yang berisik menggunakan moving average
    const noisyPaceValues = noisyChartData.map(d => d.pace);
    const smoothingWindow = 7; // Angka ganjil lebih baik, bisa diubah untuk tingkat kehalusan
    const smoothedPaceValues = [];

    for (let i = 0; i < noisyPaceValues.length; i++) {
        const start = Math.max(0, i - Math.floor(smoothingWindow / 2));
        const end = Math.min(noisyPaceValues.length, i + Math.floor(smoothingWindow / 2) + 1);
        let sum = 0;
        for (let j = start; j < end; j++) {
            sum += noisyPaceValues[j];
        }
        smoothedPaceValues.push(sum / (end - start));
    }

    // Tahap 3: Gabungkan data yang sudah dihaluskan kembali ke data final
    const finalChartData = noisyChartData.map((dataPoint, i) => {
        // Kalkulasi HR (bisa tetap di sini)
        const gradientHrEffect = 0; // Efek gradien pada HR bisa ditambahkan jika perlu
        const hrVariabilityFactor = hrVariation / 100;
        const randomHrNoise = (Math.random() - 0.5) * 3 * (1 + hrVariabilityFactor);
        const targetHR = avgHR + gradientHrEffect + randomHrNoise;
        smoothedHR += (targetHR - smoothedHR) * hrInertiaFactor;
        const currentHR = Math.round(Math.max(avgHR * 0.7, Math.min(avgHR * 1.3, smoothedHR)));

        return {
          ...dataPoint,
          pace: parseFloat(smoothedPaceValues[i].toFixed(2)),
          hr: currentHR
        };
    });
    
    setPaceData({ avg: averagePace, chartData: finalChartData });
    if (includeHR) {
      setHrData({ avg: avgHR, chartData: finalChartData });
    } else {
      setHrData({ avg: 0, chartData: [] });
    }
  }, [route, averagePace, paceInconsistency, avgHR, hrVariation, includeHR, type, paceUnit]);

  return (
    <div className="app-container">
      <div className="sidebar">
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
      <div className="main-content">
        <div className="map-container-wrapper">
          <MapRoute route={route} setRoute={setRoute} />
        </div>
        <div className="visualization-container">
          <DataVisualization paceData={paceData} elevationData={elevationData} hrData={hrData} />
        </div>
      </div>
    </div>
  );
}