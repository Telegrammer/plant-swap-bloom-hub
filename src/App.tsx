
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { toast } from "sonner";
import Index from "./pages/Index";
import Plants from "./pages/Plants";
import PlantDetail from "./pages/PlantDetail";
import Profile from "./pages/Profile";
import Exchanges from "./pages/Exchanges";
import NotFound from "./pages/NotFound";

// Создаем клиент React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Проверка доступности API
const API_URL = 'http://localhost:3001/api';

const App = () => {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    // Проверяем доступность API при загрузке приложения
    const checkAPIStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/users`, { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' } 
        });
        
        if (response.ok) {
          setApiStatus('online');
          toast.success('API сервер доступен');
        } else {
          setApiStatus('offline');
          toast.error('API сервер отвечает с ошибкой');
        }
      } catch (error) {
        setApiStatus('offline');
        toast.error('API сервер недоступен. Убедитесь, что вы запустили server/server.js');
      }
    };
    
    checkAPIStatus();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        {apiStatus === 'offline' && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 fixed bottom-4 right-4 z-50 w-80 shadow-lg rounded">
            <div className="flex items-center">
              <div className="py-1">
                <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-bold">API сервер недоступен</p>
                <p className="text-sm">Запустите сервер из директории server с помощью команды: npm run dev</p>
              </div>
            </div>
          </div>
        )}
        
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/plants" element={<Plants />} />
            <Route path="/plants/:id" element={<PlantDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/exchanges" element={<Exchanges />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
