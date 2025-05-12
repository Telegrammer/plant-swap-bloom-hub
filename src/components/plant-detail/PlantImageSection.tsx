
import React from 'react';

interface PlantImageSectionProps {
  imageUrl: string | null;
  name: string;
}

const PlantImageSection = ({ imageUrl, name }: PlantImageSectionProps) => {
  return (
    <div className="md:w-1/2">
      <img 
        src={imageUrl || '/placeholder.svg'} 
        alt={name} 
        className="h-80 w-full object-cover md:h-full"
      />
    </div>
  );
};

export default PlantImageSection;
