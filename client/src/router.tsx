import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import Layout from "./components/layout";
import PersistLogin from "./components/persist-login";
import Application from "./pages/application";
import AuthGuard from "./components/auth-guard";
import Contracts from "./pages/contracts";
import OrganizationUsers from "./pages/organization/organization-users";
import OrganizationClauses from "./pages/organization/clauses";
import OrganizationContract from "./pages/organization/organization-contract";
import OrganizationTemplates from "./pages/organization/organization-templates";
import OrganizationDashboard from "./pages/organization/organization-dashboard";
import OrganizationClause from "./pages/organization/clause/detail";
import CreateContractType from "./pages/organization/contract/create";
import EditContractType from "./pages/organization/contract/edit";
import CounterParties from "./pages/organization/counterparties";
import ContractSummary from "./pages/organization/contracts/summary";
import Overview from "./pages/organization/overview";

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
              // {
              //   path: "/profile",
              //   element: <Profile />
              // }
            ],
          },
          {
            path: "/:organizationId",
            element: <OrganizationDashboard />,
            children: [
              {
                path: "/:organizationId/overview",
                element: <Overview />,
              },
              {
                path: "/:organizationId/contracts",
                element: <Contracts />,
              },
              {
                path: "/:organizationId/contract/:contractId",
                element: <ContractSummary />,
              },
              {
                path: "/:organizationId/users",
                element: <OrganizationUsers />
              },
              {
                path: "/:organizationId/counterparties",
                element: <CounterParties />
              },
              {
                path: "/:organizationId/clauses",
                element: <OrganizationClauses />
              },
              {
                path: "/:organizationId/clause/:clauseId",
                element: <OrganizationClause />
              },
              {
                path: "/:organizationId/contract-types",
                element: <OrganizationContract />
              },
              {
                path: "/:organizationId/contract-types/new",
                element: <CreateContractType />
              },
              {
                path: "/:organizationId/contract-types/:templateId",
                element: <EditContractType />
              },
              {
                path: "/:organizationId/templates",
                element: <OrganizationTemplates />
              }
            ]
          },
        ],
      },
    ],
  },
]);
