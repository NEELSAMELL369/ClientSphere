import { Outlet, Link } from "react-router-dom";

export default function SalesLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-green-900 text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Sales Panel</h2>

        <nav className="space-y-2">
          <Link to="/sales" className="block hover:text-green-300">
            Dashboard
          </Link>
          <Link to="/sales/my-leads" className="block hover:text-green-300">
            My Leads
          </Link>
          <Link to="/sales/activities" className="block hover:text-green-300">
            My Activities
          </Link>
          <Link to="/sales/profile" className="block hover:text-green-300">
            My Profile
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
