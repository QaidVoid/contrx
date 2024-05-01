import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import { getCookie, setCookie } from "../lib";
import useAuth from "./use-auth";
import { useRef } from "react";

const useRefreshToken = () => {
  const { auth, setAuth, setUser, setIsLoading } = useAuth();
  const isRefreshing = useRef(false);

  const refresh = async () => {
    if (isRefreshing.current) return;
    isRefreshing.current = true;
    setIsLoading(true);

    const refreshToken = getCookie("refresh_token");

    if (refreshToken) {
      const { body, status } = await api.refreshToken();

      if (status === 200) {
        setCookie("refresh_token", body.refresh_token, 14 * 86400);
        setAuth(body);
        setUser(jwtDecode(body.refresh_token));

        isRefreshing.current = false;
        setIsLoading(false);
        return body;
      }
      setIsLoading(false);
    }
    isRefreshing.current = false;
    setIsLoading(false);
    return auth;
  };
  return refresh;
};

export default useRefreshToken;
