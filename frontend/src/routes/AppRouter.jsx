import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../utils/ProtectedRoute";
import { useAuth } from "../context/AuthContext";

// Public
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import NotFound from "../pages/NotFound";

// Layouts
import AdminLayout from "../layouts/AdminLayout";
import ManagerLayout from "../layouts/ManagerLayout";
import SalesLayout from "../layouts/SalesLayout";

// Admin
import AdminDashboard from "../pages/admin/AdminDashboard";

// Manager
import ManagerDashboard from "../pages/manager/ManagerDashboard";

// Sales
import SalesDashboard from "../pages/sales/SalesDashboard";

export default function AppRouter() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* ---------- PUBLIC ROUTES ---------- */}
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <Login />
          ) : (
            <Navigate to={`/${user?.role.toLowerCase()}`} />
          )
        }
      />

      <Route
        path="/register"
        element={
          !isAuthenticated ? (
            <Register />
          ) : (
            <Navigate to={`/${user?.role.toLowerCase()}`} />
          )
        }
      />

      {/* ---------- ADMIN ROUTES ---------- */}
      <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
        </Route>
      </Route>

      {/* ---------- MANAGER ROUTES ---------- */}
      <Route element={<ProtectedRoute roles={["MANAGER"]} />}>
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<ManagerDashboard />} />
        </Route>
      </Route>

      {/* ---------- SALES ROUTES ---------- */}
      <Route element={<ProtectedRoute roles={["SALES"]} />}>
        <Route path="/sales" element={<SalesLayout />}>
          <Route index element={<SalesDashboard />} />
        </Route>
      </Route>

      {/* ---------- ROOT REDIRECT ---------- */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={`/${user?.role.toLowerCase()}`} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* ---------- NOT FOUND ---------- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
