import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import ErrorPage from "./error-page.jsx";
import Home from "./components/User/Home/Home.jsx";
import Dashboard from "./components/Admin/Dashboard/Dashboard.jsx";
import Admin from "./components/Admin/Admin.jsx";

import Promotion from "./components/Admin/Promotion/Promotion.jsx";
import CreatePromotionForm from "./components/Admin/Promotion/Create/CreatePromotionForm.jsx";
import UpdatePromotionForm from "./components/Admin/Promotion/Update/UpdatePromotionForm.jsx";

import Service from "./components/Admin/Service/Service.jsx";
import CreateServiceForm from "./components/Admin/Service/Create/CreateServiceForm.jsx";
import UpdateServiceForm from "./components/Admin/Service/Update/UpdateServiceForm.jsx";

import User from "./components/Admin/User/User.jsx";
import CreateUserForm from "./components/Admin/User/Create/CreateUserForm.jsx";
import UpdateUserForm from "./components/Admin/User/Update/UpdateUserForm.jsx";
import Role from "./components/Admin/Role/Role.jsx";
import UpdateRoleForm from "./components/Admin/Role/Update/UpdateRoleForm.jsx";
import CreateRoleForm from "./components/Admin/Role/Create/CreateRoleForm.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "admin",
        element: <Admin />,
        children: [
          { index: true, element: <Dashboard /> },
          // Promotions
          { path: "promotions", element: <Promotion /> },
          { path: "promotions/create", element: <CreatePromotionForm /> },
          { path: "promotions/:id/update", element: <UpdatePromotionForm /> },

          // Services
          { path : "services", element: <Service /> },
          { path : "services/create", element: <CreateServiceForm /> },
          { path : "services/:id/update", element: <UpdateServiceForm /> },
          


          { path: "roles", element: <Role /> },
          { path: "roles/create", element: <CreateRoleForm /> },
          { path: "roles/:id/update", element: <UpdateRoleForm /> },

          { path: "users", element: <User /> },
          { path: "users/create", element: <CreateUserForm /> },
          { path: "users/:id/update", element: <UpdateUserForm /> },
        ],
      },
    ],
  },
]);
