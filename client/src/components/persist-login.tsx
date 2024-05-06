import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/use-auth";
import { useEffect, useState } from "react";
import api from "../services/api";

function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const { auth, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    const verifyRefreshToken = async () => {
      const { body, status } = await api.refreshToken();
      if (status === 200) {
        login(body);
      }
      setIsLoading(false);
    };
    !auth.access_token ? verifyRefreshToken() : setIsLoading(false);
  }, [login, auth.access_token]);

  useEffect(() => {
    if (auth.access_token && from === "/login") {
      navigate("/app");
    }
    // else if (auth.access_token) {
    //   navigate(from, { replace: true });
    // }
  }, [auth.access_token, from, navigate]);

  return isLoading ? null : <Outlet />;
}

export default PersistLogin;
