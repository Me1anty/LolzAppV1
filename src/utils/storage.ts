// src/utils/storage.ts
import { Preferences } from '@capacitor/preferences';

const TOKEN_KEY = 'user_token';
const SECRET_WORD_KEY = 'secret_word';

export const storage = {
  async saveToken(token: string) {
    try {
      await Preferences.set({ key: TOKEN_KEY, value: token });
    } catch (error) {
      console.error('Error saving token:', error);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      const { value } = await Preferences.get({ key: TOKEN_KEY });
      return value;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  async removeToken() {
    try {
      await Preferences.remove({ key: TOKEN_KEY });
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },

  async saveSecretWord(word: string) {
    try {
      await Preferences.set({ key: SECRET_WORD_KEY, value: word });
    } catch (error) {
      console.error('Error saving secret word:', error);
    }
  },

  async getSecretWord(): Promise<string | null> {
    try {
      const { value } = await Preferences.get({ key: SECRET_WORD_KEY });
      return value;
    } catch (error) {
      console.error('Error getting secret word:', error);
      return null;
    }
  },

  async removeSecretWord() {
    try {
      await Preferences.remove({ key: SECRET_WORD_KEY });
    } catch (error) {
      console.error('Error removing secret word:', error);
    }
  }
};