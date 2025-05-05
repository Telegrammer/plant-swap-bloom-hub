
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import PlantCard from '@/components/PlantCard';
import PlantFilter from '@/components/PlantFilter';
import { getPlants } from '@/api/plants';
import { useToast } from "@/hooks/use-toast";

const Plants = () => {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [filters, setFilters] = useState({
    sizes: [],
    waterDemands: [],
    sunDemands: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const fetchedPlants = await getPlants();
        console.log("Fetched plants:", fetchedPlants);
        setPlants(fetchedPlants);
        setFilteredPlants(fetchedPlants);
      } catch (error) {
        console.error("Error fetching plants:", error);
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить список растений",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, [toast]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    
    // Apply filters
    let filteredPlantsResult = [...plants];
    
    // Filter by size
    if (newFilters.sizes.length > 0) {
      filteredPlantsResult = filteredPlantsResult.filter(plant => 
        newFilters.sizes.includes(plant.size)
      );
    }
    
    // Filter by water demand
    if (newFilters.waterDemands.length > 0) {
      filteredPlantsResult = filteredPlantsResult.filter(plant => 
        newFilters.waterDemands.includes(plant.waterDemand)
      );
    }
    
    // Filter by sun demand
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-green-800 mb-2">Каталог растений</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Найдите идеальное растение для своего дома или обменяйтесь с другими энтузиастами
            </p>
          </div>
          
          <PlantFilter onFilterChange={handleFilterChange} />
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : filteredPlants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
              {filteredPlants.map((plant) => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200 mt-8">
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                По вашим фильтрам ничего не найдено
              </h3>
              <p className="text-gray-600">
                Попробуйте изменить критерии поиска
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Plants;
