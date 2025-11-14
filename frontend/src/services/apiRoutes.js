export const BASE_URL = "http://localhost:8080/api";

const API = {
  auth: {
    login: `${BASE_URL}/auth/login`,
    logout: `${BASE_URL}/auth/logout`,
    register: `${BASE_URL}/auth/register`,
    profile: `${BASE_URL}/auth/profile`,
    getAllUsers: `${BASE_URL}/auth/users`,
  },
  leads: {
    getAll: `${BASE_URL}/leads`,
    getById: (id) => `${BASE_URL}/leads/${id}`,
    create: `${BASE_URL}/leads`,
    update: (id) => `${BASE_URL}/leads/${id}`,
    delete: (id) => `${BASE_URL}/leads/${id}`,
  },
  activities: {
    getAll: `${BASE_URL}/activities/all`, // or `/activities` if you switch to GET
  },
  notifications: {
    getAll: `${BASE_URL}/notifications`,
    markAsRead: (id) => `${BASE_URL}/notifications/${id}/read`,
    delete: (id) => `${BASE_URL}/notifications/${id}`,
  },
};

export default API;
