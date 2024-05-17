import { type ReactNode, createContext, useState, useCallback, useMemo } from "react";
import type { LoginResponse } from "../types/auth";
import { initClient } from "@ts-rest/core";
import { contract } from "../services/contract";
import { API_URL } from "../lib/constants";
import type api from "../services/api";

interface AuthContextProps {
  auth: LoginResponse;
  api: typeof api;
  login: (auth: LoginResponse) => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialAuth: LoginResponse = {
  user_id: "",
  access_token: "",
  refresh_token: "",
};

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState(initialAuth);
  const [isLoading, setIsLoading] = useState(false);

  const api = useMemo(() => {
    return initClient(contract, {
      baseUrl: API_URL,
      baseHeaders: {
        Authorization: `Bearer ${auth.access_token}`,
      },
      credentials: "include",
    });
  }, [auth.access_token]);

  const login = useCallback((auth: LoginResponse) => {
    setAuth(auth);
  }, []);

  const contextData = {
    auth,
    api,
    login,
    isLoading,
    setIsLoading,
  };

  return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
};

export default AuthContext;
