import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [role, setRole] = useState("ADMIN");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    companyId: "",
    managerId: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...formData, role };

    // Cleanup unused fields
    if (role === "ADMIN") {
      delete payload.companyId;
      delete payload.managerId;
    }
    if (role === "MANAGER") {
      delete payload.companyName;
      delete payload.managerId;
    }
    if (role === "SALES") {
      delete payload.companyName;
    }

    try {
      await register(payload);
      toast.success("Registration successful!");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Role Selection */}
          <div>
            <label className="block mb-1 font-medium">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="SALES">Sales</option>
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              name="name"
              className="w-full border px-3 py-2 rounded-lg"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border px-3 py-2 rounded-lg"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              className="w-full border px-3 py-2 rounded-lg"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* ADMIN → Requires Company Name */}
          {role === "ADMIN" && (
            <div>
              <label className="block mb-1 font-medium">Company Name</label>
              <input
                type="text"
                name="companyName"
                className="w-full border px-3 py-2 rounded-lg"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* MANAGER → Requires Existing Company ID */}
          {role === "MANAGER" && (
            <div>
              <label className="block mb-1 font-medium">Company ID</label>
              <input
                type="text"
                name="companyId"
                className="w-full border px-3 py-2 rounded-lg"
                value={formData.companyId}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* SALES → Requires Company ID + Manager ID */}
          {role === "SALES" && (
            <>
              <div>
                <label className="block mb-1 font-medium">Company ID</label>
                <input
                  type="text"
                  name="companyId"
                  className="w-full border px-3 py-2 rounded-lg"
                  value={formData.companyId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Manager ID</label>
                <input
                  type="text"
                  name="managerId"
                  className="w-full border px-3 py-2 rounded-lg"
                  value={formData.managerId}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-medium">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
