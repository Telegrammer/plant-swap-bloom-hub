
import { useState, useEffect } from 'react';
import { getExchanges } from '@/api/exchanges';
import { Plus, History, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ExchangeItem from '@/components/ExchangeItem';
import { CreateExchangeDialog } from '@/components/CreateExchangeDialog';
import { UpdateExchangeDialog } from '@/components/UpdateExchangeDialog';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Exchange, ExchangeStatus } from '@/types/exchange';
import { toast } from 'sonner';

const Exchanges = () => {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [updateDialogState, setUpdateDialogState] = useState<{
    isOpen: boolean;
    exchange: Exchange | null;
    isUserSender: boolean;
  }>({
    isOpen: false,
    exchange: null,
    isUserSender: false,
  });
  const [loading, setLoading] = useState(true);
  
  // Current user ID - in real app would come from auth context
  const currentUserId = '1';
  
  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const fetchedExchanges = await getExchanges();
        setExchanges(fetchedExchanges);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch exchanges', error);
        toast.error('Не удалось загрузить обмены');
        setLoading(false);
      }
    };
    
    fetchExchanges();
  }, []);
  
  // Filter exchanges where the current user is involved
  const userExchanges = exchanges.filter(
    exchange => exchange.senderId === currentUserId || exchange.receiverId === currentUserId
  );
  
  // Active (pending) exchanges
  const activeExchanges = userExchanges.filter(exchange => exchange.status === 'pending');
  
  // History (completed or canceled) exchanges
  const historyExchanges = userExchanges.filter(
    exchange => exchange.status === 'completed' || exchange.status === 'canceled'
  );
  
  const handleCreateExchange = async (receiverId: string, plantIds: string[]) => {
    try {
      // In a real app, this would use createExchange from API
      toast.success('Запрос на обмен успешно создан');
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Failed to create exchange', error);
      toast.error('Не удалось создать обмен');
    }
  };
  
  const handleUpdateExchange = async (exchangeId: string, plantIds: string[]) => {
    try {
      // In a real app, this would use updateExchange from API
      toast.success('Растения для обмена обновлены');
    } catch (error) {
      console.error('Failed to update exchange', error);
      toast.error('Не удалось обновить обмен');
    }
  };
  
  const handleUpdateStatus = async (exchangeId: string, status: ExchangeStatus) => {
    try {
      // In a real app, this would use updateExchangeStatus from API
      toast.success(
        status === 'completed' 
          ? 'Обмен успешно завершен' 
          : 'Обмен отменен'
      );
    } catch (error) {
      console.error('Failed to update exchange status', error);
      toast.error('Не удалось обновить статус обмена');
    }
  };
  
  const openUpdateDialog = (exchange: Exchange) => {
    const isUserSender = exchange.senderId === currentUserId;
    
    setUpdateDialogState({
      isOpen: true,
      exchange,
      isUserSender
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Загрузка обменов...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="page-container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-800">Обмены растениями</h1>
          
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Создать обмен</span>
          </Button>
        </div>
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="active" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Активные обмены</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1">
              <History className="h-4 w-4" />
              <span>История обменов</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {activeExchanges.length > 0 ? (
              <div className="space-y-4">
                {activeExchanges.map(exchange => (
                  <ExchangeItem 
                    key={exchange.id}
                    exchange={exchange}
                    isUserSender={exchange.senderId === currentUserId}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  У вас пока нет активных обменов
                </h3>
                <p className="text-gray-600 mb-6">
                  Создайте новый запрос на обмен растениями или дождитесь, пока кто-то предложит вам обмен.
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  Создать новый обмен
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history">
            {historyExchanges.length > 0 ? (
              <div className="space-y-4">
                {historyExchanges.map(exchange => (
                  <ExchangeItem 
                    key={exchange.id}
                    exchange={exchange}
                    isUserSender={exchange.senderId === currentUserId}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  История обменов пуста
                </h3>
                <p className="text-gray-600">
                  Завершенные и отмененные обмены будут отображаться здесь.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <CreateExchangeDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreateExchange={handleCreateExchange}
      />
      
      <UpdateExchangeDialog
        isOpen={updateDialogState.isOpen}
        onClose={() => setUpdateDialogState({ isOpen: false, exchange: null, isUserSender: false })}
        exchange={updateDialogState.exchange}
        isUserSender={updateDialogState.isUserSender}
        onUpdateExchange={handleUpdateExchange}
      />
    </div>
  );
};

export default Exchanges;
