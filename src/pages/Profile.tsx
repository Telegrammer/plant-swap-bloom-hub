
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useToast } from "@/hooks/use-toast";
import { AddPlantDialog } from '@/components/AddPlantDialog';
import { DeletePlantDialog } from '@/components/DeletePlantDialog';
import UserProfileHeader from '@/components/profile/UserProfileHeader';
import UserPlantsGrid from '@/components/profile/UserPlantsGrid';
import { useProfileData } from '@/hooks/useProfileData';

const Profile = () => {
  const { id } = useParams();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteDialogState, setDeleteDialogState] = useState({ isOpen: false, plantId: null, plantName: '' });
  const { toast } = useToast();
  
  const { 
    user, 
    userPlants, 
    loading, 
    isOwnProfile,
    handleAddPlant,
    handleDeletePlant 
  } = useProfileData(id);

  const handleOpenDeleteDialog = (plantId, plantName) => {
    setDeleteDialogState({
      isOpen: true,
      plantId,
      plantName
    });
  };

  const confirmDeletePlant = async () => {
    try {
      const success = await handleDeletePlant(deleteDialogState.plantId);
      
      if (success) {
        toast({
          title: "Растение удалено",
          description: `${deleteDialogState.plantName} удалено из вашей коллекции`,
        });
      }
    } finally {
      setDeleteDialogState({ isOpen: false, plantId: null, plantName: '' });
    }
  };

  const onAddPlant = async (plantData) => {
    const newPlant = await handleAddPlant(plantData);
    if (newPlant) {
      setIsAddDialogOpen(false);
    }
  };

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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="page-container text-center py-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Пользователь не найден</h2>
          <p className="text-gray-600">К сожалению, пользователь с указанным ID не существует.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="page-container">
        <UserProfileHeader user={user} />
        
        <UserPlantsGrid 
          plants={userPlants} 
          isOwnProfile={isOwnProfile} 
          onAddPlant={() => setIsAddDialogOpen(true)}
          onDeletePlant={handleOpenDeleteDialog}
        />
      </main>

      <AddPlantDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddPlant={onAddPlant}
      />
      
      <DeletePlantDialog
        isOpen={deleteDialogState.isOpen}
        onClose={() => setDeleteDialogState({ isOpen: false, plantId: null, plantName: '' })}
        onConfirm={confirmDeletePlant}
        plantName={deleteDialogState.plantName}
      />
    </div>
  );
};

export default Profile;
