// src/components/UI/BottomNav.tsx
import { User, Settings, History, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BottomNavProps {
  currentRoute: string;
}

const BottomNav = ({ currentRoute }: BottomNavProps) => {
  const navItems = [
    {
      icon: User,
      label: 'Профиль',
      path: '/profile'
    },
    {
      icon: Search,
      label: 'Поиск',
      path: '/search'
    },
    {
      icon: History,
      label: 'История',
      path: '/history'
    },
    {
      icon: Settings,
      label: 'Настройки',
      path: '/settings'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1E1E1E]/95 backdrop-blur-lg border-t border-[#333333] z-50">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-4 relative group ${
                currentRoute === item.path 
                  ? 'text-[#2BAD72]' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {currentRoute === item.path && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-[#2BAD72] rounded-full" />
              )}
              <item.icon className={`w-5 h-5 transition-transform duration-200 ${
                currentRoute === item.path ? 'scale-110' : 'group-hover:scale-110'
              }`} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;