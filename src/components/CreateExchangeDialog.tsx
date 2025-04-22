
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { mockUsers } from '@/data/mockData';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ExchangePlantSelector from './ExchangePlantSelector';

interface CreateExchangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateExchange: (receiverId: string, plantIds: string[]) => void;
}

export function CreateExchangeDialog({ isOpen, onClose, onCreateExchange }: CreateExchangeDialogProps) {
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [selectedPlants, setSelectedPlants] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  
  // Filter out the current user (assuming user ID 1 is current)
  const currentUserId = "1"; // Changed to string to match Supabase UUID
  const otherUsers = mockUsers.filter(user => user.id.toString() !== currentUserId)
    .map(user => ({ ...user, id: user.id.toString() })); // Ensure IDs are strings
  
  const handleNext = () => {
    if (receiverId) {
      setStep(2);
    }
  };
  
  const handleBack = () => {
    setStep(1);
  };
  
  const handleSubmit = () => {
    if (receiverId) {
      onCreateExchange(receiverId, selectedPlants);
      resetForm();
    }
  };
  
  const resetForm = () => {
    setReceiverId(null);
    setSelectedPlants([]);
    setStep(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Создать новый обмен</DialogTitle>
        </DialogHeader>
        
        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="receiver">Выберите пользователя для обмена</Label>
              <Select 
                value={receiverId || ''} 
                onValueChange={(value) => setReceiverId(value)}
              >
                <SelectTrigger id="receiver">
                  <SelectValue placeholder="Выберите пользователя" />
                </SelectTrigger>
                <SelectContent>
                  {otherUsers.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>Отмена</Button>
              <Button onClick={handleNext} disabled={!receiverId}>Далее</Button>
            </div>
          </div>
        ) : (
          <div>
            <ExchangePlantSelector 
              userId={currentUserId}
              selectedPlants={selectedPlants}
              onSelectionChange={setSelectedPlants}
              onClose={onClose}
            />
            
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={handleBack}>Назад</Button>
              <Button onClick={handleSubmit}>Создать обмен</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
