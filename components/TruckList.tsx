import React from 'react';
import { Truck } from '../types';
import { Truck as TruckIcon, Droplets, MapPin } from 'lucide-react';

interface TruckListProps {
  trucks: Truck[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const TruckList: React.FC<TruckListProps> = ({ trucks, selectedId, onSelect }) => {
  return (
    <div className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-4 border-b border-slate-100">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Your Fleet</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {trucks.map(truck => (
          <button
            key={truck.id}
            onClick={() => onSelect(truck.id)}
            className={`w-full text-left p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors group ${
              selectedId === truck.id ? 'bg-blue-50 border-l-4 border-l-orca-600' : 'border-l-4 border-l-transparent'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-slate-700 group-hover:text-orca-800 flex items-center gap-2">
                <TruckIcon size={16} className={selectedId === truck.id ? 'text-orca-600' : 'text-slate-400'} />
                {truck.name}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                truck.status === 'Moving' ? 'bg-green-100 text-green-700' :
                truck.status === 'Idling' ? 'bg-amber-100 text-amber-700' :
                truck.status === 'Refueling' ? 'bg-blue-100 text-blue-700' :
                'bg-slate-100 text-slate-600'
              }`}>
                {truck.status}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
              <div className="flex items-center gap-1">
                <Droplets size={12} className={truck.fuelLevel < 20 ? 'text-red-500' : 'text-blue-400'} />
                <span className={truck.fuelLevel < 20 ? 'text-red-600 font-bold' : ''}>{truck.fuelLevel}%</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={12} />
                <span className="truncate max-w-[100px]">{truck.location}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};