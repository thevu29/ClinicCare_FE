import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Error from "../components/Error/Error.jsx";
import NotFound from "../components/Error/NotFound.jsx";
import UserPage from "../components/UserPage/UserPage.jsx";
import Dashboard from "../components/Admin/Dashboard/Dashboard.jsx";
import Admin from "../components/Admin/Admin.jsx";
import Promotion from "../components/Admin/Promotion/Promotion.jsx";
import CreatePromotionForm from "../components/Admin/Promotion/Create/CreatePromotionForm.jsx";
import UpdatePromotionForm from "../components/Admin/Promotion/Update/UpdatePromotionForm.jsx";
import Service from "../components/Admin/Service/Service.jsx";
import CreateServiceForm from "../components/Admin/Service/Create/CreateServiceForm.jsx";
import UpdateServiceForm from "../components/Admin/Service/Update/UpdateServiceForm.jsx";
import User from "../components/Admin/User/User.jsx";
import CreateUserForm from "../components/Admin/User/Create/CreateUserForm.jsx";
import UpdateUserForm from "../components/Admin/User/Update/UpdateUserForm.jsx";
import Role from "../components/Admin/Role/Role.jsx";
import UpdateRoleForm from "../components/Admin/Role/Update/UpdateRoleForm.jsx";
import CreateRoleForm from "../components/Admin/Role/Create/CreateRoleForm.jsx";
import PaymentPage from "../components/UserPage/Payment/PaymentPage.jsx";
import PaymentReturn from "../components/UserPage/Payment/PaymentReturn.jsx";
import Doctor from "../components/Admin/Doctor/Doctor.jsx";
import CreateDoctorForm from "../components/Admin/Doctor/Create/CreateDoctorForm.jsx";
import UpdateDoctorForm from "../components/Admin/Doctor/Update/UpdateDoctorForm.jsx";
import MedicalRecord from "../components/Admin/MedicalRecord/MedicalRecord.jsx";
import CreateMedicalRecordForm from "../components/Admin/MedicalRecord/Create/CreateMedicalRecordForm.jsx";
import UpdateMedicalRecordForm from "../components/Admin/MedicalRecord/Update/UpdateMedicalRecordForm.jsx";
import Feedback from "../components/Admin/Feedback/Feedback.jsx";
import Schedule from "../components/Admin/Schedule/Schedule.jsx";
import CreateScheduleForm from "../components/Admin/Schedule/Create/CreateScheduleForm.jsx";
import AutoCreateScheduleForm from "../components/Admin/Schedule/Create/AutoCreateScheduleForm.jsx";
import UpdateScheduleForm from "../components/Admin/Schedule/Update/UpdateScheduleForm.jsx";
import Appointment from "../components/Admin/Appointment/Appointment.jsx";
import Payment from "../components/Admin/Payment/Payment.jsx";
import CreatePaymentForm from "../components/Admin/Payment/Create/CreatePaymentForm.jsx";
import Login from "../components/Auth/Login/Login.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import Home from "../components/UserPage/Home/Home.jsx";
import Register from "../components/Auth/Register/Register.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <UserPage />,
        children: [
          { index: true, element: <Home /> },
          { path: "payment", element: <PaymentPage /> },
          { path: "payment-return", element: <PaymentReturn /> },
        ],
      },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      {
        path: "admin",
        element: (
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        ),
        children: [
          { index: true, element: <Dashboard /> },

          // Roles
          { path: "roles", element: <Role /> },
          { path: "roles/create", element: <CreateRoleForm /> },
          { path: "roles/:id/update", element: <UpdateRoleForm /> },

          // Promotions
          { path: "promotions", element: <Promotion /> },
          { path: "promotions/create", element: <CreatePromotionForm /> },
          { path: "promotions/:id/update", element: <UpdatePromotionForm /> },

          // Services
          { path: "services", element: <Service /> },
          { path: "services/create", element: <CreateServiceForm /> },
          { path: "services/:id/update", element: <UpdateServiceForm /> },

          // Users
          { path: "users", element: <User /> },
          { path: "users/create", element: <CreateUserForm /> },
          { path: "users/:id/update", element: <UpdateUserForm /> },

          // Doctors
          { path: "doctors", element: <Doctor /> },
          { path: "doctors/create", element: <CreateDoctorForm /> },
          { path: "doctors/:id/update", element: <UpdateDoctorForm /> },

          // Medical Records
          { path: "medical-records", element: <MedicalRecord /> },
          {
            path: "medical-records/create",
            element: <CreateMedicalRecordForm />,
          },
          {
            path: "medical-records/:id/update",
            element: <UpdateMedicalRecordForm />,
          },

          // Feedbacks
          { path: "feedbacks", element: <Feedback /> },

          // Schedules
          { path: "schedules", element: <Schedule /> },
          { path: "schedules/create", element: <CreateScheduleForm /> },
          {
            path: "schedules/auto-create",
            element: <AutoCreateScheduleForm />,
          },
          { path: "schedules/:id/update", element: <UpdateScheduleForm /> },

          // Appointments
          { path: "appointments", element: <Appointment /> },

          // Payments
          { path: "payments", element: <Payment /> },
          { path: "payments/create", element: <CreatePaymentForm /> },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
