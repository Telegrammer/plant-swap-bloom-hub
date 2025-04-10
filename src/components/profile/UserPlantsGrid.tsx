
import { Button } from "@/components/ui/button";
import PlantCard from '@/components/PlantCard';
import { Plant } from '@/api/plants';
import { Plus, Trash2 } from 'lucide-react';

interface UserPlantsGridProps {
  plants: Plant[];
  isOwnProfile: boolean;
  onAddPlant: () => void;
  onDeletePlant: (plantId: number, plantName: string) => void;
}

const UserPlantsGrid = ({ plants, isOwnProfile, onAddPlant, onDeletePlant }: UserPlantsGridProps) => {
  return (
    <div className="mt-12">
      <div className="flex items-center justify-between">
        <h2 className="section-title">Растения пользователя</h2>
        
        {isOwnProfile && (
          <Button 
            onClick={onAddPlant}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Добавить растение</span>
          </Button>
        )}
      </div>
      
      {plants.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {plants.map((plant) => {
            // Add ownerProfileLink to plant data for PlantCard
            const plantWithOwnerLink = {
              ...plant,
              ownerProfileLink: `/profile/${plant.id}`,
            };
            
            return (
              <div key={plant.id} className="relative">
                <PlantCard plant={plantWithOwnerLink} />
                
                {isOwnProfile && (
                  <div className="absolute top-4 left-4 z-10 flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="bg-white opacity-80 hover:opacity-100"
                      onClick={() => onDeletePlant(plant.id, plant.name)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 mt-6">
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            У пользователя пока нет растений
          </h3>
          <p className="text-gray-600">
            Растения для обмена еще не добавлены.
          </p>
        </div>
      )}

      {isOwnProfile && (
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={onAddPlant}
            className="bg-green-600 hover:bg-green-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
            title="Добавить новое растение"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserPlantsGrid;
