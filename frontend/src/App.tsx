import { useRoutes } from "react-router-dom";
import routes from "./routes";
import Sidebar from "./components/Sidebar";
import { useAuth } from "./contexts/useAuth";
import { AppDataProvider } from "./contexts/AppDataContext";
import { NotificationProvider } from "./contexts/NotificationContext"; // ✅ import notif
import { ThemeProvider } from "./contexts/ThemeContext";
import React from "react";

const App = () => {
  const element = useRoutes(routes);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <ThemeProvider>
      <NotificationProvider> {/* ✅ bungkus di sini */}
        <AppDataProvider>
          <div className="flex min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {user && <Sidebar />}
            <div className={`flex-1 ${user ? 'ml-72 p-6' : ''}`}>{element}</div>
          </div>
        </AppDataProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
