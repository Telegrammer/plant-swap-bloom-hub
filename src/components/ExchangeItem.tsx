
import { useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Exchange, ExchangeStatus } from '@/types/exchange';
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, Calendar, Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ExchangeItemProps {
  exchange: Exchange;
  isUserSender: boolean;
  onUpdateStatus?: (exchangeId: string, status: ExchangeStatus) => void;
}

const statusConfig = {
  pending: { label: 'В ожидании', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
  completed: { label: 'Завершён', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
  canceled: { label: 'Отменён', color: 'bg-red-100 text-red-800 hover:bg-red-200' },
};

const ExchangeItem = ({ exchange, isUserSender, onUpdateStatus }: ExchangeItemProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };
  
  const otherUserName = isUserSender ? exchange.receiverName : exchange.senderName;
  const statusClass = statusConfig[exchange.status].color;
  
  const handleCompleteExchange = () => {
    onUpdateStatus && onUpdateStatus(exchange.id, 'completed');
  };
  
  const handleCancelExchange = () => {
    onUpdateStatus && onUpdateStatus(exchange.id, 'canceled');
  };

  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`https://ui-avatars.com/api/?name=${otherUserName.replace(' ', '+')}`} />
              <AvatarFallback>{otherUserName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{isUserSender ? `Обмен с ${exchange.receiverName}` : `Запрос от ${exchange.senderName}`}</CardTitle>
              <CardDescription className="flex items-center gap-1 text-xs mt-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(exchange.startDate), 'd MMMM yyyy', { locale: ru })}
              </CardDescription>
            </div>
          </div>
          <Badge className={statusClass}>
            {statusConfig[exchange.status].label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <div className="flex-1 border rounded p-3">
            <div className="text-sm font-medium mb-2 flex items-center gap-1">
              <ArrowRightLeft className="h-4 w-4 text-green-600" />
              Растения в обмене
            </div>
            <div>
              <div className="mb-2">
                <div className="text-xs text-gray-500">Вы предлагаете:</div>
                <ul className="list-disc list-inside pl-1 text-sm">
                  {(isUserSender ? exchange.senderPlants : exchange.receiverPlants).map(plant => (
                    <li key={plant.id}>{plant.name}</li>
                  ))}
                  {(isUserSender ? exchange.senderPlants.length : exchange.receiverPlants.length) === 0 && 
                    <p className="text-sm text-gray-500 italic">Нет растений</p>
                  }
                </ul>
              </div>
              <div>
                <div className="text-xs text-gray-500">{isUserSender ? exchange.receiverName : exchange.senderName} предлагает:</div>
                <ul className="list-disc list-inside pl-1 text-sm">
                  {(isUserSender ? exchange.receiverPlants : exchange.senderPlants).map(plant => (
                    <li key={plant.id}>{plant.name}</li>
                  ))}
                  {(isUserSender ? exchange.receiverPlants.length : exchange.senderPlants.length) === 0 && 
                    <p className="text-sm text-gray-500 italic">Нет растений</p>
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      {exchange.status === 'pending' && (
        <CardFooter className="flex gap-2 justify-end border-t pt-3 pb-3">
          <Button 
            size="sm" 
            variant="outline" 
            className="gap-1"
            onClick={handleCancelExchange}
          >
            <X className="h-4 w-4" />
            Отменить
          </Button>
          <Button 
            size="sm" 
            className="gap-1"
            onClick={handleCompleteExchange}
          >
            <Check className="h-4 w-4" />
            Завершить обмен
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ExchangeItem;
