export interface StoredSessionUser {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

const USER_KEY = 'yaydoom_user';
const TOKEN_KEY = 'yaydoom_token';
const storage = typeof globalThis !== 'undefined' ? globalThis.localStorage : undefined;

export const getStoredSessionUser = (): StoredSessionUser | null => {
  if (!storage) return null;

  try {
    const raw = storage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as StoredSessionUser) : null;
  } catch {
    return null;
  }
};

export const getStoredSessionToken = (): string | null => {
  if (!storage) return null;
  return storage.getItem(TOKEN_KEY);
};

export const clearStoredSession = () => {
  if (!storage) return;
  storage.removeItem(TOKEN_KEY);
  storage.removeItem(USER_KEY);
};
