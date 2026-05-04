import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AxiosError } from "axios";
import {
  api,
  clearStoredToken,
  getStoredToken,
  setUnauthorizedHandler,
  storeToken,
} from "../api/axios";
import type { LoginResponse, MeResponse, Staff } from "../types/auth";

type LoginPayload = {
  email: string;
  password: string;
};

type AuthContextType = {
  token: string | null;
  staff: Staff | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const clearAuthStorage = () => {
  clearStoredToken();
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [staff, setStaff] = useState<Staff | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const logout = useCallback(() => {
    clearAuthStorage();
    setToken(null);
    setStaff(null);
  }, []);

  const login = useCallback(async ({ email, password }: LoginPayload) => {
    const { data } = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    storeToken(data.token);
    setToken(data.token);
    setStaff(data.staff);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
    });

    return () => {
      setUnauthorizedHandler(null);
    };
  }, [logout]);

  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = getStoredToken();

      if (!storedToken) {
        setIsInitializing(false);
        return;
      }

      try {
        const { data } = await api.get<MeResponse>("/auth/me");
        const restoredStaff = (data as { staff?: Staff }).staff ?? (data as Staff);
        setToken(storedToken);
        setStaff(restoredStaff);
      } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response?.status === 401) {
          logout();
        }
      } finally {
        setIsInitializing(false);
      }
    };

    void restoreSession();
  }, [logout]);

  const value = useMemo(
    () => ({
      token,
      staff,
      isAuthenticated: Boolean(token && staff),
      isInitializing,
      login,
      logout,
    }),
    [isInitializing, login, logout, staff, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
