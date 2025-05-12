
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Droplets, Sun, Ruler } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ExchangeRequest from '@/components/ExchangeRequest';
import { getPlantById, getPlants, Plant } from '@/api/plants';
import { getUserById } from '@/api/users';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import PlantCard from '@/components/PlantCard';

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
              // Since the owner may not be a UUID, we'll handle it differently
              const ownerId = fetchedPlant.owner;
              console.log("Fetching owner with ID:", ownerId);
              
              // Check if the ID looks like a UUID (simple check)
              if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ownerId)) {
                const plantOwner = await getUserById(ownerId);
                console.log("Fetched owner:", plantOwner);
                setOwner(plantOwner);
              } else {
                // If not a UUID format, create basic owner information
                setOwner({
                  id: ownerId,
                  name: fetchedPlant.ownerName || ownerId,
                  profileImageUrl: null
                });
              }
            } catch (ownerError) {
              console.error("Error fetching plant owner:", ownerError);
              // Create fallback owner information in case of error
              if (fetchedPlant.owner) {
                setOwner({
                  id: fetchedPlant.owner,
                  name: fetchedPlant.ownerName || 'Неизвестный пользователь',
                  profileImageUrl: null
                });
              }
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
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="page-container flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (!plant) {
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
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="page-container">
        <Link 
          to="/plants" 
          className="text-green-600 hover:text-green-800 flex items-center gap-1 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад к списку
        </Link>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img 
                src={plant?.imageUrl} 
                alt={plant?.name} 
                className="h-80 w-full object-cover md:h-full"
              />
            </div>
            
            <div className="p-6 md:p-8 md:w-1/2">
              <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-2">{plant?.name}</h1>
              {/* Removing the reference to plant?.type which doesn't exist */}
              <p className="text-gray-500 mb-6">{plant?.types?.join(', ')}</p>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                  <Droplets className="h-4 w-4" />
                  <span>{plant?.waterDemand}</span>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full">
                  <Sun className="h-4 w-4" />
                  <span>{plant?.sunDemand}</span>
                </div>
                <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full">
                  <Ruler className="h-4 w-4" />
                  <span>{plant?.size}</span>
                </div>
              </div>
              
              <h3 className="font-medium text-lg mb-2">Описание</h3>
              <p className="text-gray-700 mb-6">{plant?.description}</p>
              
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="font-medium text-lg mb-3">Владелец</h3>
                
                {owner && (
                  <Link to={`/profile/${owner.id}`} className="flex items-center gap-3 group">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={owner.profileImageUrl} alt={owner.name} />
                      <AvatarFallback>{owner.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-green-700 group-hover:text-green-800">
                        {owner.name}
                      </p>
                      {owner.location && <p className="text-sm text-gray-500">{owner.location}</p>}
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {owner && (
          <div className="mt-8">
            <ExchangeRequest 
              plantId={plant?.id} 
              plantName={plant?.name} 
              ownerId={owner.id} 
              ownerName={owner.name} 
            />
          </div>
        )}
        
        {similarPlants.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-green-800 mb-4">Похожие растения</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {similarPlants.map(p => (
                <PlantCard key={p.id} plant={p} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PlantDetail;
