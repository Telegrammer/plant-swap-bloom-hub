
import { useState, useEffect } from 'react';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Leaf, TrendingUp, Sprout } from "lucide-react";
import { getExchanges } from '@/api/exchanges';
import { Exchange, ExchangePlant } from '@/types/exchange';
import { useToast } from "@/hooks/use-toast";

interface PlantPopularity {
  name: string;
  count: number;
  imageUrl: string;
}

const ExchangeStatistics = () => {
  const [popularPlants, setPopularPlants] = useState<PlantPopularity[]>([]);
  const [chartData, setChartData] = useState<Array<{ name: string, completed: number, pending: number, canceled: number }>>([]);
  const [totalStats, setTotalStats] = useState({
    completed: 0,
    pending: 0,
    canceled: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    async function fetchExchangeData() {
      try {
        setLoading(true);
        // В реальном API запросе используем getExchanges()
        // Сейчас для демонстрации используем импортированные данные из mockExchanges
        // const exchanges = await getExchanges();
        
        // Временное решение - импортируем данные напрямую
        // Этот код будет заменен на реальный API-вызов
        const { mockExchanges } = await import('@/data/mockExchanges');
        const exchanges = mockExchanges;
        
        processExchangeData(exchanges);
      } catch (error) {
        console.error("Ошибка при загрузке данных обменов:", error);
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить статистику обменов",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchExchangeData();
  }, [toast]);

  const processExchangeData = (exchanges: Exchange[]) => {
    // Подсчет растений по популярности
    const plantCountMap = new Map<string, { name: string, count: number, imageUrl: string }>();
    const monthStats: Record<string, { completed: number, pending: number, canceled: number }> = {};
    
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = month.toLocaleString('ru', { month: 'short' });
      monthStats[monthName] = { completed: 0, pending: 0, canceled: 0 };
    }
    
    const stats = { completed: 0, pending: 0, canceled: 0 };
    
    exchanges.forEach(exchange => {
      stats[exchange.status]++;
      
      const exchangeDate = new Date(exchange.startDate);
      const monthName = exchangeDate.toLocaleString('ru', { month: 'short' });
      if (monthStats[monthName]) {
        monthStats[monthName][exchange.status]++;
      }
      
      // Подсчет растений, независимо от направления
      const processPlant = (plant: ExchangePlant) => {
        if (!plantCountMap.has(plant.name)) {
          plantCountMap.set(plant.name, {
            name: plant.name,
            count: 0,
            imageUrl: plant.imageUrl
          });
        }
        plantCountMap.get(plant.name)!.count++;
      };
      
      exchange.senderPlants.forEach(processPlant);
      exchange.receiverPlants.forEach(processPlant);
    });
    
    const chartDataArray = Object.entries(monthStats).map(([name, data]) => ({
      name,
      completed: data.completed,
      pending: data.pending,
      canceled: data.canceled
    }));
    
    // Преобразуем в массив и сортируем по количеству
    const sortedPlants = Array.from(plantCountMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    setPopularPlants(sortedPlants);
    setChartData(chartDataArray);
    setTotalStats(stats);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Статистика обменов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Завершено</div>
                <div className="text-2xl font-bold text-green-700">{totalStats.completed}</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">В процессе</div>
                <div className="text-2xl font-bold text-yellow-600">{totalStats.pending}</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Отменено</div>
                <div className="text-2xl font-bold text-red-600">{totalStats.canceled}</div>
              </div>
            </div>
            
            <div className="h-[200px]">
              <div>
                <ChartContainer 
                  className="h-[200px]" 
                  config={{
                    completed: {
                      theme: { light: '#22c55e', dark: '#22c55e' },
                      label: 'Завершено'
                    },
                    pending: {
                      theme: { light: '#eab308', dark: '#eab308' },
                      label: 'В процессе'
                    },
                    canceled: {
                      theme: { light: '#ef4444', dark: '#ef4444' },
                      label: 'Отменено'
                    }
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} />
                      <Bar dataKey="completed" fill="var(--color-completed)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="pending" fill="var(--color-pending)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="canceled" fill="var(--color-canceled)" radius={[4, 4, 0, 0]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sprout className="h-5 w-5 text-green-600" />
            Популярные растения для обмена
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Растение</TableHead>
                <TableHead className="text-right">Количество</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {popularPlants.map((plant, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={plant.imageUrl} alt={plant.name} className="w-full h-full object-cover" />
                      </div>
                      <span>{plant.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{plant.count}</TableCell>
                </TableRow>
              ))}
              {popularPlants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-4 text-gray-500">
                    Нет данных о популярных растениях
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExchangeStatistics;
