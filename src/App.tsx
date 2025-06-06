
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Plants from './pages/Plants';
import PlantDetail from './pages/PlantDetail';
import Profile from './pages/Profile';
import Exchanges from './pages/Exchanges';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import { Toaster } from './components/ui/toaster';
import { ChatBot } from './components/chat/ChatBot';
import './App.css';
import { useEffect, useState } from 'react';
import { supabase } from './integrations/supabase/client';

function App() {
  // Проверка аутентификации при загрузке приложения
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/plants" element={<Plants />} />
        <Route path="/plants/:id" element={<PlantDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/exchanges" element={<Exchanges />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ChatBot />
      <Toaster />
    </Router>
  );
}

export default App;
