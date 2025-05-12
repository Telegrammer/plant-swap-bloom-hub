
import React from 'react';
import Navbar from '@/components/Navbar';

const PlantDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="page-container flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    </div>
  );
};

export default PlantDetailSkeleton;
