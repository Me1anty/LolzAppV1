import { Capacitor } from '@capacitor/core';
import { Http } from '@capacitor-community/http';

// Constants
const API_CONFIG = {
  TIMEOUT: 15000,
  COOLDOWN: 3500,
  URLS: {
    BASE_URL: 'https://api.lzt.market',
    FORUM_URL: 'https://api.zelenka.guru'
  },
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 3500
  }
};

// Types
export interface TransferFundsParams {
  username: string;
  amount: string;
  secretAnswer: string;
  comment?: string;
  isHoldEnabled: boolean;
  holdLength?: string;
  holdOption?: string;
}

// Error Handling
const getNetworkErrorMessage = (error: any): string => {
  console.error('Full error:', error);

  if (error?.message?.includes('429')) {
    return 'Слишком много запросов. Подождите немного';
  }
  if (error?.message?.includes('403')) {
    return 'Доступ запрещен. Проверьте токен';
  }
  if (error?.message?.includes('401')) {
    return 'Неверный токен';
  }
  if (error?.message?.includes('NullPointerException')) {
    return 'Ошибка подключения к интернету';
  }
  if (error?.message?.includes('UnknownHostException')) {
    return 'Ошибка подключения к интернету. Проверьте соединение';
  }
  if (error?.message?.includes('timeout')) {
    return 'Превышено время ожидания ответа от сервера';
  }
  if (error?.message?.includes('Network request failed')) {
    return 'Ошибка сети. Проверьте подключение к интернету';
  }
  if (error?.message?.includes('ERR_CLEARTEXT_NOT_PERMITTED')) {
    return 'Ошибка безопасного соединения';
  }
  return error?.message || 'Неизвестная ошибка';
};

// API Manager
class APIManager {
  private lastRequestTime = 0;
  private isRequestPending = false;
  private readonly maxRetries = API_CONFIG.RETRY.MAX_ATTEMPTS;
  private readonly retryDelay = API_CONFIG.RETRY.DELAY;

  private async waitForCooldown(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < API_CONFIG.COOLDOWN) {
      const waitTime = Math.max(API_CONFIG.COOLDOWN - timeSinceLastRequest, 0);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  async executeRequest<T>(request: () => Promise<T>, retryCount = 0): Promise<T> {
    if (this.isRequestPending) {
      throw new Error('Подождите, идет выполнение запроса');
    }

    try {
      this.isRequestPending = true;
      await this.waitForCooldown();

      const result = await Promise.race([
        request(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), API_CONFIG.TIMEOUT)
        )
      ]) as T;

      this.lastRequestTime = Date.now();
      return result;
    } catch (error) {
      if (error instanceof Error) {
        const shouldRetry = error.message.includes('429') || 
                          error.message.includes('403') || 
                          error.message.includes('Network request failed') ||
                          error.message.includes('timeout');
                          
        if (shouldRetry && retryCount < this.maxRetries) {
          console.log(`Retry attempt ${retryCount + 1} of ${this.maxRetries}`);
          this.isRequestPending = false;
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
          return this.executeRequest(request, retryCount + 1);
        }
      }
      throw error;
    } finally {
      this.isRequestPending = false;
    }
  }

  isRequestInProgress(): boolean {
    return this.isRequestPending;
  }

  getRemainingCooldown(): number {
    if (this.isRequestPending) {
      return this.retryDelay;
    }
    const timeSinceLastRequest = Date.now() - this.lastRequestTime;
    return Math.max(0, API_CONFIG.COOLDOWN - timeSinceLastRequest);
  }
}

export const apiManager = new APIManager();

// API Endpoints
export const fetchUserProfile = async (token: string) => {
  return apiManager.executeRequest(async () => {
    const url = `${API_CONFIG.URLS.BASE_URL}/me`;
    
    try {
      if (Capacitor.isNativePlatform()) {
        const response = await Http.request({
          method: 'GET',
          url,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          params: {}
        });

        if (!response || !response.data) {
          throw new Error('Invalid response format');
        }

        if (response.status === 429) {
          throw new Error('429');
        }
        
        if (response.status === 403) {
          throw new Error('403');
        }

        if (response.status >= 400) {
          throw new Error(response.data?.errors?.[0] || 'API Error');
        }

        return response.data;
      } else {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          mode: 'cors'
        });

        if (response.status === 429) {
          throw new Error('429');
        }

        if (response.status === 403) {
          throw new Error('403');
        }

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.errors?.[0] || 'API Error');
        }

        const data = await response.json();
        if (!data) {
          throw new Error('Invalid response format');
        }

        return data;
      }
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(getNetworkErrorMessage(error));
    }
  });
};

export const transferFunds = async (token: string, params: TransferFundsParams) => {
  return apiManager.executeRequest(async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        const requestData = {
          username: params.username,
          amount: params.amount,
          currency: 'rub',
          secret_answer: params.secretAnswer,
          transfer_hold: params.isHoldEnabled.toString(),
          ...(params.comment && { comment: params.comment }),
          ...(params.isHoldEnabled && params.holdLength && params.holdOption && {
            hold_length_value: params.holdLength,
            hold_length_option: params.holdOption
          })
        };

        const response = await Http.request({
          method: 'POST',
          url: `${API_CONFIG.URLS.BASE_URL}/balance/transfer`,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          data: requestData,
          params: {}
        });

        if (!response || !response.data) {
          throw new Error('Invalid response format');
        }

        if (response.status >= 400) {
          throw new Error(response.data?.errors?.[0] || 'Transfer Error');
        }

        return response.data;
      } else {
        const formData = new FormData();
        formData.append('username', params.username);
        formData.append('amount', params.amount);
        formData.append('currency', 'rub');
        formData.append('secret_answer', params.secretAnswer);
        formData.append('transfer_hold', params.isHoldEnabled.toString());

        if (params.comment) {
          formData.append('comment', params.comment);
        }

        if (params.isHoldEnabled && params.holdLength && params.holdOption) {
          formData.append('hold_length_value', params.holdLength);
          formData.append('hold_length_option', params.holdOption);
        }

        const response = await fetch(`${API_CONFIG.URLS.BASE_URL}/balance/transfer`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data?.errors?.[0] || 'Transfer Error');
        }

        return await response.json();
      }
    } catch (error) {
      console.error('Transfer Error:', error);
      throw new Error(getNetworkErrorMessage(error));
    }
  });
};

export const searchUser = async (token: string, username: string) => {
  return apiManager.executeRequest(async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        const response = await Http.request({
          method: 'GET',
          url: `${API_CONFIG.URLS.FORUM_URL}/users/find`,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          params: { username }
        });

        if (!response || !response.data) {
          throw new Error('Invalid response format');
        }

        if (response.status >= 400) {
          throw new Error(response.data?.errors?.[0] || 'User not found');
        }

        return response.data;
      } else {
        const response = await fetch(
          `${API_CONFIG.URLS.FORUM_URL}/users/find?username=${encodeURIComponent(username)}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data?.errors?.[0] || 'User not found');
        }

        return await response.json();
      }
    } catch (error) {
      console.error('Search Error:', error);
      throw new Error(getNetworkErrorMessage(error));
    }
  });
};

export const fetchPaymentHistory = async (token: string) => {
  return apiManager.executeRequest(async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        const response = await Http.request({
          method: 'GET',
          url: `${API_CONFIG.URLS.BASE_URL}/user/payments`,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          params: {}
        });

        if (!response || !response.data) {
          throw new Error('Invalid response format');
        }

        if (response.status >= 400) {
          throw new Error(response.data?.errors?.[0] || 'API Error');
        }

        return response.data;
      } else {
        const response = await fetch(`${API_CONFIG.URLS.BASE_URL}/user/payments`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data?.errors?.[0] || 'API Error');
        }

        return await response.json();
      }
    } catch (error) {
      console.error('Payment History Error:', error);
      throw new Error(getNetworkErrorMessage(error));
    }
  });
};