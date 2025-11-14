import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ roles = [] }) {
  const { user, loading, isAuthenticated, initializeUser } = useAuth();

  // Run once after mount to fetch user if not initialized
  useEffect(() => {
    if (!user && !loading) {
      initializeUser();
    }
  }, [user, loading, initializeUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (roles.length && !roles.includes(user?.role)) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h2 className="text-2xl font-semibold text-red-500">Access Denied</h2>
        <p className="text-gray-600 mt-2">
          You don’t have permission to view this page.
        </p>
      </div>
    );
  }

  return <Outlet />;
}
