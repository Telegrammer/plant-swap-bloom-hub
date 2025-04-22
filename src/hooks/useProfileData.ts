
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getUserById, getCurrentUser, User } from '@/api/users';
import { getUserPlants, createPlant, deletePlant, Plant } from '@/api/plants';

export function useProfileData(userId?: string) {
  const [user, setUser] = useState<User | null>(null);
  const [userPlants, setUserPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const isOwnProfile = !userId;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        let userData: User | null;
        let plantData: Plant[];
        
        if (userId) {
          userData = await getUserById(userId);
          plantData = await getUserPlants(userId);
        } else {
          userData = await getCurrentUser();
          if (userData) {
            plantData = await getUserPlants(userData.id);
          } else {
            plantData = [];
          }
        }
        
        setUser(userData);
        setUserPlants(plantData || []);
      } catch (error) {
        console.error("Ошибка при загрузке данных пользователя:", error);
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить данные профиля",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [userId, toast]);

  const handleAddPlant = async (plantData: Omit<Plant, 'id'>) => {
    try {
      if (!user) return null;
      
      const newPlant = await createPlant(plantData);
      
      setUserPlants([...userPlants, newPlant]);
      
      toast({
        title: "Растение добавлено",
        description: `${plantData.name} добавлено в вашу коллекцию`,
      });
      
      return newPlant;
    } catch (error) {
      console.error("Ошибка при добавлении растения:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить растение",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleDeletePlant = async (plantId: string) => {
    try {
      await deletePlant(plantId);
      const updatedPlants = userPlants.filter(plant => plant.id !== plantId);
      setUserPlants(updatedPlants);
      return true;
    } catch (error) {
      console.error("Ошибка при удалении растения:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить растение",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    user,
    userPlants,
    loading,
    isOwnProfile,
    handleAddPlant,
    handleDeletePlant
  };
}
