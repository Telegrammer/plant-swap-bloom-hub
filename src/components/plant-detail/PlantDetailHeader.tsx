
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PlantDetailHeader = () => {
  return (
    <Link 
      to="/plants" 
      className="text-green-600 hover:text-green-800 flex items-center gap-1 mb-6"
    >
      <ArrowLeft className="h-4 w-4" />
      Назад к списку
    </Link>
  );
};

export default PlantDetailHeader;
