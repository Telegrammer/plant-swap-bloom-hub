
import { Link } from 'react-router-dom';
import { Search, User, Home, Leaf, RefreshCw } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 py-4 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="text-xl font-semibold text-green-700">BloomHub</span>
        </Link>
        
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="flex items-center gap-1 text-gray-700 hover:text-green-600 transition-colors">
            <Home className="h-4 w-4" />
            <span>Главная</span>
          </Link>
          <Link to="/plants" className="flex items-center gap-1 text-gray-700 hover:text-green-600 transition-colors">
            <Leaf className="h-4 w-4" />
            <span>Растения</span>
          </Link>
          <Link to="/exchanges" className="flex items-center gap-1 text-gray-700 hover:text-green-600 transition-colors">
            <RefreshCw className="h-4 w-4" />
            <span>Обмены</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <input
              type="search"
              placeholder="Поиск растений..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          
          <Link to="/profile" className="flex items-center gap-1 text-gray-700 hover:text-green-600 transition-colors">
            <User className="h-5 w-5" />
            <span className="hidden md:inline">Профиль</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
