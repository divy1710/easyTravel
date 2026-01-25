const USER_KEY = 'user';

export type StoredUser = { 
  email?: string; 
  firstName?: string;
  lastName?: string;
  guest?: boolean; 
};

// Store user info locally (for display purposes, not auth)
export function setStoredUser(user: StoredUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser(): StoredUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function clearStoredUser() {
  localStorage.removeItem(USER_KEY);
}
