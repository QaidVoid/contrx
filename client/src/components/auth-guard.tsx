import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/use-auth";

function AuthGuard() {
  const { auth } = useAuth();
  const location = useLocation();

  return auth.access_token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default AuthGuard;
