
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import PlantCard from '@/components/PlantCard';
import PlantFilter from '@/components/PlantFilter';
import { getPlants } from '@/api/plants';
import { toast } from 'sonner';

const Plants = () => {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [filters, setFilters] = useState({
    sizes: [],
    waterDemands: [],
    sunDemands: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const fetchedPlants = await getPlants();
        setPlants(fetchedPlants);
        setFilteredPlants(fetchedPlants);
      } catch (error) {
        toast.error('Не удалось загрузить список растений');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    
    // Применяем фильтры
    let filteredPlantsResult = [...plants];
    
    // Фильтр по размеру
    if (newFilters.sizes.length > 0) {
      filteredPlantsResult = filteredPlantsResult.filter(plant => 
        newFilters.sizes.includes(plant.size)
      );
    }
    
    // Фильтр по поливу
    if (newFilters.waterDemands.length > 0) {
      filteredPlantsResult = filteredPlantsResult.filter(plant => 
        newFilters.waterDemands.includes(plant.waterDemand)
      );
    }
    
    // Фильтр по освещению
    if (newFilters.sunDemands.length > 0) {
      filteredPlantsResult = filteredPlantsResult.filter(plant => 
        newFilters.sunDemands.includes(plant.sunDemand)
      );
    }
    
    setFilteredPlants(filteredPlantsResult);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="page-container">
        <h1 className="text-3xl font-bold text-green-800 mb-8">Каталог растений</h1>
        
        <PlantFilter onFilterChange={handleFilterChange} />
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : filteredPlants.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPlants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              По вашим фильтрам ничего не найдено
            </h3>
            <p className="text-gray-600">
              Попробуйте изменить критерии поиска
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Plants;
