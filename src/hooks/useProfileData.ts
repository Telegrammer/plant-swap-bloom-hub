
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getUserById, getCurrentUser, User } from '@/api/users';
import { getUserPlants, createPlant, deletePlant, Plant } from '@/api/plants';
import { mockPlants, mockUsers } from "../server/mockData";

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
        
        // We now directly use imported mock data rather than dynamically importing it
        if (userId) {
          try {
            // Try to use the real API first
            userData = await getUserById(userId);
            plantData = await getUserPlants(userId);
          } catch (error) {
            console.log("Falling back to mock data", error);
            // Fallback to mock data
            userData = mockUsers.find(u => u.id === parseInt(userId));
            plantData = mockPlants.filter(plant => plant.owner === userData?.name);
          }
        } else {
          try {
            // Try to use the real API first
            userData = await getCurrentUser();
            if (userData) {
              plantData = await getUserPlants(userData.id);
            }
          } catch (error) {
            console.log("Falling back to mock data", error);
            // Fallback to mock data
            userData = mockUsers[0];
            plantData = mockPlants.filter(plant => plant.owner === userData.name);
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

  const handleAddPlant = async (plantData: Omit<Plant, 'id' | 'owner'>) => {
    try {
      if (!user) return;
      
      let newPlant: Plant;
      
      try {
        // Try to use the real API
        newPlant = await createPlant({
          ...plantData,
          owner: user.name
        });
      } catch (error) {
        console.log("Falling back to mock data for plant creation", error);
        // For demo we create a new object locally
        newPlant = {
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
      }

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
      try {
        // Try to use the real API
        await deletePlant(plantId);
      } catch (error) {
        console.log("Falling back to local state management for plant deletion", error);
      }
      
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
