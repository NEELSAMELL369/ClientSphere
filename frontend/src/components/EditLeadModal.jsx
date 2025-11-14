import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { editLead } from "../redux/slices/leadsSlice";
import { useAuth } from "../context/AuthContext";

const EditLeadModal = ({ lead, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user, users } = useAuth();

  const [formData, setFormData] = useState({
    title: lead.title,
    email: lead.email,
    phone: lead.phone,
    status: lead.status,
    ownerId: lead.ownerId || user.id,
  });

  useEffect(() => {
    if (lead) {
      setFormData({
        title: lead.title,
        email: lead.email,
        phone: lead.phone,
        status: lead.status,
        ownerId: lead.ownerId || user.id,
      });
    }
  }, [lead, user.id]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(editLead({ id: lead.id, data: formData })).unwrap();
      onClose();
    } catch (err) {
      console.error("Failed to update lead:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Edit Lead</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="NEW">NEW</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="CONVERTED">CONVERTED</option>
              <option value="LOST">LOST</option>
            </select>
          </div>

          {user.role !== "SALES" && (
            <div>
              <label className="block font-medium mb-1">Owner</label>
              <select
                name="ownerId"
                value={formData.ownerId}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value={user.id}>Self ({user.name})</option>
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
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditLeadModal;
