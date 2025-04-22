
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getUserById, getCurrentUser, User } from '@/api/users';
import { getUserPlants, createPlant, deletePlant, Plant } from '@/api/plants';

export function useProfileData(userId?: string) {
  const [user, setUser] = useState<User | null>(null);
  const [userPlants, setUserPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const isOwnProfile = !userId; // If no userId is provided, it's the current user's profile

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        let userData;
        let plantData;
        
        // In a real application we would use the API
        // Currently we use imported mock data for demonstration
        const { mockUsers, mockPlants } = await import('@/data/mockData');
        
        if (userId) {
          // Real API: userData = await getUserById(userId);
          userData = mockUsers.find(u => u.id === parseInt(userId));
          // Real API: plantData = await getUserPlants(userId);
          plantData = mockPlants.filter(plant => plant.owner === userData?.name);
        } else {
          // Real API: userData = await getCurrentUser();
          userData = mockUsers[0];
          // Real API: plantData = await getUserPlants(userData.id);
          plantData = mockPlants.filter(plant => plant.owner === userData.name);
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

  const handleAddPlant = async (plantData: Omit<Plant, 'id' | 'owner'>) => {
    try {
      if (!user) return;
      
      // In a real application we would call the API
      // const newPlant = await createPlant({
      //   ...plantData,
      //   owner: user.name
      // });
      
      // For demo we create a new object locally
      const newPlant: Plant = {
        id: `temp-${Date.now()}`, // Using string ID to match Supabase UUID
        name: plantData.name,
        description: plantData.description,
        imageUrl: plantData.imageUrl,
        waterDemand: plantData.waterDemand,
        sunDemand: plantData.sunDemand,
        size: plantData.size,
        isIndoor: plantData.isIndoor,
        types: plantData.types,
        owner: user.name,
      };

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
      // In a real application we would call the API
      // await deletePlant(plantId);
      
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
