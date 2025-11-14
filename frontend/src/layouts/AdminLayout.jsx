import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

        <nav className="space-y-2">
          <Link to="/admin" className="block hover:text-blue-400">Dashboard</Link>
          <Link to="/admin/users" className="block hover:text-blue-400">Manage Users</Link>
          <Link to="/admin/leads" className="block hover:text-blue-400">Manage Leads</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 bg-gray-100">
        <Outlet />  {/* Child pages appear here */}
      </main>
    </div>
  );
}
