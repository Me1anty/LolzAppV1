// src/components/Settings.tsx
import { useState, useEffect } from 'react';
import { LogOut, Lock, Shield } from 'lucide-react';
import { storage } from '../services/storage';

interface SettingsProps {
  onLogout: () => void;
}

const Settings = ({ onLogout }: SettingsProps) => {
  const [secretWord, setSecretWord] = useState('');

  useEffect(() => {
    const loadSecretWord = async () => {
      const saved = await storage.getSecretWord();
      if (saved) setSecretWord(saved);
    };
    loadSecretWord();
  }, []);

  const handleSecretWordChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSecretWord(newValue);
    await storage.saveSecretWord(newValue);
  };

  return (
    <div className="min-h-screen bg-[#161616] bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="max-w-2xl mx-auto p-4 pb-24">
        {/* Заголовок */}
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-[#2BAD72]" />
          <h1 className="text-xl font-bold text-white">Настройки</h1>
        </div>

        {/* Секретное слово */}
        <div className="bg-[#1E1E1E]/80 backdrop-blur-sm rounded-2xl p-4 mb-4 
          border border-[#333333] hover:shadow-[#2BAD72]/5 hover:shadow-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4 text-[#2BAD72]" />
            <h2 className="text-white font-medium">Секретное слово</h2>
          </div>
          
          <input
            type="password"
            value={secretWord}
            onChange={handleSecretWordChange}
            placeholder="Введите секретное слово"
            className="w-full bg-[#141414] border-2 border-[#333333] text-white px-4 py-2.5 rounded-xl
            focus:border-[#2BAD72] outline-none transition-all placeholder:text-gray-500"
          />
          <p className="text-gray-400 text-sm mt-2">
            Будет использоваться автоматически при переводе средств
          </p>
        </div>

        {/* Выход */}
        <button
          onClick={onLogout}
          className="w-full bg-red-500/10 hover:bg-red-500/20 rounded-xl p-4 
          transition-colors group border border-red-500/20"
        >
          <div className="flex items-center justify-center gap-2">
            <LogOut className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
            <span className="text-red-500 font-medium">Выйти из аккаунта</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Settings;