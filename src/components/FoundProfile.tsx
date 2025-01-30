import { 
  MessageSquare, 
  Heart, 
  User, 
  Trophy, 
  Gift, 
  ThumbsUp, 
  Users, 
  UserPlus,
  Calendar,
  Send
} from 'lucide-react';
import { useState } from 'react';
import TransferModal from './UI/TransferModal';

interface FoundProfileProps {
  user: {
    username: string;
    user_message_count: number;
    username_html?: string;
    user_like_count: number;
    user_like2_count: number;
    user_title: string;
    trophy_count: number;
    contest_count: number;
    user_following_count: number;
    user_followers_count: number;
    user_register_date: number;
    links: {
      avatar: string;
    };
  };
  token: string;
}

const FoundProfile = ({ user, token }: FoundProfileProps) => {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const joinDate = new Date(user.user_register_date * 1000).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const stats = [
    {
      icon: MessageSquare,
      value: user.user_message_count,
      label: "Сообщений"
    },
    {
      icon: Heart,
      value: user.user_like_count,
      label: "Симпатий"
    },
    {
      icon: ThumbsUp,
      value: user.user_like2_count,
      label: "Лайков"
    },
    {
      icon: Gift,
      value: user.contest_count,
      label: "Розыгрышей"
    },
    {
      icon: Trophy,
      value: user.trophy_count,
      label: "Трофеев"
    },
    {
      icon: UserPlus,
      value: user.user_following_count,
      label: "Подписок"
    },
    {
      icon: Users,
      value: user.user_followers_count,
      label: "Подписчиков"
    }
  ];

  return (
    <>
      <div className="bg-[#1E1E1E]/80 backdrop-blur-sm rounded-2xl p-4 mb-4 
        border border-[#333333] hover:shadow-[#2BAD72]/5 hover:shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-[#2BAD72]/20 
              shadow-lg shadow-[#2BAD72]/10">
              <img
                src={user.links.avatar}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-[#2BAD72] p-1.5 rounded-lg 
              shadow-lg shadow-[#2BAD72]/20">
              <User size={14} className="text-white" />
            </div>
          </div>
            <div className="flex-1 min-w-0">
            <h2
                className="text-xl font-bold text-white truncate"
                dangerouslySetInnerHTML={{ __html: user.username_html || user.username }}
            />
            <div 
              className="text-sm text-gray-400 truncate mt-1"
              dangerouslySetInnerHTML={{ 
                __html: user.user_title.replace(/:(\w+):/g, (match, emoji) => {
                  const smilieSpan = user.user_title.match(new RegExp(`<span[^>]*data-image-url="([^"]*)"[^>]*>${match}</span>`));
                  return smilieSpan ? `<img src="${smilieSpan[1]}" alt="${emoji}" class="inline-block h-4 w-4" />` : match;
                })
              }} 
            />
            <div className="flex items-center gap-2 mt-1 text-gray-400">
              <Calendar size={14} />
              <span className="text-sm truncate">{joinDate}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsTransferModalOpen(true)}
        className="w-full mb-4 bg-[#1E1E1E]/80 backdrop-blur-sm p-3 rounded-2xl border border-[#333333] 
          hover:border-[#2BAD72]/30 transition-all hover:shadow-lg group 
          flex items-center justify-center gap-2"
      >
        <Send className="text-[#2BAD72] w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="text-white">Перевести {user.username}</span>
      </button>

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

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        token={token}
        defaultUsername={user.username}
      />
    </>
  );
};

export default FoundProfile;