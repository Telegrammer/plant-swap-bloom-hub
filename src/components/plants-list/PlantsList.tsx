
import React from 'react';
import PlantCard from '@/components/PlantCard';
import { Skeleton } from "@/components/ui/skeleton";

interface PlantsListProps {
  plants: any[];
  loading: boolean;
}

const PlantsList = ({ plants, loading }: PlantsListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (plants.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200 mt-8">
        <h3 className="text-xl font-medium text-gray-800 mb-2">
          По вашим фильтрам ничего не найдено
        </h3>
        <p className="text-gray-600">
          Попробуйте изменить критерии поиска
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
      {plants.map((plant) => (
        <PlantCard key={plant.id} plant={plant} />
      ))}
    </div>
  );
};

export default PlantsList;
