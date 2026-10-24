
import { createMMKV } from 'react-native-mmkv';

export const tokenStorage = createMMKV({
  id: 'token-storage',
  encryptionKey: 'token_secret',
});

export const storage = createMMKV({
  id: 'app-storage',
  encryptionKey: 'app_secret',
});

export const mmkvStorage = {
  setItem: (key: string, value: string): void => {
    storage.set(key, value);
  },

  getItem: (key: string): string | null => {
    return storage.getString(key) ?? null;
  },

  removeItem: (key: string): void => {
    storage.remove(key);
  },
};
