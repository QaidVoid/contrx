import { type ReactNode, createContext, useState } from 'react'
import type { AuthUser, LoginResponse } from '../types/auth'
import { setCookie } from '../lib'

interface AuthContextProps {
  auth: LoginResponse
  setAuth: React.Dispatch<React.SetStateAction<LoginResponse>>
  user: AuthUser
  setUser: React.Dispatch<React.SetStateAction<AuthUser>>
  logout: () => void
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const initialAuth: LoginResponse = {
  access_token: '',
  refresh_token: '',
}

const initialUser: AuthUser = {
  id: 0
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState(initialAuth)
  const [user, setUser] = useState(initialUser)
  const [isLoading, setIsLoading] = useState(false)

  const logout = () => {
    setAuth(initialAuth)
    setUser(initialUser)
    setCookie('refresh_token', '', 0)
  }

  const contextData = {
    auth,
    setAuth,
    user,
    setUser,
    logout,
    isLoading,
    setIsLoading,
  };

  return (
      <AuthContext.Provider value={contextData}>
        {children}
      </AuthContext.Provider>
  );
}

export default AuthContext
