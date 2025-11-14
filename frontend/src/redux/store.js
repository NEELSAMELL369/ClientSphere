import { configureStore } from "@reduxjs/toolkit";
import leadsReducer from "./slices/leadsSlice";
// import other slices when needed
// import authReducer from "./slices/authSlice";
// import notificationsReducer from "./slices/notificationsSlice";

export const store = configureStore({
  reducer: {
    leads: leadsReducer,
    // auth: authReducer,
    // notifications: notificationsReducer,
  },
  // Optional: enable redux devtools in production carefully
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
