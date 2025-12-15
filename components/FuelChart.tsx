import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FuelDataPoint } from '../types';

interface FuelChartProps {
  data: FuelDataPoint[];
  color: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-orca-900 border border-orca-700 p-3 rounded shadow-xl text-white text-sm">
        <p className="font-bold mb-1">{label}</p>
        <p className="text-blue-300">Fuel Level: <span className="text-white font-mono">{payload[0].value}%</span></p>
        <p className="text-gray-400 text-xs mt-1">Rate: {payload[0].payload.consumptionRate} gph</p>
      </div>
    );
  }
  return null;
};

export const FuelChart: React.FC<FuelChartProps> = ({ data, color }) => {
  return (
    <div className="h-64 w-full bg-white rounded-lg p-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorFuel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="time" 
            tick={{fill: '#6b7280', fontSize: 12}} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{fill: '#6b7280', fontSize: 12}} 
            axisLine={false}
            tickLine={false}
            unit="%"
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="level" 
            stroke={color} 
            fillOpacity={1} 
            fill="url(#colorFuel)" 
            strokeWidth={3}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};