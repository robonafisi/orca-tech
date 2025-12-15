export interface FuelDataPoint {
  time: string;
  level: number; // Percentage 0-100
  consumptionRate: number; // Gallons per hour
}

export interface Truck {
  id: string;
  name: string;
  driver: string;
  status: 'Moving' | 'Idling' | 'Stopped' | 'Refueling';
  fuelLevel: number; // Current %
  capacity: number; // Total gallons
  currentMpg: number;
  location: string;
  history: FuelDataPoint[];
  lastUpdated: string;
}

export interface InsightResult {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'critical';
  recommendation: string;
}