
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useToast } from "@/hooks/use-toast";
import { AddPlantDialog } from '@/components/AddPlantDialog';
import { DeletePlantDialog } from '@/components/DeletePlantDialog';
import UserProfileHeader from '@/components/profile/UserProfileHeader';
import UserPlantsGrid from '@/components/profile/UserPlantsGrid';
import { EditProfileDialog } from '@/components/profile/EditProfileDialog';
import { useProfileData } from '@/hooks/useProfileData';
import { User } from '@/api/users';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const { userId } = useParams();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteDialogState, setDeleteDialogState] = useState({ isOpen: false, plantId: '', plantName: '' });
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Проверяем аутентификацию
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session && !userId) {
        toast({
          title: "Требуется авторизация",
          description: "Пожалуйста, войдите в систему",
          variant: "destructive"
        });
        navigate('/auth');
      }
    };
    
    checkAuth();
  }, [userId, navigate, toast]);
  
  // Передаем userId как параметр в хук useProfileData
  const { 
    user, 
    userPlants, 
    loading, 
    isOwnProfile,
    handleAddPlant,
    handleDeletePlant,
    setUser
  } = useProfileData(userId);

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
      setDeleteDialogState({ isOpen: false, plantId: '', plantName: '' });
    }
  };

  const onAddPlant = async (plantData) => {
    const newPlant = await handleAddPlant(plantData);
    if (newPlant) {
      setIsAddDialogOpen(false);
    }
  };

  const handleProfileUpdate = (updatedUser: User) => {
    setUser(updatedUser);
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
          <p className="text-gray-600 mt-2">
            Возможно, нужно создать пользователей через Supabase Auth перед использованием этой функции.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="page-container">
        <UserProfileHeader 
          user={user} 
          isOwnProfile={isOwnProfile}
          onEditProfile={() => setIsEditProfileDialogOpen(true)}
        />
        
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
        onClose={() => setDeleteDialogState({ isOpen: false, plantId: '', plantName: '' })}
        onConfirm={confirmDeletePlant}
        plantName={deleteDialogState.plantName}
      />

      {user && (
        <EditProfileDialog
          isOpen={isEditProfileDialogOpen}
          onClose={() => setIsEditProfileDialogOpen(false)}
          user={user}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
};

export default Profile;
