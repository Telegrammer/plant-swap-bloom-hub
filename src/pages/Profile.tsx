
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarIcon, MapPin, Mail, Plus, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import Navbar from '@/components/Navbar';
import PlantCard from '@/components/PlantCard';
import { mockUsers, mockPlants } from '@/data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AddPlantDialog } from '@/components/AddPlantDialog';
import { DeletePlantDialog } from '@/components/DeletePlantDialog';
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [userPlants, setUserPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteDialogState, setDeleteDialogState] = useState({ isOpen: false, plantId: null, plantName: '' });
  const { toast } = useToast();
  
  const isOwnProfile = !id; // Если нет id, значит это профиль текущего пользователя

  useEffect(() => {
    // Имитация загрузки данных
    setTimeout(() => {
      // Если есть id, ищем конкретного пользователя
      if (id) {
        const foundUser = mockUsers.find(u => u.id === parseInt(id));
        if (foundUser) {
          setUser(foundUser);
          
          // Находим растения пользователя
          const plants = mockPlants.filter(plant => 
            plant.owner === foundUser.name
          );
          setUserPlants(plants);
        }
      } else {
        // Если нет id, берем первого пользователя (в реальном приложении здесь будет текущий авторизованный юзер)
        setUser(mockUsers[0]);
        
        // Находим растения пользователя
        const plants = mockPlants.filter(plant => 
          plant.owner === mockUsers[0].name
        );
        setUserPlants(plants);
      }
      
      setLoading(false);
    }, 500);
  }, [id]);

  const handleAddPlant = (plantData) => {
    const newPlant = {
      id: Date.now(), // Генерируем временный ID
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
    setIsAddDialogOpen(false);
    
    toast({
      title: "Растение добавлено",
      description: `${plantData.name} добавлено в вашу коллекцию`,
    });
  };

  const handleOpenDeleteDialog = (plantId, plantName) => {
    setDeleteDialogState({
      isOpen: true,
      plantId,
      plantName
    });
  };

  const handleDeletePlant = () => {
    const updatedPlants = userPlants.filter(plant => plant.id !== deleteDialogState.plantId);
    setUserPlants(updatedPlants);
    
    toast({
      title: "Растение удалено",
      description: `${deleteDialogState.plantName} удалено из вашей коллекции`,
    });
    
    setDeleteDialogState({ isOpen: false, plantId: null, plantName: '' });
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.profileImageUrl} alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-1">
                {user.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600 mt-3">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>На сайте с {format(new Date(user.dateCreated), 'MMMM yyyy', { locale: ru })}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium text-lg mb-2">О себе</h3>
            <p className="text-gray-700">{user.bio}</p>
          </div>
        </div>
        
        <div className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Растения пользователя</h2>
            
            {isOwnProfile && (
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Добавить растение</span>
              </Button>
            )}
          </div>
          
          {userPlants.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {userPlants.map((plant) => (
                <div key={plant.id} className="relative">
                  <PlantCard plant={plant} />
                  
                  {isOwnProfile && (
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="bg-white opacity-80 hover:opacity-100"
                        onClick={() => handleOpenDeleteDialog(plant.id, plant.name)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
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
        </div>
        
        {isOwnProfile && (
          <div className="fixed bottom-6 right-6">
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
              title="Добавить новое растение"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        )}
      </main>

      <AddPlantDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddPlant={handleAddPlant}
      />
      
      <DeletePlantDialog
        isOpen={deleteDialogState.isOpen}
        onClose={() => setDeleteDialogState({ isOpen: false, plantId: null, plantName: '' })}
        onConfirm={handleDeletePlant}
        plantName={deleteDialogState.plantName}
      />
    </div>
  );
};

export default Profile;
