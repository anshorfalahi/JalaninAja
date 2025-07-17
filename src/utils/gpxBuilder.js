// Fungsi utama
export function buildGPXFile(runData, route, type = "run") {
  if (!route || route.length < 2) return "";

  // --- INTERPOLATE jika route terlalu jarang titik ---
  // Ideal: 1 titik per 10 meter
  const interpolatedRoute = interpolateRoute(route, 10); // meter

  const name = runData.name || (type === "run" ? "Run" : "Ride");
  const date = runData.date || new Date().toISOString().slice(0, 10);
  const time = runData.time || "06:30";
  const startDateTime = new Date(`${date}T${time}:00Z`);

  let pace = parseFloat(runData.pace);
  let paceUnit = runData.paceUnit || (type === "run" ? "min/km" : "km/h");
  let distance = getTotalDistance(interpolatedRoute);

  let totalDuration = 0; // detik
  if (type === "run") {
    let paceMinPerKm = pace;
    if (paceUnit === "min/mile") paceMinPerKm = pace / 1.60934;
    totalDuration = paceMinPerKm * distance * 60;
  } else {
    let speedKmH = pace;
    if (paceUnit === "mph") speedKmH = pace * 1.60934;
    totalDuration = distance / speedKmH * 3600;
  }
  if (!isFinite(totalDuration) || totalDuration <= 0) totalDuration = 1;

  const timePerPoint = totalDuration / (interpolatedRoute.length - 1);

  // HR config
  const includeHR = !!runData.includeHR;
  const avgHR = runData.avgHR ? parseInt(runData.avgHR) : 150;
  const hrVariation = runData.hrVariation !== undefined ? parseInt(runData.hrVariation) : 7;

  let pointsXml = "";
  for (let i = 0; i < interpolatedRoute.length; i++) {
    const [lat, lon] = interpolatedRoute[i];
    const ele = 0;
    const t = new Date(startDateTime.getTime() + timePerPoint * 1000 * i).toISOString();

    let hrVal = avgHR;
    if (includeHR) {
      const variation = Math.round((avgHR * hrVariation / 100) * Math.sin(i / 8));
      hrVal = avgHR + variation;
    }

    pointsXml += `
      <trkpt lat="${lat}" lon="${lon}">
        <ele>${ele}</ele>
        <time>${t}</time>
        ${includeHR ? `<extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>${hrVal}</gpxtpx:hr>
          </gpxtpx:TrackPointExtension>
        </extensions>` : ""}
      </trkpt>`;
  }

  const gpx =
    `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1"
     creator="GPX Generator"
     xmlns="http://www.topografix.com/GPX/1/1"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1"
     xsi:schemaLocation="http://www.topografix.com/GPX/1/1
     http://www.topografix.com/GPX/1/1/gpx.xsd
     http://www.garmin.com/xmlschemas/TrackPointExtension/v1
     http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd">
  <metadata>
    <name>${escapeXml(name)}</name>
    <desc>${escapeXml(runData.description || "")}</desc>
    <time>${startDateTime.toISOString()}</time>
  </metadata>
  <trk>
    <name>${escapeXml(name)}</name>
    <type>${type === "run" ? "Run" : "Ride"}</type>
    <trkseg>
      ${pointsXml}
    </trkseg>
  </trk>
</gpx>`;
  return gpx;
}

// --------------------- UTILS ---------------------

function escapeXml(unsafe) {
  if (!unsafe) return "";
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

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
  return dist / 1000; // km
}

// Interpolasi agar route punya titik rapat setiap N meter
function interpolateRoute(route, stepMeter = 10) {
  if (route.length < 2) return route;
  const out = [route[0]];
  for (let i = 1; i < route.length; i++) {
    const prev = out[out.length - 1];
    const curr = route[i];
    const dist = getDistanceMeters(prev, curr);
    if (dist > stepMeter) {
      const nPoints = Math.floor(dist / stepMeter);
      for (let j = 1; j <= nPoints; j++) {
        out.push([
          prev[0] + ((curr[0] - prev[0]) * j) / (nPoints + 1),
          prev[1] + ((curr[1] - prev[1]) * j) / (nPoints + 1)
        ]);
      }
    }
    out.push(curr);
  }
  return out;
}