import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import {
  addLead,
  selectLoading,
  selectError,
  selectSuccessMessage,
  clearMessages,
} from "../redux/slices/leadsSlice";

const CreateLead = () => {
  const dispatch = useDispatch();
  const { user, users, fetchAllUsers } = useAuth();

  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const successMessage = useSelector(selectSuccessMessage);

  const [formData, setFormData] = useState({
    title: "",
    email: "",
    phone: "",
    status: "NEW",
    ownerId: user?.id || "", // default self
  });

  // Fetch users for dropdown (Admin / Manager)
  useEffect(() => {
    if (user?.role !== "SALES") {
      fetchAllUsers();
    }
  }, []);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => dispatch(clearMessages()), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage, dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("User not authenticated!");

    const payload = {
      ...formData,
      companyId: user.companyId,
      ownerId: formData.ownerId || user.id,
    };

    try {
      await dispatch(addLead(payload)).unwrap();
      setFormData({ title: "", email: "", phone: "", status: "NEW", ownerId: user.id });
    } catch (err) {
      console.error("Failed to create lead:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Create New Lead</h2>

      {error && <p className="text-red-500 mb-2">{typeof error === "string" ? error : error.message}</p>}
      {successMessage && <p className="text-green-500 mb-2">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="NEW">NEW</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="CONVERTED">CONVERTED</option>
            <option value="LOST">LOST</option>
          </select>
        </div>

        {/* Owner Dropdown - not visible for Sales */}
        {user?.role !== "SALES" && (
          <div>
            <label className="block mb-1 font-medium">Assign Owner</label>
            <select
              name="ownerId"
              value={formData.ownerId}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            >
              {/* Self */}
              <option value={user.id}>{user.name} (Self)</option>

              {/* Other users */}
              {users
                .filter((u) => u.id !== user.id)
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Creating..." : "Create Lead"}
        </button>
      </form>
    </div>
  );
};

export default CreateLead;
