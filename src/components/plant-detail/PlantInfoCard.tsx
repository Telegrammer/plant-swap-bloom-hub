
import React from 'react';
import PlantImageSection from './PlantImageSection';
import PlantAttributes from './PlantAttributes';
import PlantOwnerInfo from './PlantOwnerInfo';
import { Plant } from '@/api/plants';

interface PlantInfoCardProps {
  plant: Plant;
  owner: {
    id: string;
    name: string;
    profileImageUrl: string | null;
    location?: string;
  } | null;
}

const PlantInfoCard = ({ plant, owner }: PlantInfoCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="md:flex">
        <PlantImageSection imageUrl={plant.imageUrl} name={plant.name} />
        
        <div className="p-6 md:p-8 md:w-1/2">
          <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-2">{plant.name}</h1>
          <p className="text-gray-500 mb-6">{plant.types?.join(', ')}</p>
          
          <PlantAttributes 
            waterDemand={plant.waterDemand} 
            sunDemand={plant.sunDemand} 
            size={plant.size}
          />
          
          <h3 className="font-medium text-lg mb-2">Описание</h3>
          <p className="text-gray-700 mb-6">{plant.description}</p>
          
          <PlantOwnerInfo owner={owner} />
        </div>
      </div>
    </div>
  );
};

export default PlantInfoCard;
