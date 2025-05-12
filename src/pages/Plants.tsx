
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import PlantFilter from '@/components/PlantFilter';
import PlantsHeader from '@/components/plants-list/PlantsHeader';
import PlantsList from '@/components/plants-list/PlantsList';
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
          <PlantsHeader />
          
          <PlantFilter onFilterChange={handleFilterChange} />
          
          <PlantsList plants={filteredPlants} loading={loading} />
        </div>
      </main>
    </div>
  );
};

export default Plants;
