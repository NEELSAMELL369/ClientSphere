import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute Component
 * - Checks if user is authenticated
 * - Optionally checks user role
 * - Redirects to /login if not authenticated
 */
export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading, isAuthenticated } = useAuth();

  // Wait for authentication check
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">Checking authentication...</p>
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role-based protection
  if (roles.length > 0 && !roles.includes(user?.role)) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h2 className="text-2xl font-semibold text-red-500">Access Denied</h2>
        <p className="text-gray-600 mt-2">
          You don’t have permission to view this page.
        </p>
      </div>
    );
  }

  // Authorized → render child component
  return children;
}
