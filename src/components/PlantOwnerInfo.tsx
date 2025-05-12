
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PlantOwnerProps {
  owner: {
    id: string;
    name: string;
    profileImageUrl: string | null;
    location?: string;
  } | null;
}

const PlantOwnerInfo = ({ owner }: PlantOwnerProps) => {
  if (!owner) return null;
  
  return (
    <div className="border-t border-gray-200 pt-6 mb-6">
      <h3 className="font-medium text-lg mb-3">Владелец</h3>
      
      <Link to={`/profile/${owner.id}`} className="flex items-center gap-3 group">
        <Avatar className="h-10 w-10">
          <AvatarImage src={owner.profileImageUrl || undefined} alt={owner.name} />
          <AvatarFallback>{owner.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-green-700 group-hover:text-green-800">
            {owner.name}
          </p>
          {owner.location && <p className="text-sm text-gray-500">{owner.location}</p>}
        </div>
      </Link>
    </div>
  );
};

export default PlantOwnerInfo;
