import { createBrowserRouter } from "react-router";
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

// Router configuration for Nurse Home Admin Dashboard

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
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
]);
