import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, RefreshCw, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import PlantCard from '@/components/PlantCard';
import ExchangeStatistics from '@/components/ExchangeStatistics';
import { mockPlants } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [featuredPlants, setFeaturedPlants] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    // В реальном приложении здесь будет API запрос за избранными растениями
    const featured = mockPlants.slice(0, 3);
    setFeaturedPlants(featured);
    
    // Приветственный тост при первом посещении
    const hasVisited = localStorage.getItem('hasVisitedBloomHub');
    if (!hasVisited) {
      setTimeout(() => {
        toast({
          title: "Добро пожаловать в BloomHub!",
          description: "Платформа для обмена растениями с единомышленниками.",
          duration: 5000,
        });
        localStorage.setItem('hasVisitedBloomHub', 'true');
      }, 1000);
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="page-container">
        <div className="hero-section">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Обменивайтесь<br className="md:hidden" /> растениями <br className="hidden md:block" />
            и находите <br className="md:hidden" />единомышленников
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl">
            BloomHub - сообщество любителей растений, где можно обмениваться черенками, отростками
            и взрослыми растениями с другими энтузиастами.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/plants" 
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Leaf className="h-5 w-5" />
              Посмотреть растения
            </Link>
            <Link 
              to="/profile" 
              className="bg-white hover:bg-gray-100 text-green-700 border border-green-600 px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              Создать профиль
            </Link>
          </div>
        </div>
        
        {/* Statistics Section */}
        <section className="mt-16">
          <h2 className="section-title">Статистика и популярные растения</h2>
          <ExchangeStatistics />
        </section>
        
        <section className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="section-title">Избранные растения</h2>
            <Link 
              to="/plants" 
              className="text-green-600 hover:text-green-800 flex items-center gap-1 transition-colors"
            >
              Все растения
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPlants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        </section>
        
        <section className="mt-16">
          <h2 className="section-title">Как это работает</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-gray-800">Создайте профиль</h3>
              <p className="text-gray-600">
                Зарегистрируйтесь и расскажите о своих растениях, которыми вы готовы поделиться.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-gray-800">Найдите растения</h3>
              <p className="text-gray-600">
                Просматривайте каталог растений и находите те, которые вам интересны.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <RefreshCw className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-gray-800">Обменивайтесь</h3>
              <p className="text-gray-600">
                Свяжитесь с владельцем, договоритесь об обмене и получите новое растение в свою коллекцию.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-20 py-8">
        <div className="page-container">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <Leaf className="h-5 w-5 text-green-600" />
                <span className="text-lg font-semibold text-green-700">BloomHub</span>
              </Link>
              <p className="text-gray-500 max-w-md">
                Платформа для обмена растениями с единомышленниками.
                Выращивайте сообщество вместе с растениями!
              </p>
            </div>
            
            <div className="mt-6 md:mt-0 space-y-2">
              <h4 className="font-medium text-gray-800 mb-3">Навигация</h4>
              <div className="flex flex-col space-y-2">
                <Link to="/" className="text-gray-600 hover:text-green-600 transition-colors">Главная</Link>
                <Link to="/plants" className="text-gray-600 hover:text-green-600 transition-colors">Растения</Link>
                <Link to="/exchanges" className="text-gray-600 hover:text-green-600 transition-colors">Обмены</Link>
                <Link to="/profile" className="text-gray-600 hover:text-green-600 transition-colors">Профиль</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} BloomHub. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
