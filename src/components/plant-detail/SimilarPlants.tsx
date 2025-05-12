
import React from 'react';
import PlantCard from '@/components/PlantCard';
import { Plant } from '@/api/plants';

interface SimilarPlantsProps {
  plants: Plant[];
}

const SimilarPlants = ({ plants }: SimilarPlantsProps) => {
  if (plants.length === 0) return null;
  
  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-green-800 mb-4">Похожие растения</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {plants.map(plant => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>
    </div>
  );
};

export default SimilarPlants;
