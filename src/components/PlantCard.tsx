
import { Link } from 'react-router-dom';

interface PlantCardProps {
  plant: {
    id: string;
    name: string;
    imageUrl: string;
    waterDemand: string;
    sunDemand: string;
    size: string;
    ownerProfileLink?: string;
    owner: string;
  };
}

const PlantCard = ({ plant }: PlantCardProps) => {
  // Generate a profile link if one is not provided
  const profileLink = plant.ownerProfileLink || `/profile/${plant.id}`;
  
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
    <Link
      className="card-link"
      to={`/plants/${plant.id}`}
      state={{ plant }}
    >
      <div className="card-canvas">
        <h3 className="card-title">{plant.name}</h3>
        <img 
          className="card-image" 
          src={plant.imageUrl || '/placeholder.svg'} 
          alt={`Фото растения ${plant.name}`}
        />
        <div className="card-plant-attributes-list">
          <div className="water-demand-attribute">
            {getWaterDemandText(plant.waterDemand)}
          </div>
          <div className="sun-demand-attribute">
            {getSunDemandText(plant.sunDemand)}
          </div>
          <div className="size-attribute">
            {getSizeText(plant.size)}
          </div>
        </div>
        
        <div className="card-contacts">
          <p><b>Владелец:</b></p>
          <Link 
            className="owner-link" 
            to={profileLink}
            onClick={(e) => e.stopPropagation()}
          >
            {plant.owner}
          </Link>
        </div>
      </div>
    </Link>
  );
};

export default PlantCard;
