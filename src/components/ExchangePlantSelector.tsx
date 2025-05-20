
import { useState, useEffect } from 'react';
import { getUserPlants } from '@/api/plants';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Plant } from '@/api/plants';
import { useToast } from "@/hooks/use-toast";

interface ExchangePlantSelectorProps {
  userId: string;
  selectedPlants: string[];
  onSelectionChange: (plantIds: string[]) => void;
  onClose: () => void;
}

const ExchangePlantSelector = ({ userId, selectedPlants, onSelectionChange, onClose }: ExchangePlantSelectorProps) => {
  const [userPlants, setUserPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selection, setSelection] = useState<string[]>(selectedPlants);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchUserPlants = async () => {
      try {
        console.log('Fetching plants for user:', userId);
        const plants = await getUserPlants(userId);
        console.log('Fetched plants:', plants);
        setUserPlants(plants || []);
      } catch (error) {
        console.error('Failed to fetch user plants', error);
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить растения пользователя",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchUserPlants();
    } else {
      setLoading(false);
    }
  }, [userId, toast]);
  
  const toggleSelection = (plantId: string) => {
    if (selection.includes(plantId)) {
      setSelection(selection.filter(id => id !== plantId));
    } else {
      setSelection([...selection, plantId]);
    }
  };
  
  useEffect(() => {
    onSelectionChange(selection);
  }, [selection, onSelectionChange]);

  if (loading) {
    return (
      <div className="text-center p-4">Загрузка растений...</div>
    );
  }

  return (
    <div className="p-2">
      <h3 className="text-lg font-medium mb-4">Выбор растений для обмена</h3>
      
      {userPlants.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Растение</TableHead>
              <TableHead>Размер</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userPlants.map(plant => (
              <TableRow key={plant.id} className="cursor-pointer" onClick={() => toggleSelection(plant.id)}>
                <TableCell className="p-2">
                  <Checkbox 
                    checked={selection.includes(plant.id)}
                    onCheckedChange={() => toggleSelection(plant.id)}
                  />
                </TableCell>
                <TableCell className="p-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={plant.imageUrl} alt={plant.name} />
                      <AvatarFallback>{plant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{plant.name}</span>
                  </div>
                </TableCell>
                <TableCell className="p-2">{plant.size}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center p-4 bg-gray-50 rounded-md">
          <p className="text-gray-600">У вас пока нет растений для обмена. Добавьте растения в свою коллекцию.</p>
        </div>
      )}

      <div className="flex justify-end mt-4">
        <Button onClick={onClose} variant="outline" className="mr-2">Отмена</Button>
        <Button onClick={onClose}>Подтвердить выбор</Button>
      </div>
    </div>
  );
};

export default ExchangePlantSelector;
