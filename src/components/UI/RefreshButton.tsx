import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

interface RefreshButtonProps {
  onRefresh: () => void;
  isLoading: boolean;
  lastUpdateTime: number;
}

const RefreshButton = ({ onRefresh, isLoading }: RefreshButtonProps) => {
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown(prev => Math.max(0, prev - 1));
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [cooldown]);

  const handleClick = () => {
    if (cooldown === 0 && !isLoading) {
      onRefresh();
      setCooldown(3);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={cooldown > 0 || isLoading}
      className="absolute top-4 right-4 p-2 rounded-lg bg-[#1E1E1E]/80 border border-[#333333] 
      hover:border-[#2BAD72]/30 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
      title={cooldown > 0 ? `Подождите ${cooldown}с` : 'Обновить'}
    >
      <RefreshCw 
        className={`w-5 h-5 text-[#2BAD72] transition-all
          ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'}`}
      />
    </button>
  );
};

export default RefreshButton;