import React from "react";

// Pace conversion helpers
// function kmToMiles(km) {
//   return km * 0.621371;
// }
// function milesToKm(miles) {
//   return miles / 0.621371;
// }
function minPerKmToMinPerMile(minPerKm) {
  return minPerKm / 0.621371;
}
function minPerMileToMinPerKm(minPerMile) {
  return minPerMile * 0.621371;
}
function kmhToMph(kmh) {
  return kmh * 0.621371;
}
function mphToKmh(mph) {
  return mph / 0.621371;
}

// ICON COMPONENTS
// Icon Orang Lari (Google Material Icons - "directions_run")
function IconRunner({ color = "#FC5200", size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512.149 512.149" fill={color} xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(-1)">
        <path d="M504.427,111.44l-1.253-1.254c-11.776-11.776-30.967-11.802-42.814,0.035l-46.089,46.574
        c-2.428,2.436-6.312,2.534-8.845,0.203l-64.618-59.657c-6.276-5.8-14.442-8.987-22.996-8.987h-96.124
        c-2.269,0-4.44,0.865-6.082,2.419l-81.47,77.356c-11.935,11.944-12.756,31.197-1.818,42.92
        c5.844,6.268,13.736,9.719,22.219,9.719h0.15c8.413-0.044,16.499-3.619,22.087-9.728l57.538-60.893h20.595L120.63,300.218H37.81
        c-19.633,0-35.778,14.68-36.758,33.421c-0.521,9.79,2.904,19.094,9.64,26.191c6.638,7,15.969,11.008,25.618,11.008h123.586
        c2.436,0,4.767-1.006,6.444-2.798l63.32-67.593l53.248,55.684l-16.075,102.735c-4.052,17.02,4.114,34.357,19.412,41.198
        c4.714,2.119,9.719,3.178,14.698,3.178c5.358,0,10.69-1.227,15.598-3.655c9.481-4.696,16.296-13.285,18.776-23.967
        l27.463-147.306c0.53-2.86-0.38-5.809-2.445-7.865l-73.295-73.198l58.227-58.138l40.589,40.58
        c11.335,11.335,31.091,11.335,42.417,0l76.156-76.147c5.623-5.623,8.722-13.109,8.722-21.054
        C513.149,124.54,510.05,117.063,504.427,111.44z" />
        <path d="M407.065,114.837c29.211,0,52.966-23.755,52.966-52.966c0-29.211-23.755-52.966-52.966-52.966
        c-29.21,0-52.966,23.755-52.966,52.966C354.1,91.082,377.855,114.837,407.065,114.837z" />
      </g>
    </svg>
  );
}

// Icon Sepeda (Google Material Icons - "directions_bike")
function IconBike({ color = "#FC5200", size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" />
    </svg>
  );
}

// Icon Jarak (Feather Icons - "map")
function IconDistance({ color = "#f97316", size = 28 }) {
  return (
    <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
      <line x1="8" y1="2" x2="8" y2="18"></line>
      <line x1="16" y1="6" x2="16" y2="22"></line>
    </svg>
  );
}

// Icon Durasi (Feather Icons - "clock")
function IconDuration({ color = "#f97316", size = 28 }) {
  return (
    <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
}

// Icon Ketinggian (Custom Mountain Icon)
function IconElevation({ color = "#f97316", size = 28 }) {
  return (
    <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 20h18L14.93 5.43a2 2 0 00-3.86 0L3 20z"></path>
      <path d="M9.5 12.5L12 9l4.5 7"></path>
    </svg>
  );
}

// Pace options
const paceOptions = [
  { max: 0, label: "Constant pace throughout the run (most efficient)" },
  { max: 10, label: "Slight pace variations (realistic for most runners)" },
  { max: 25, label: "Moderate pace changes (varied terrain or intervals)" },
  { max: 50, label: "High pace variability (challenging terrain or training)" },
];
function getPaceLabel(val) {
  return paceOptions.find(opt => val <= opt.max)?.label || paceOptions[paceOptions.length - 1].label;
}

// HR descriptions
const hrIntensityLabels = [
  { max: 120, label: "Light intensity, easy effort" },
  { max: 160, label: "Moderate intensity, steady effort" },
  { max: 220, label: "Maximum intensity, very hard effort" },
];
function getHrIntensityLabel(val) {
  return hrIntensityLabels.find(opt => val <= opt.max)?.label || hrIntensityLabels[hrIntensityLabels.length - 1].label;
}
const hrVariabilityLabels = [
  { max: 5, label: "Minimal heart rate changes (steady state)" },
  { max: 15, label: "Moderate heart rate changes (realistic for varied terrain)" },
  { max: 30, label: "High heart rate variability (intervals or challenging terrain)" },
];
function getHrVariabilityLabel(val) {
    return hrVariabilityLabels.find(opt => val <= opt.max)?.label || hrVariabilityLabels[hrVariabilityLabels.length - 1].label;
}

const RUN_PACE_UNITS = [
  { value: "min/km", label: "min/km" },
  { value: "min/mile", label: "min/mile" },
];
const BIKE_PACE_UNITS = [
  { value: "km/h", label: "km/h" },
  { value: "mph", label: "mph" },
];

export default function RunDetails({
  type, setType,
  stats,
  averagePace, setAveragePace,
  paceUnit, setPaceUnit,
  paceInconsistency, setPaceInconsistency,
  includeHR, setIncludeHR,
  avgHR, setAvgHR,
  hrVariation, setHrVariation,
  runData, setRunData,
}) {
  // Handle label, range, and conversion
  const isRun = type === "run";
  const paceUnitList = isRun ? RUN_PACE_UNITS : BIKE_PACE_UNITS;

  // Default pace/speed min/max
  const paceRange = isRun
    ? paceUnit === "min/km"
      ? [3, 15]
      : [5, 25] // min/mile, normally higher value
    : paceUnit === "km/h"
      ? [10, 60]
      : [6, 40];

  // Get value for display, slider, label
  let displayPace = averagePace;
  if (isRun) {
    // Run mode
    displayPace =
      paceUnit === "min/km"
        ? averagePace
        : minPerKmToMinPerMile(averagePace);
  } else {
    // Ride mode
    displayPace =
      paceUnit === "km/h"
        ? averagePace
        : kmhToMph(averagePace);
  }

  // Handle input slider change and convert back to base value
  const handleSliderChange = v => {
    if (isRun) {
      setAveragePace(
        paceUnit === "min/km"
          ? v
          : minPerMileToMinPerKm(v)
      );
    } else {
      setAveragePace(
        paceUnit === "km/h"
          ? v
          : mphToKmh(v)
      );
    }
  };

  // Handle unit change and update base pace
  const handleUnitChange = e => {
    const newUnit = e.target.value;
    setPaceUnit(newUnit);

    // Konversi value ke basis unit baru
    if (isRun) {
      if (paceUnit === "min/km" && newUnit === "min/mile") {
        setAveragePace(minPerKmToMinPerMile(averagePace));
      } else if (paceUnit === "min/mile" && newUnit === "min/km") {
        setAveragePace(minPerMileToMinPerKm(averagePace));
      }
    } else {
      if (paceUnit === "km/h" && newUnit === "mph") {
        setAveragePace(kmhToMph(averagePace));
      } else if (paceUnit === "mph" && newUnit === "km/h") {
        setAveragePace(mphToKmh(averagePace));
      }
    }
  };

  // Icon pace
  const PaceIcon = isRun ? IconRunner : IconBike;

  // Title & Label
  const title = isRun ? "Run Details" : "Ride Details";
  const paceLabel =
    isRun
      ? `Average Pace (${paceUnit})`
      : `Average Speed (${paceUnit})`;

  // Pace stat
  const paceStat = isRun ? paceUnit : paceUnit;

  // Placeholder name
  const namePlaceholder = isRun ? "Morning Run" : "Morning Ride";
  const descPlaceholder = isRun
    ? "Great morning run through the park..."
    : "Great morning ride through the park...";

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      {/* Title & Type */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          <span className={isRun ? "text-orange-500 font-semibold" : "text-gray-400"}>Run</span>
          <label className="inline-flex relative items-center cursor-pointer">
            <input
              type="checkbox"
              checked={!isRun}
              onChange={() => setType(isRun ? "ride" : "run")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
          <span className={!isRun ? "text-orange-500 font-semibold" : "text-gray-400"}>Ride</span>
        </div>
      </div>

     {/* Stats */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-2 bg-gray-50 rounded-xl p-4 mb-4">
        {/* Distance */}
        <div className="flex flex-col items-center justify-center">
          <span className="mb-1"><IconDistance color="#f97316" size={28} /></span>
          <span className="font-bold text-lg">{stats.distance ?? "0.00"} km</span>
          <span className="text-xs text-gray-400">Distance</span>
        </div>
        {/* Duration */}
        <div className="flex flex-col items-center justify-center">
          <span className="mb-1"><IconDuration color="#f97316" size={28} /></span>
          <span className="font-bold text-lg">{stats.duration ?? "00:00:00"}</span>
          <span className="text-xs text-gray-400">Duration</span>
        </div>
        {/* Elevation */}
        <div className="flex flex-col items-center justify-center">
          <span className="mb-1"><IconElevation color="#f97316" size={28} /></span>
          <span className="font-bold text-lg">{stats.elevation ?? "0"}m</span>
          <span className="text-xs text-gray-400">Elevation Gain</span>
        </div>
        {/* Pace/Speed */}
        <div className="flex flex-col items-center justify-center">
          <span className="mb-1"><PaceIcon color="#f97316" size={28} /></span>
          <span className="font-bold text-lg">
            {displayPace.toFixed(2)}
          </span>
          {/* Menggunakan label yang lebih deskriptif */}
          <span className="text-xs text-gray-400">{paceUnit}</span>
        </div>
      </div>

      {/* Pace Unit */}
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium">{isRun ? "Pace Unit" : "Speed Unit"}</label>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={paceUnit}
          onChange={handleUnitChange}
        >
          {paceUnitList.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Average Pace/Speed */}
      <div className="flex items-center mb-2">
        <span className="text-orange-500 mr-2">
          <PaceIcon color="#f97316" size={18} />
        </span>
        <span className="font-medium mr-2">{paceLabel}</span>
        <span className="ml-auto text-orange-500 font-bold">{displayPace.toFixed(2)} {paceStat}</span>
      </div>
      <input
        type="range"
        min={paceRange[0]}
        max={paceRange[1]}
        step={0.01}
        value={displayPace}
        onChange={e => handleSliderChange(parseFloat(e.target.value))}
        className="w-full accent-orange-500"
      />

      {/* Pace Inconsistency */}
      <div className="flex items-center mt-4 mb-1">
        <span className="text-orange-500 mr-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
        </span>
        <span className="font-medium mr-2">Pace Inconsistency</span>
        <span className="ml-auto text-orange-500 font-bold">{paceInconsistency}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={50}
        step={1}
        value={paceInconsistency}
        onChange={e => setPaceInconsistency(parseInt(e.target.value))}
        className="w-full accent-orange-500"
      />
      <div className="text-xs text-gray-400 mb-2">{getPaceLabel(paceInconsistency)}</div>

      {/* Include Heart Rate */}
      <div className="flex items-center mb-2">
        <span className="font-medium">Include Heart Rate Data</span>
        <label className="ml-auto relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={includeHR}
            onChange={() => setIncludeHR(!includeHR)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-orange-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
        </label>
      </div>

      {includeHR && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {/* Average Heart Rate */}
          <div className="flex items-center mt-4 mb-1">
            <span className="text-orange-500 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
            </span>
            <span className="font-medium mr-2">Average Heart Rate</span>
            <span className="ml-auto text-orange-500 font-bold">{avgHR} bpm</span>
          </div>
          <input
            type="range"
            min={80}
            max={220}
            step={1}
            value={avgHR}
            onChange={e => setAvgHR(parseInt(e.target.value))}
            className="w-full accent-orange-500"
          />
          <div className="text-xs text-gray-400 mb-2">{getHrIntensityLabel(avgHR)}</div>

          {/* Heart Rate Variability */}
          <div className="flex items-center mt-4 mb-1">
            <span className="text-orange-500 mr-2">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            </span>
            <span className="font-medium mr-2">Heart Rate Variability</span>
            <span className="ml-auto text-orange-500 font-bold">{hrVariation}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={30}
            step={1}
            value={hrVariation}
            onChange={e => setHrVariation(parseInt(e.target.value))}
            className="w-full accent-orange-500"
          />
          <div className="text-xs text-gray-400 mb-2">{getHrVariabilityLabel(hrVariation)}</div>
        </div>
      )}

      {/* Run/Ride Name */}
      <label className="font-medium text-sm mt-2 block">
        {isRun ? "Run Name" : "Ride Name"}
        <input
          type="text"
          value={runData.name}
          onChange={e => setRunData({ ...runData, name: e.target.value })}
          className="w-full border rounded p-2 mt-1"
          placeholder={namePlaceholder}
        />
      </label>

      {/* Date */}
      <label className="font-medium text-sm mt-2 block">
        Date
        <input
          type="date"
          value={runData.date}
          onChange={e => setRunData({ ...runData, date: e.target.value })}
          className="w-full border rounded p-2 mt-1"
        />
      </label>

      {/* Start Time */}
      <label className="font-medium text-sm mt-2 block">
        Start Time
        <input
          type="time"
          value={runData.time}
          onChange={e => setRunData({ ...runData, time: e.target.value })}
          className="w-full border rounded p-2 mt-1"
        />
      </label>

      {/* Description */}
      <label className="font-medium text-sm mt-2 block">
        Description
        <textarea
          value={runData.description}
          onChange={e => setRunData({ ...runData, description: e.target.value })}
          className="w-full border rounded p-2 mt-1"
          placeholder={descPlaceholder}
        />
      </label>
    </div>
  );
}