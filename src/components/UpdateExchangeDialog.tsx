
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Exchange } from '@/types/exchange';
import ExchangePlantSelector from './ExchangePlantSelector';

interface UpdateExchangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  exchange: Exchange | null;
  isUserSender: boolean;
  onUpdateExchange: (exchangeId: number, plantIds: number[]) => void;
}

export function UpdateExchangeDialog({ 
  isOpen, 
  onClose, 
  exchange, 
  isUserSender, 
  onUpdateExchange 
}: UpdateExchangeDialogProps) {
  const [selectedPlants, setSelectedPlants] = useState<number[]>([]);
  
  useEffect(() => {
    if (exchange) {
      // Get current user's plants in this exchange
      const userPlants = isUserSender ? exchange.senderPlants : exchange.receiverPlants;
      setSelectedPlants(userPlants.map(p => p.id));
    }
  }, [exchange, isUserSender]);
  
  const handleSave = () => {
    if (exchange) {
      onUpdateExchange(exchange.id, selectedPlants);
      onClose();
    }
  };
  
  const otherUserName = exchange 
    ? (isUserSender ? exchange.receiverName : exchange.senderName)
    : '';

  if (!exchange) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактировать растения для обмена с {otherUserName}</DialogTitle>
        </DialogHeader>
        
        <ExchangePlantSelector 
          userId={1} // Current user ID - in real app would be dynamic
          selectedPlants={selectedPlants}
          onSelectionChange={setSelectedPlants}
          onClose={onClose}
        />
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Отмена</Button>
          <Button onClick={handleSave}>Сохранить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
