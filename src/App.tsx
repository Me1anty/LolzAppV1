// src/App.tsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Profile from './components/Profile';
import Settings from './components/Settings';
import History from './components/History';
import UserSearch from './components/UserSearch';
import MainLayout from './components/Layout/MainLayout';

import { fetchUserProfile } from './services/api';
import { storage } from './services/storage';

const App = () => {
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);

  useEffect(() => {
    const loadSavedToken = async () => {
      const savedToken = await storage.getToken();
      if (savedToken) {
        handleLogin(savedToken);
      }
    };
    loadSavedToken();
  }, []);

  const handleLogin = async (newToken: string) => {
    try {
      setIsLoading(true);
      setError('');
      setToken(newToken);

      const response = await fetchUserProfile(newToken);

      if ('errors' in response) {
        setError(response.errors[0]);
        return;
      }

      if (response?.user?.username && !response?.user?.balance) {
        setError('Получите токен маркета');
        return;
      }

      if (response && response.user) {
        const userData = {
          username: response.user.username,
          user_id: response.user.user_id,
          user_message_count: response.user.user_message_count || 0,
          user_like_count: response.user.user_like_count || 0,
          user_like2_count: response.user.user_like2_count || 0,
          contest_count: response.user.contest_count || 0,
          trophy_count: response.user.trophy_count || 0,
          user_following_count: response.user.user_following_count || 0,
          user_followers_count: response.user.user_followers_count || 0,
          balance: response.user.balance,
          joined_date: response.user.joined_date || Math.floor(Date.now() / 1000),
          links: {
            avatar: response.user.links?.avatar
          }
        };
        setUserData(userData);
        setError('');
        await storage.saveToken(newToken);
        setLastUpdateTime(Date.now());
      } else {
        setError('Неверный формат данных');
      }
    } catch (err) {
      console.error('Login Error:', err);
      setError('Произошла ошибка при входе');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setUserData(null);
    setError('');
    setToken('');
    await storage.removeToken();
    await storage.removeSecretWord();
  };

  const handleRefresh = async () => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateTime;

    if (timeSinceLastUpdate < 3000) {
      const remainingTime = Math.ceil((3000 - timeSinceLastUpdate) / 1000);
      setError(`Подождите ${remainingTime} сек перед обновлением`);
      return;
    }

    if (token) {
      await handleLogin(token);
    }
  };

  if (!userData) {
    return <Login onLogin={handleLogin} error={error} isLoading={isLoading} />;
  }

  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/profile" element={
            <Profile 
              data={userData}
              token={token}
              onRefresh={handleRefresh}
              isLoading={isLoading}
              lastUpdateTime={lastUpdateTime}
            />
          } />
          <Route path="/search" element={
            <UserSearch token={token} />
          } />
          <Route path="/history" element={
            <History token={token} />
          } />      
          <Route path="/settings" element={
            <Settings onLogout={handleLogout} />
          } />
          <Route path="*" element={<Navigate to="/profile" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default App;