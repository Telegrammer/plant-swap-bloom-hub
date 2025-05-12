
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Sun, Ruler } from 'lucide-react';

interface PlantCardProps {
  plant: {
    id: string;
    name: string;
    imageUrl: string;
    waterDemand: string;
    sunDemand: string;
    size: string;
    owner: string;
    ownerName?: string;
  };
}

const PlantCard = ({ plant }: PlantCardProps) => {
  // Handle case when owner might not be a UUID format
  let profileLink = '/profile';
  
  if (plant.owner) {
    try {
      // Simple check if format looks like UUID
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(plant.owner)) {
        profileLink = `/profile/${plant.owner}`;
      } else {
        // If owner is not in UUID format, use it as username
        profileLink = `/profile/${plant.owner}`;
      }
    } catch (e) {
      console.log("Error processing owner ID:", e);
      profileLink = `/profile/${plant.owner}`;
    }
  }
  
  // Translate database values to Russian display values
  const getWaterDemandText = (demand: string) => {
    switch (demand) {
      case 'low': return 'Редкий полив';
      case 'medium': return 'Умеренный полив';
      case 'high': return 'Частый полив';
      default: return demand;
    }
  };
  
  const getSunDemandText = (demand: string) => {
    switch (demand) {
      case 'low': return 'Полутень';
      case 'medium': return 'Рассеянный свет';
      case 'high': return 'Яркий свет';
      default: return demand;
    }
  };
  
  const getSizeText = (size: string) => {
    switch (size) {
      case 'small': return 'Маленький';
      case 'medium': return 'Средний';
      case 'large': return 'Большой';
      default: return size;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <Link
        className="block flex-grow"
        to={`/plants/${plant.id}`}
      >
        <div className="h-52 overflow-hidden">
          <img 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
            src={plant.imageUrl || '/placeholder.svg'} 
            alt={`Фото растения ${plant.name}`}
          />
        </div>
        
        <CardHeader className="pb-2">
          <CardTitle className="text-green-700">{plant.name}</CardTitle>
        </CardHeader>
        
        <CardContent className="pb-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-1 text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
              <Droplets className="h-3 w-3" />
              <span>{getWaterDemandText(plant.waterDemand)}</span>
            </div>
            <div className="flex items-center gap-1 text-sm bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">
              <Sun className="h-3 w-3" />
              <span>{getSunDemandText(plant.sunDemand)}</span>
            </div>
            <div className="flex items-center gap-1 text-sm bg-green-50 text-green-700 px-2 py-1 rounded-full">
              <Ruler className="h-3 w-3" />
              <span>{getSizeText(plant.size)}</span>
            </div>
          </div>
        </CardContent>
      </Link>
      
      <CardFooter className="pt-0 border-t mt-auto">
        <div className="w-full">
          <p className="text-sm text-gray-500 mb-1">Владелец:</p>
          <Link 
            className="text-green-700 hover:text-green-900 font-medium flex items-center"
            to={profileLink}
            onClick={(e) => e.stopPropagation()}
          >
            {plant.ownerName || 'Просмотреть профиль'}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PlantCard;
