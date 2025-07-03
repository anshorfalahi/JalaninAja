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
function IconRunner({ color = "#f97316", size = 28 }) {
  // Simple running man SVG (Lucide "run")
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="17" cy="4" r="2"/>
      <path d="M4 17l5-5 1.5 1.5L12 12"/>
      <path d="M15 7.13V12l-2.5 2.5"/>
      <path d="M2 20l7-7 1.5 1.5"/>
      <path d="M16 21v-2l-2-4 5-5"/>
    </svg>
  );
}
function IconBike({ color = "#f97316", size = 28 }) {
  // Simple bike SVG (Lucide "bike")
  return (
    <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M12 17.5h-6m6 0l4.5-8.5m-4.5 8.5l-2.5-5m2.5 5v-5"/>
      <path d="M13 5.5c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2z"/>
    </svg>
  );
}
function IconDistance({ color = "#f97316", size = 28 }) {
  return (
    <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
      <path d="M3 12h18" />
      <path d="M3 12l4-4m0 8l-4-4" />
    </svg>
  );
}
function IconDuration({ color = "#f97316", size = 28 }) {
  return (
    <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  );
}
function IconElevation({ color = "#f97316", size = 28 }) {
  return (
    <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M14 7h7v7" />
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
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex flex-col items-center">
            <span className="mb-1"><IconDistance color="#f97316" size={28} /></span>
            <span className="font-bold text-lg">{stats.distance ?? "0.00"} km</span>
            <span className="text-xs text-gray-400">Distance</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="mb-1"><IconDuration color="#f97316" size={28} /></span>
            <span className="font-bold text-lg">{stats.duration ?? "00:00"}</span>
            <span className="text-xs text-gray-400">Duration</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center">
            <span className="mb-1"><IconElevation color="#f97316" size={28} /></span>
            <span className="font-bold text-lg">{stats.elevation ?? "0"}m</span>
            <span className="text-xs text-gray-400">Elevation Gain</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="mb-1"><PaceIcon color="#f97316" size={28} /></span>
            <span className="font-bold text-lg">
              {displayPace.toFixed(2)} {paceStat}
            </span>
            <span className="text-xs text-gray-400">{paceStat}</span>
          </div>
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
          <svg width="18" height="18" fill="currentColor"><circle cx="9" cy="9" r="9" /></svg>
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
