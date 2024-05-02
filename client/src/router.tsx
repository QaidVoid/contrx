import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import Layout from "./components/layout";
import PersistLogin from "./components/persist-login";
import Application from "./pages/application";
import AuthGuard from "./components/auth-guard";
import Dashboard from "./pages/dashboard";
import Contracts from "./pages/contracts";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PersistLogin />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/",
        element: <AuthGuard />,
        children: [{
          path: "/",
          element: <Layout />,
          children: [
            {
              path: "/app",
              element: <Application />
            },
            {
              path: "/overview",
              element: <Dashboard />
            },
            {
              path: "/contracts",
              element: <Contracts />
            },
            {
              path: "/contracts/:contractId",
              element: <Contracts />
            }
          ]
        }]
      }
    ]
  }
])
