import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function ManagerLayout() {
  const { logout } = useAuth();
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Manager Panel</h2>

        <nav className="space-y-2">
          <Link to="/manager" className="block hover:text-blue-300">
            Dashboard
          </Link>
          <Link to="/manager/team" className="block hover:text-blue-300">
            Team Performance
          </Link>
          <Link to="/manager/leads" className="block hover:text-blue-300">
            Leads Overview
          </Link>
          <Link to="/manager/activities" className="block hover:text-blue-300">
            Activities
          </Link>
          <Link
            to="/login"
            className="block hover:text-blue-400"
            onClick={logout}
          >
            Logout
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
