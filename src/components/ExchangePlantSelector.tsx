
import { useState } from 'react';
import { mockPlants } from '@/data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, X } from 'lucide-react';

interface ExchangePlantSelectorProps {
  userId: number;
  selectedPlants: number[];
  onSelectionChange: (plantIds: number[]) => void;
  onClose: () => void;
}

const ExchangePlantSelector = ({ userId, selectedPlants, onSelectionChange, onClose }: ExchangePlantSelectorProps) => {
  // Get user plants - in real app would filter by user ID
  const userPlants = mockPlants.filter(plant => plant.owner === "Анна Петрова");
  
  const [selection, setSelection] = useState<number[]>(selectedPlants);
  
  const toggleSelection = (plantId: number) => {
    if (selection.includes(plantId)) {
      setSelection(selection.filter(id => id !== plantId));
    } else {
      setSelection([...selection, plantId]);
    }
  };
  
  const handleSave = () => {
    onSelectionChange(selection);
    onClose();
  };

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
          <p className="text-gray-600">У вас пока нет растений для обмена.</p>
        </div>
      )}
      
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onClose}>Отмена</Button>
        <Button onClick={handleSave}>Сохранить</Button>
      </div>
    </div>
  );
};

export default ExchangePlantSelector;
