// src/components/Profile.tsx
import { useState } from 'react';
import { 
  MessageSquare, 
  Heart, 
  User, 
  Trophy, 
  Gift, 
  ThumbsUp, 
  Users, 
  UserPlus,
  Wallet,
  Calendar,
  Send,
  RefreshCw
} from 'lucide-react';
import TransferModal from './UI/TransferModal';

interface ProfileProps {
  data: {
    username: string;
    username_html?: string;
    user_id: number;
    user_message_count: number;
    user_like_count: number;
    user_like2_count: number;
    contest_count: number;
    trophy_count: number;
    user_following_count: number;
    user_followers_count: number;
    balance?: string | number;
    joined_date: number;
    links: {
      avatar: string;
    };
  };
  token: string;
  onRefresh: () => void;
  isLoading: boolean;
  lastUpdateTime: number;
}

const UsernameRenderer = ({ username, usernameHtml }: { username: string; usernameHtml?: string }) => {
  if (usernameHtml) {
    return <span dangerouslySetInnerHTML={{ __html: usernameHtml }} />;
  }
  return <>{username}</>;
};

const Profile = ({ data, token, onRefresh, isLoading }: ProfileProps) => {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const joinDate = new Date(data.joined_date * 1000).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const stats = [
    {
      icon: MessageSquare,
      value: data.user_message_count,
      label: "Сообщений"
    },
    {
      icon: Heart,
      value: data.user_like_count,
      label: "Симпатий"
    },
    {
      icon: ThumbsUp,
      value: data.user_like2_count,
      label: "Лайков"
    },
    {
      icon: Gift,
      value: data.contest_count,
      label: "Розыгрышей"
    },
    {
      icon: Trophy,
      value: data.trophy_count,
      label: "Трофеев"
    },
    {
      icon: UserPlus,
      value: data.user_following_count,
      label: "Подписок"
    },
    {
      icon: Users,
      value: data.user_followers_count,
      label: "Подписчиков"
    }
  ];

  return (
    <div className="min-h-screen bg-[#161616] bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="max-w-2xl mx-auto pb-24 p-4">
        {/* Профиль */}
        <div className="bg-[#1E1E1E]/80 backdrop-blur-sm rounded-2xl p-4 mb-4 
          border border-[#333333] hover:shadow-[#2BAD72]/5 hover:shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-[#2BAD72]/20 
                shadow-lg shadow-[#2BAD72]/10">
                <img
                  src={data.links.avatar}
                  alt={data.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#2BAD72] p-1.5 rounded-lg 
                shadow-lg shadow-[#2BAD72]/20">
                <User size={14} className="text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl font-bold text-white truncate">
                  <UsernameRenderer
                    username={data.username}
                    usernameHtml={data.username_html}
                  />
                </h2>
                <button
                  onClick={onRefresh}
                  disabled={isLoading}
                  className="p-2 rounded-lg bg-[#1E1E1E] border border-[#333333] 
                    hover:border-[#2BAD72]/30 transition-all group 
                    disabled:opacity-50 disabled:cursor-not-allowed ml-2"
                  title="Обновить"
                >
                  <RefreshCw 
                    className={`w-4 h-4 text-[#2BAD72] transition-all
                      ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'}`}
                  />
                </button>
              </div>
              <p className="text-[#2BAD72] text-sm font-medium">ID: {data.user_id}</p>
              <div className="flex items-center gap-2 mt-1 text-gray-400">
                <Calendar size={14} />
                <span className="text-sm truncate">{joinDate}</span>
              </div>
              {data.balance !== undefined && (
                <div className="flex items-center gap-2 mt-1">
                  <Wallet size={14} className="text-[#2BAD72]" />
                  <span className="text-white font-medium">
                    {data.balance} ₽
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Кнопка перевода */}
        {data.balance !== undefined && (
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="w-full mb-4 bg-[#1E1E1E]/80 backdrop-blur-sm p-3 rounded-2xl border border-[#333333] 
              hover:border-[#2BAD72]/30 transition-all hover:shadow-lg group 
              flex items-center justify-center gap-2"
          >
            <Send className="text-[#2BAD72] w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-white">Отправить средства</span>
          </button>
        )}

        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-max gap-3">
          {stats.map((stat, index) => (
            <div key={index} 
              className="bg-[#1E1E1E]/80 backdrop-blur-sm p-4 rounded-2xl border border-[#333333] 
                hover:border-[#2BAD72]/30 transition-all hover:shadow-lg group"
            >
              <div className="flex items-center justify-between mb-1">
                <stat.icon className="text-[#2BAD72] w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-lg font-bold text-white group-hover:text-[#2BAD72] transition-colors">
                  {stat.value}
                </span>
              </div>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        token={token}
      />
    </div>
  );
};

export default Profile;