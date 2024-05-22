import { type ReactNode, createContext, useState, useCallback, useMemo } from "react";
import type { LoginResponse } from "../types/auth";
import { initClient } from "@ts-rest/core";
import { contract } from "../services/contract";
import { API_URL } from "../lib/constants";
import type api from "../services/api";
import type { User } from "../types/user";

interface AuthContextProps {
  auth: LoginResponse;
  user: Partial<User>;
  api: typeof api;
  login: (auth: LoginResponse, user: User) => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialAuth: LoginResponse = {
  user_id: "",
  access_token: "",
  refresh_token: "",
};

const initialUser: Partial<User> = {
  id: "",
  email: "",
  first_name: "",
  last_name: "",
};

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState(initialAuth);
  const [user, setUser] = useState(initialUser);
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

  const login = useCallback((auth: LoginResponse, user: User) => {
    setAuth(auth);
    setUser(user);
  }, []);

  const contextData = {
    auth,
    api,
    login,
    isLoading,
    setIsLoading,
    user,
  };

  return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
};

export default AuthContext;
