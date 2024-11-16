import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import ErrorPage from "./error-page.jsx";
import Home from "./components/User/Home/Home.jsx";
import Dashboard from "./components/Admin/Dashboard/Dashboard.jsx";
import Admin from "./components/Admin/Admin.jsx";
import User from "./components/Admin/User/User.jsx";
import CreateUserForm from "./components/Admin/User/Create/CreateUserForm.jsx";
import UpdateUserForm from "./components/Admin/User/Update/UpdateUserForm.jsx";
import Role from "./components/Admin/Role/Role.jsx";
import UpdateRoleForm from "./components/Admin/Role/Update/UpdateRoleForm.jsx";
import CreateRoleForm from "./components/Admin/Role/Create/CreateRoleForm.jsx";
import Doctor from "./components/Admin/Doctors/Doctor.jsx";
import CreateDoctorForm from "./components/Admin/Doctors/Create/CreateDoctorForm.jsx";
import UpdateDoctorForm from "./components/Admin/Doctors/Update/UpdateDoctorForm.jsx";
import MedicalRecord from "./components/Admin/MedicalRecord/MedicalRecord.jsx";
import CreateMedicalRecordForm from "./components/Admin/MedicalRecord/Create/CreateMedicalRecordForm.jsx";
import UpdateMedicalRecordForm from "./components/Admin/MedicalRecord/Update/UpdateMedicalRecordForm.jsx";

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

          { path: "roles", element: <Role /> },
          { path: "roles/create", element: <CreateRoleForm /> },
          { path: "roles/:id/update", element: <UpdateRoleForm /> },

          { path: "users", element: <User /> },
          { path: "users/create", element: <CreateUserForm /> },
          { path: "users/:id/update", element: <UpdateUserForm /> },

          { path: "doctors", element: <Doctor /> },
          { path: "doctors/create", element: <CreateDoctorForm /> },
          { path: "doctors/:id/update", element: <UpdateDoctorForm /> },

          { path: "medical-records", element: <MedicalRecord /> },
          { path: "medical-records/create", element: <CreateMedicalRecordForm /> },
          { path: "medical-records/:id/update", element: <UpdateMedicalRecordForm /> },
        ],
      },
    ],
  },
]);
