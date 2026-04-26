import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import NurseVerification from "./pages/NurseVerification";
import UsersManagement from "./pages/UsersManagement";
import ServiceRequests from "./pages/ServiceRequests";
import PaymentTransactions from "./pages/PaymentTransactions";
import ComplaintsSupport from "./pages/ComplaintsSupport";
import NotificationsAnnouncements from "./pages/NotificationsAnnouncements";
import ViewAllNotifications from "./pages/ViewAllNotifications";
import AdminManagement from "./pages/AdminManagement";
import EditProfile from "./pages/EditProfile";
import Login from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Dashboard },
      { path: "nurse-verification", Component: NurseVerification },
      { path: "users", Component: UsersManagement },
      { path: "service-requests", Component: ServiceRequests },
      { path: "payment-transactions", Component: PaymentTransactions },
      { path: "complaints", Component: ComplaintsSupport },
      { path: "notifications", Component: NotificationsAnnouncements },
      { path: "view-all-notifications", Component: ViewAllNotifications },
      { path: "admin-management", Component: AdminManagement },
      { path: "edit-profile", Component: EditProfile },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
