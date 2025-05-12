
import React from 'react';

interface EmptyPlantsListProps {
  isFiltered: boolean;
}

const EmptyPlantsList = ({ isFiltered }: EmptyPlantsListProps) => {
  return (
    <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200 mt-8">
      <h3 className="text-xl font-medium text-gray-800 mb-2">
        {isFiltered 
          ? "По вашим фильтрам ничего не найдено" 
          : "Растения не найдены"}
      </h3>
      <p className="text-gray-600">
        {isFiltered
          ? "Попробуйте изменить критерии поиска"
          : "Скоро здесь появятся растения"}
      </p>
    </div>
  );
};

export default EmptyPlantsList;
