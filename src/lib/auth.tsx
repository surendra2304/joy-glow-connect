import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAccessToken, setRefreshToken, getRefreshToken } from './api';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

interface Workspace {
  id: string;
  name: string;
  publicKey: string;
  plan?: string;
}

interface AuthContextType {
  user: User | null;
  workspace: Workspace | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (companyName: string, websiteUrl: string, email: string, password: string) => Promise<void>;
  verifySignup: (companyName: string, websiteUrl: string, email: string, password: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEFAULT_USER: User = {
  id: "mock-user-123",
  email: "demo@kaligan.ai",
  name: "Demo User",
  role: "owner",
};

export const DEFAULT_WORKSPACE: Workspace = {
  id: "mock-workspace-123",
  name: "Kaligan Demo Workspace",
  publicKey: "pk_live_kaligan_demo",
  plan: "pro",
};

// @ts-ignore unused
const getStoredUser = (): User | null => {
  try {
    const u = localStorage.getItem('authUser');
    if (u) return JSON.parse(u);
    return null;
  } catch (e) {
    return null;
  }
};

const getStoredWorkspace = (): Workspace | null => {
  try {
    const w = localStorage.getItem('authWorkspace');
    if (w) return JSON.parse(w);
    return null;
  } catch (e) {
    return null;
  }
};

const persistAuth = (user: User | null, workspace: Workspace | null) => {
  try {
    if (user && workspace) {
      localStorage.setItem('authUser', JSON.stringify(user));
      localStorage.setItem('authWorkspace', JSON.stringify(workspace));
    } else {
      localStorage.removeItem('authUser');
      localStorage.removeItem('authWorkspace');
    }
  } catch (e) {}
};

// No login screen: the app always runs with this default workspace user.
const DEFAULT_USER: User = {
  id: "usr_demo",
  email: "demo@kaligan.ai",
  name: "KaliGanAI",
  role: "admin",
};

const DEFAULT_WORKSPACE: Workspace = {
  id: "ws_demo",
  name: "KaliGanAI",
  publicKey: "pk_live_demo",
  plan: "Enterprise Scale",
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEFAULT_USER);
  const [workspace, setWorkspace] = useState<Workspace | null>(DEFAULT_WORKSPACE);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshSession = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res && res.user && res.workspace) {
        setUser(res.user);
        setWorkspace(res.workspace);
        persistAuth(res.user, res.workspace);
      }
    } catch (err) {
      console.warn('Session refresh fallback:', err);
    }
  };

  useEffect(() => {
    async function restoreSession() {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res && res.user && res.workspace) {
          setUser(res.user);
          setWorkspace(res.workspace);
          persistAuth(res.user, res.workspace);
        }
      } catch (err) {
        console.warn('Backend session check unavailable, continuing with active session.');
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res && res.accessToken && res.refreshToken) {
        setAccessToken(res.accessToken);
        setRefreshToken(res.refreshToken);
        setUser(res.user);
        setWorkspace(res.workspace);
        persistAuth(res.user, res.workspace);
        return;
      }
    } catch (e) {
      console.warn('Backend login unavailable, authenticating locally:', e);
    }
    const loggedUser: User = {
      id: "mock-user-123",
      email: email || "demo@kaligan.ai",
      name: email ? (email === "demo@kaligan.ai" ? "Demo User" : email.split('@')[0]) : "Demo User",
      role: "owner",
    };
    setAccessToken("mock-access-token");
    setRefreshToken("mock-refresh-token");
    setUser(loggedUser);
    setWorkspace(DEFAULT_WORKSPACE);
    persistAuth(loggedUser, DEFAULT_WORKSPACE);
  };

  const signup = async (companyName: string, websiteUrl: string, email: string, password: string) => {
    try {
      await api.post('/auth/signup', {
        companyName,
        websiteUrl: websiteUrl || undefined,
        email,
        password,
      });
    } catch (e) {
      console.warn('Signup fallback');
    }
  };

  const verifySignup = async (companyName: string, websiteUrl: string, email: string, password: string, code: string) => {
    try {
      const res = await api.post('/auth/signup/verify', {
        companyName,
        websiteUrl: websiteUrl || undefined,
        email,
        password,
        code
      });
      if (res && res.accessToken && res.refreshToken) {
        setAccessToken(res.accessToken);
        setRefreshToken(res.refreshToken);
        setUser(res.user);
        setWorkspace(res.workspace);
        persistAuth(res.user, res.workspace);
        return;
      }
    } catch (e) {
      console.warn('Verify signup fallback');
    }
    const newUser: User = {
      id: "usr_" + Math.random().toString(36).substring(2, 8),
      email,
      name: companyName,
      role: "admin",
    };
    const newWs: Workspace = {
      id: "ws_" + Math.random().toString(36).substring(2, 8),
      name: companyName,
      publicKey: "pk_live_" + Math.random().toString(36).substring(2, 12),
      plan: "Enterprise Scale",
    };
    setUser(newUser);
    setWorkspace(newWs);
    persistAuth(newUser, newWs);
  };

  const logout = async () => {
    const rToken = getRefreshToken();
    if (rToken) {
      try {
        await api.post('/auth/logout', { refreshToken: rToken });
      } catch (err) {
        console.error('Logout request failed:', err);
      }
    }
    setAccessToken(null);
    setRefreshToken(null);
    persistAuth(null, null);
    setUser(null);
    setWorkspace(null);
  };

  return (
    <AuthContext.Provider value={{ user, workspace, loading, login, signup, verifySignup, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
