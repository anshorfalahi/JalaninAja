import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function DataVisualization({ paceData, elevationData }) {
  return (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-2">Data Visualization</h2>
      <div className="bg-white rounded-xl p-4 mb-4 border">
        <div className="font-semibold text-orange-600 mb-1">Pace Profile <span className="text-xs font-normal text-gray-400 ml-2">Average: {paceData?.avg?.toFixed(2)} min/km</span></div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={paceData?.chartData || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="distance" label={{ value: 'Distance (km)', position: 'insideBottomRight', offset: -3 }} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="pace" stroke="#f97316" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-xl p-4 border">
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
    </div>
  );
}
