
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPlantById, getPlants, Plant } from '@/api/plants';
import { getUserById } from '@/api/users';
import { useToast } from "@/hooks/use-toast";
import Navbar from '@/components/Navbar';
import ExchangeRequest from '@/components/ExchangeRequest';
import PlantDetailHeader from '@/components/plant-detail/PlantDetailHeader';
import PlantInfoCard from '@/components/plant-detail/PlantInfoCard';
import SimilarPlants from '@/components/plant-detail/SimilarPlants';
import PlantNotFound from '@/components/plant-detail/PlantNotFound';
import PlantDetailSkeleton from '@/components/plant-detail/PlantDetailSkeleton';

const PlantDetail = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [owner, setOwner] = useState(null);
  const [similarPlants, setSimilarPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPlantDetails = async () => {
      try {
        if (id) {
          const fetchedPlant = await getPlantById(id);
          console.log("Fetched plant:", fetchedPlant);
          setPlant(fetchedPlant);

          // Fetch owner details
          if (fetchedPlant.owner) {
            try {
              const ownerId = fetchedPlant.owner;
              console.log("Fetching owner with ID:", ownerId);
              
              const plantOwner = await getUserById(ownerId);
              console.log("Fetched owner:", plantOwner);
              setOwner(plantOwner);
            } catch (ownerError) {
              console.error("Error fetching plant owner:", ownerError);
              // Only create fallback if owner ID exists but fetch failed
              setOwner({
                id: fetchedPlant.owner,
                name: fetchedPlant.ownerName || 'Неизвестный пользователь',
                profileImageUrl: null
              });
            }
          }

          // Fetch similar plants
          const allPlants = await getPlants();
          const similar = allPlants
            .filter(p => p.id !== fetchedPlant.id && p.size === fetchedPlant.size)
            .slice(0, 3);
          setSimilarPlants(similar);
        }
      } catch (error) {
        console.error("Error fetching plant details:", error);
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить информацию о растении",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlantDetails();
  }, [id, toast]);

  if (loading) {
    return <PlantDetailSkeleton />;
  }

  if (!plant) {
    return <PlantNotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="page-container">
        <PlantDetailHeader />
        
        <PlantInfoCard plant={plant} owner={owner} />
        
        {owner && (
          <div className="mt-8">
            <ExchangeRequest 
              plantId={plant.id} 
              plantName={plant.name} 
              ownerId={owner.id} 
              ownerName={owner.name} 
            />
          </div>
        )}
        
        <SimilarPlants plants={similarPlants} />
      </main>
    </div>
  );
};

export default PlantDetail;
