import React from "react";
import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { ActivitiesProvider } from "./context/ActivitiesContext";
import { NotificationProvider } from "./context/NotificationContext";

const App = () => {
  return (
    <AuthProvider>
      <ActivitiesProvider>
        <NotificationProvider>
          <AppRouter />

          {/* Global Toaster */}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#333",
                color: "#fff",
              },
              success: {
                style: {
                  background: "#22c55e",
                  color: "#fff",
                },
              },
              error: {
                style: {
                  background: "#ef4444",
                  color: "#fff",
                },
              },
            }}
          />
        </NotificationProvider>
      </ActivitiesProvider>
    </AuthProvider>
  );
};

export default App;
