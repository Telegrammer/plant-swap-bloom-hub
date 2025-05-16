
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
  onUpdateExchange: (exchangeId: string, plantIds: string[]) => void;
}

export function UpdateExchangeDialog({ 
  isOpen, 
  onClose, 
  exchange, 
  isUserSender, 
  onUpdateExchange 
}: UpdateExchangeDialogProps) {
  const [selectedPlants, setSelectedPlants] = useState<string[]>([]);
  const currentUserId = 'aaf63eee-2854-43c6-9a4b-cc0cd9aed4da'; // В реальном приложении из контекста аутентификации
  
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
          userId={currentUserId}
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
