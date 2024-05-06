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
import SetupOrganization from "./pages/organization/setup";
import OrganizationInfo from "./pages/organization/organization-info";
import OrganizationUsers from "./pages/organization/organization-users";
import OrganizationClauses from "./pages/organization/clauses";
import OrganizationContract from "./pages/organization/organization-contract";
import OrganizationTemplates from "./pages/organization/organization-templates";
import ApprovalWorkflows from "./pages/organization/approval-workflows";
import ChoiceList from "./pages/organization/choice-list";
import OrganizationDashboard from "./pages/organization/organization-dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PersistLogin />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/",
        element: <AuthGuard />,
        children: [
          {
            path: "/",
            element: <Layout />,
            children: [
              {
                path: "/app",
                element: <Application />,
              },
            ],
          },
          {
            path: "/:organizationId",
            element: <OrganizationDashboard />,
            children: [
              // {
              //   path: "/overview",
              //   element: <Dashboard />,
              // },
              // {
              //   path: "/contracts",
              //   element: <Contracts />,
              // },
              {
                path: "/:organizationId/:contractId",
                element: <Contracts />,
              },
              {
                path: "/:organizationId/info",
                element: <OrganizationInfo />
              },
              {
                path: "/:organizationId/users",
                element: <OrganizationUsers />
              },
              {
                path: "/:organizationId/clauses",
                element: <OrganizationClauses />
              },
              {
                path: "/:organizationId/contract",
                element: <OrganizationContract />
              },
              {
                path: "/:organizationId/templates",
                element: <OrganizationTemplates />
              },
              {
                path: "/:organizationId/approval-workflows",
                element: <ApprovalWorkflows />
              },
              {
                path: "/:organizationId/choice-list",
                element: <ChoiceList />
              }
            ]
          },
          {
            path: "/setup/org",
            element: <SetupOrganization />,
          },
        ],
      },
    ],
  },
]);
