import axiosInstance from "./axiosInstance";
import API from "./apiRoutes";

// -------------------- LEADS SERVICE --------------------

// Get all leads
export const getLeads = () => {
  return axiosInstance.get(API.leads.getAll);
};

// Get lead by ID
export const getLeadById = (id) => {
  return axiosInstance.get(API.leads.getById(id));
};

// Create a new lead
export const createLead = (data) => {
  return axiosInstance.post(API.leads.create, data);
};

// Update a lead by ID
export const updateLead = (id, data) => {
  return axiosInstance.put(API.leads.update(id), data);
};

// Delete a lead by ID
export const deleteLead = (id) => {
  return axiosInstance.delete(API.leads.delete(id));
};
