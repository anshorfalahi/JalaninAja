import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function DataVisualization({ paceData, elevationData, hrData }) {
  return (
    <>
      <div className="bg-white rounded-xl p-4 mb-4 border">
        <div className="font-semibold text-orange-600 mb-1">Pace Profile <span className="text-xs font-normal text-gray-400 ml-2">Average: {paceData?.avg?.toFixed(2)} {paceData.avg > 0 ? "min/km" : ""}</span></div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={paceData?.chartData || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="distance" label={{ value: 'Distance (km)', position: 'insideBottomRight', offset: -3 }} />
            <YAxis reversed={true} domain={['dataMin - 1', 'dataMax + 1']} />
            <Tooltip />
            <Line type="monotone" dataKey="pace" stroke="#f97316" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-white rounded-xl p-4 border mb-4">
        <div className="font-semibold text-orange-600 mb-1">Elevation Profile <span className="text-xs font-normal text-gray-400 ml-2">Total Gain: {elevationData?.totalGain || 0}m</span></div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={elevationData?.chartData || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="distance" label={{ value: 'Distance (km)', position: 'insideBottomRight', offset: -3 }} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="elevation" stroke="#f97316" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {hrData && hrData.chartData && hrData.chartData.length > 0 && (
        <div className="bg-white rounded-xl p-4 border">
          <div className="font-semibold text-orange-600 mb-1">Heart Rate Profile <span className="text-xs font-normal text-gray-400 ml-2">Average: {hrData?.avg || 0} bpm</span></div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={hrData.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="distance" label={{ value: 'Distance (km)', position: 'insideBottomRight', offset: -3 }} />
              <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip />
              <Line type="monotone" dataKey="hr" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}