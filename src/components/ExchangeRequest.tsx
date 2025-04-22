
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeftRight, Send } from 'lucide-react';

interface ExchangeRequestProps {
  plantId: string;
  plantName: string;
  ownerId: string;
  ownerName: string;
}

const ExchangeRequest = ({ plantId, plantName, ownerId, ownerName }: ExchangeRequestProps) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Пожалуйста, напишите сообщение владельцу');
      return;
    }
    
    setLoading(true);
    
    // В реальном приложении здесь будет API запрос
    setTimeout(() => {
      toast.success(`Запрос на обмен растения "${plantName}" успешно отправлен!`);
      setMessage('');
      setLoading(false);
    }, 1000);
  };
  
  return (
    <div className="bg-green-50 rounded-lg p-6 shadow-sm border border-green-100">
      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
        <ArrowLeftRight className="h-5 w-5 text-green-600" />
        Запросить обмен
      </h3>
      
      <p className="text-gray-600 mb-4">
        Отправьте сообщение пользователю <strong>{ownerName}</strong> с предложением об обмене растения <strong>{plantName}</strong>.
      </p>
      
      <form onSubmit={handleSubmit}>
        <Textarea
          placeholder="Напишите сообщение с предложением... Например, какие растения вы готовы предложить в обмен."
          className="min-h-[120px] mb-4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <>Отправка...</>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Отправить запрос
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ExchangeRequest;
