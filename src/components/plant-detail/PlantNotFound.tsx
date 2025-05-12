
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';

const PlantNotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="page-container text-center py-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Растение не найдено</h2>
        <p className="text-gray-600 mb-6">К сожалению, растение с указанным ID не существует.</p>
        <Link 
          to="/plants" 
          className="text-green-600 hover:text-green-800 flex items-center gap-2 justify-center"
        >
          <ArrowLeft className="h-4 w-4" />
          Вернуться к каталогу
        </Link>
      </div>
    </div>
  );
};

export default PlantNotFound;
