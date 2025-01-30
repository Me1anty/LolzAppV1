// src/components/Login.tsx
import { useState } from 'react';
import { Key, AlertCircle, WifiOff, LogIn, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: (token: string) => void;
  error?: string;
  isLoading?: boolean;
}

const Login = ({ onLogin, error, isLoading = false }: LoginProps) => {
  const [token, setToken] = useState('');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onLogin(token.trim());
    }
  };

  return (
    <div className="min-h-screen bg-[#161616] bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:16px_16px] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1E1E1E]/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-[#333333]">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-[#2BAD72] to-[#229861] rounded-2xl shadow-lg shadow-[#2BAD72]/20 mb-4 rotate-3 hover:rotate-0 transition-all duration-300">
              <Key className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Вход в систему</h2>
            <p className="text-gray-400 mt-2">Используйте API токен LOLZ для входа</p>
          </div>

          <form onSubmit={handleManualLogin}>
            <div className="mb-6">
              <div className="relative group">
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Введите API токен"
                  disabled={isLoading}
                  className="w-full bg-[#141414] border-2 border-[#333333] text-white px-4 py-3 rounded-xl 
                  focus:border-[#2BAD72] group-hover:border-[#2BAD72]/50 outline-none transition-all
                  placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              {error && (
                <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2">
                  {error.toLowerCase().includes('интернет') || error.toLowerCase().includes('подключение') ? (
                    <WifiOff className="text-red-500 w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="text-red-500 w-5 h-5 flex-shrink-0" />
                  )}
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !token.trim()}
              className="w-full bg-gradient-to-r from-[#2BAD72] to-[#229861] text-white py-3 px-4 rounded-xl
              hover:from-[#229861] hover:to-[#1b8b4f] hover:shadow-[#2BAD72]/20 hover:shadow-lg
              transition-all duration-300 flex items-center justify-center gap-2 transform hover:translate-y-[-2px]
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Вход...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Войти
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">Created by: <strong>HashBrute</strong></p>
        </div>
      </div>
    </div>
  );
};

export default Login;