
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/AuthForm';
import Navbar from '@/components/Navbar';

const Auth = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const navigate = useNavigate();
  
  const handleSuccess = () => {
    navigate('/profile');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="page-container">
        <div className="max-w-md mx-auto pt-8 pb-16">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">
              {mode === 'signin' ? 'Вход в аккаунт' : 'Регистрация'}
            </h1>
            
            <AuthForm mode={mode} onSuccess={handleSuccess} />
            
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              {mode === 'signin' ? (
                <>
                  <p className="text-gray-600 mb-4">Еще нет аккаунта?</p>
                  <button 
                    className="text-green-700 hover:text-green-800 font-medium"
                    onClick={() => setMode('signup')}
                  >
                    Зарегистрироваться
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-4">Уже есть аккаунт?</p>
                  <button 
                    className="text-green-700 hover:text-green-800 font-medium"
                    onClick={() => setMode('signin')}
                  >
                    Войти
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
