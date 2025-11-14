import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const GetAllUsers = () => {
  const { users, usersLoading, usersError, fetchAllUsers } = useAuth();

  useEffect(() => {
    if (fetchAllUsers) fetchAllUsers();
  }, []);

  const usersList = Array.isArray(users) ? users : [];

  if (usersLoading) return <p className="text-center mt-4">Loading users...</p>;
  if (usersError) return <p className="text-center mt-4 text-red-500">Error: {usersError}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">All Users</h2>
      {usersList.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {usersList.map((u) => (
            <div
              key={u._id || u.id}
              className="bg-white shadow-md rounded-lg p-4 border hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                  {u.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold">{u.name}</h3>
                  <p className="text-gray-500 text-sm">{u.email}</p>
                </div>
              </div>
              <p className="text-gray-700">
                <span className="font-semibold">Role:</span> {u.role}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetAllUsers;
