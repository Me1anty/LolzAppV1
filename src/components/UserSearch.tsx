import { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchUser } from '../services/api';
import FoundProfile from './FoundProfile';

interface User {
  username: string;
  username_html?: string;
  user_message_count: number;
  user_like_count: number;
  user_like2_count: number;
  user_title: string;
  trophy_count: number;
  contest_count: number;
  user_following_count: number;
  user_followers_count: number;
  user_register_date: number;
  user_last_seen_date: number;
  links: {
    avatar: string;
  };
  custom_fields: {
    telegram: string | null;
    vk: string | null;
  };
}

interface SearchResponse {
  users: User[];
}

interface UserSearchProps {
  token: string;
}

const UserSearch = ({ token }: UserSearchProps) => {
  const [username, setUsername] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!username.trim()) return;
    
    setIsLoading(true);
    setError('');
    setSearchResults(null);
    setSelectedUser(null);
    
    try {
      const data = await searchUser(token, username);
      console.log('API Response:', data);
      setSearchResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  const renderSearchResults = () => {
    if (!searchResults?.users.length) {
      return (
        <div className="bg-[#1E1E1E]/80 backdrop-blur-sm rounded-2xl p-4 
          border border-[#333333] text-center text-gray-400">
          Пользователи не найдены
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {searchResults.users.map((user, index) => (
          <div
            key={index}
            onClick={() => setSelectedUser(index)}
            className="bg-[#1E1E1E]/80 backdrop-blur-sm rounded-xl p-3 
              border border-[#333333] hover:border-[#2BAD72]/30 transition-all 
              cursor-pointer flex items-center gap-3"
          >
            <img
              src={user.links.avatar}
              alt={user.username}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <h3 
                className="font-medium text-white truncate"
                dangerouslySetInnerHTML={{ __html: user.username_html || user.username }}
              />
              <div 
                className="text-gray-400 text-sm truncate"
                dangerouslySetInnerHTML={{ 
                  __html: user.user_title.replace(/:(\w+):/g, (match, emoji) => {
                    const smilieSpan = user.user_title.match(new RegExp(`<span[^>]*data-image-url="([^"]*)"[^>]*>${match}</span>`));
                    return smilieSpan ? `<img src="${smilieSpan[1]}" alt="${emoji}" class="inline-block h-4 w-4" />` : match;
                  })
                }} 
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#161616] bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="max-w-2xl mx-auto p-4 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => selectedUser !== null ? setSelectedUser(null) : navigate(-1)}
            className="p-2 rounded-lg bg-[#1E1E1E] border border-[#333333] 
              hover:border-[#2BAD72]/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[#2BAD72]" />
          </button>
          <h1 className="text-xl font-bold text-white">Поиск пользователя</h1>
        </div>

        {/* Search Input */}
        {selectedUser === null && (
          <div className="bg-[#1E1E1E]/80 backdrop-blur-sm rounded-2xl p-4 mb-4 
            border border-[#333333]">
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Введите никнейм"
                className="w-full bg-[#141414] border-2 border-[#333333] text-white pl-4 pr-14 py-2.5 rounded-xl
                  focus:border-[#2BAD72] outline-none transition-all placeholder:text-gray-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                disabled={isLoading || !username.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 
                  bg-[#2BAD72] rounded-lg transition-all hover:bg-[#229861]
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Content */}
        {selectedUser !== null && searchResults?.users[selectedUser] ? (
          <FoundProfile user={searchResults.users[selectedUser]} token={token} />
        ) : (
          !isLoading && renderSearchResults()
        )}

        {isLoading && (
          <div className="bg-[#1E1E1E]/80 backdrop-blur-sm rounded-2xl p-8 
            border border-[#333333] flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#2BAD72] border-t-transparent 
              rounded-full animate-spin"/>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSearch;