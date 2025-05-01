
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        setSession(data.session);
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };
    
    getSession();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignUp = async () => {
    try {
      const email = prompt('Введите email для регистрации:');
      const password = prompt('Введите пароль (минимум 6 символов):');
      
      if (!email || !password) return;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Регистрация прошла успешно",
        description: "Проверьте вашу почту для подтверждения аккаунта",
      });
    } catch (error) {
      console.error("Error signing up:", error);
      toast({
        title: "Ошибка при регистрации",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSignIn = async () => {
    try {
      const email = prompt('Введите email:');
      const password = prompt('Введите пароль:');
      
      if (!email || !password) return;
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Вход выполнен успешно",
      });
    } catch (error) {
      console.error("Error signing in:", error);
      toast({
        title: "Ошибка входа",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Выход выполнен успешно",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Ошибка при выходе",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="page-container">
        <div className="max-w-3xl mx-auto pt-8 pb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-6 text-center">
            Добро пожаловать в PlantSwap
          </h1>
          
          <p className="text-lg text-gray-700 mb-8 text-center">
            Обменивайтесь растениями с другими цветоводами в вашем городе
          </p>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold text-green-800 mb-4">
              Инструкция по использованию приложения
            </h2>
            
            <div className="space-y-4 mb-6">
              <p>
                Для полноценной работы с приложением необходимо:
              </p>
              
              <ol className="list-decimal list-inside space-y-2">
                <li>Зарегистрироваться в системе через Supabase Auth</li>
                <li>Наполнить базу данных информацией о пользователях, растениях и обменах</li>
                <li>Создать профиль пользователя с указанием информации и добавлением растений</li>
              </ol>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-medium mb-3">Управление аккаунтом</h3>
              
              {loading ? (
                <div>Загрузка...</div>
              ) : session ? (
                <div className="space-y-4">
                  <p>
                    Вы вошли в систему как: <strong>{session.user.email}</strong>
                  </p>
                  <Button onClick={handleSignOut} variant="outline">
                    Выйти из аккаунта
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4">
                  <Button onClick={handleSignUp}>
                    Зарегистрироваться
                  </Button>
                  <Button onClick={handleSignIn} variant="outline">
                    Войти в аккаунт
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Link to="/plants" className="block group">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full transition-all group-hover:shadow-md group-hover:border-green-200">
                <h2 className="text-xl font-bold text-green-800 mb-2">
                  Каталог растений
                </h2>
                <p className="text-gray-600">
                  Просматривайте растения, доступные для обмена
                </p>
              </div>
            </Link>
            
            <Link to={session ? "/profile" : "#"} onClick={e => !session && handleSignIn()} className="block group">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full transition-all group-hover:shadow-md group-hover:border-green-200">
                <h2 className="text-xl font-bold text-green-800 mb-2">
                  Мой профиль
                </h2>
                <p className="text-gray-600">
                  {session ? "Управляйте своими растениями" : "Войдите в аккаунт, чтобы увидеть профиль"}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
