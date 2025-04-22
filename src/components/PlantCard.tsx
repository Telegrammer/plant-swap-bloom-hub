
import { Link } from 'react-router-dom';

interface PlantCardProps {
  plant: {
    id: string;  // Changed from number to string to match Supabase's UUID format
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
          src={plant.imageUrl} 
          alt={`Фото растения ${plant.name}`}
        />
        <div className="card-plant-attributes-list">
          <div className="water-demand-attribute">
            {plant.waterDemand}
          </div>
          <div className="sun-demand-attribute">
            {plant.sunDemand}
          </div>
          <div className="size-attribute">
            {plant.size}
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
