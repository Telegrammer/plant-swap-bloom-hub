
import React from 'react';
import { Droplets, Sun, Ruler } from 'lucide-react';

interface PlantAttributesProps {
  waterDemand: string;
  sunDemand: string;
  size: string;
}

const PlantAttributes = ({ waterDemand, sunDemand, size }: PlantAttributesProps) => {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
        <Droplets className="h-4 w-4" />
        <span>{waterDemand}</span>
      </div>
      <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full">
        <Sun className="h-4 w-4" />
        <span>{sunDemand}</span>
      </div>
      <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full">
        <Ruler className="h-4 w-4" />
        <span>{size}</span>
      </div>
    </div>
  );
};

export default PlantAttributes;
