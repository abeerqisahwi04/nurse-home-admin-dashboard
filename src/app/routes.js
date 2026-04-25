import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import NurseVerification from "./pages/NurseVerification";
import UsersManagement from "./pages/UsersManagement";
import ServiceRequests from "./pages/ServiceRequests";
import PaymentTransactions from "./pages/PaymentTransactions";
import ComplaintsSupport from "./pages/ComplaintsSupport";
import NotificationsAnnouncements from "./pages/NotificationsAnnouncements";
import Reports from "./pages/Reports";
import AdminManagement from "./pages/AdminManagement";
import Settings from "./pages/Settings";
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
      { path: "reports", Component: Reports },
      { path: "admin-management", Component: AdminManagement },
      { path: "settings", Component: Settings },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
