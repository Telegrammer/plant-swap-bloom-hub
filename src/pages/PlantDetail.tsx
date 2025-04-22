import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Droplets, Sun, Ruler } from 'lucide-react';
import Navbar from '@/components/Navbar';
import PlantCard from '@/components/PlantCard';
import ExchangeRequest from '@/components/ExchangeRequest';
import { getPlantById } from '@/api/plants';
import { getUserById } from '@/api/users';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from 'sonner';

const PlantDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [plant, setPlant] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlantDetails = async () => {
      try {
        if (id) {
          const fetchedPlant = await getPlantById(id);
          setPlant(fetchedPlant);

          // Fetch owner details
          const plantOwner = await getUserById(fetchedPlant.owner);
          setOwner(plantOwner);
        }
      } catch (error) {
        toast.error('Не удалось загрузить информацию о растении');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantDetails();
  }, [id]);

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
                src={plant.imageUrl} 
                alt={plant.name} 
                className="h-80 w-full object-cover md:h-full"
              />
            </div>
            
            <div className="p-6 md:p-8 md:w-1/2">
              <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-2">{plant.name}</h1>
              <p className="text-gray-500 mb-6">{plant.type}</p>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                  <Droplets className="h-4 w-4" />
                  <span>{plant.waterDemand}</span>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full">
                  <Sun className="h-4 w-4" />
                  <span>{plant.sunDemand}</span>
                </div>
                <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full">
                  <Ruler className="h-4 w-4" />
                  <span>{plant.size}</span>
                </div>
              </div>
              
              <h3 className="font-medium text-lg mb-2">Описание</h3>
              <p className="text-gray-700 mb-6">{plant.description}</p>
              
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="font-medium text-lg mb-3">Владелец</h3>
                
                <Link to={`/profile/${owner?.id}`} className="flex items-center gap-3 group">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={owner?.profileImageUrl} alt={owner?.name} />
                    <AvatarFallback>{owner?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-green-700 group-hover:text-green-800">
                      {plant.owner}
                    </p>
                    {owner && <p className="text-sm text-gray-500">{owner.location}</p>}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <ExchangeRequest 
            plantId={plant.id} 
            plantName={plant.name} 
            ownerId={owner?.id || 0} 
            ownerName={plant.owner} 
          />
        </div>
        
        <div className="mt-12">
          <h2 className="section-title">Похожие растения</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {/*mockPlants
              .filter(p => p.id !== plant.id && p.type === plant.type)
              .slice(0, 3)
              .map(p => (
                <PlantCard key={p.id} plant={p} />
              ))*/}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlantDetail;
