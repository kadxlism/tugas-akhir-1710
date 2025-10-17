// contexts/NotificationContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

type Notification = {
  id: number;
  message: string;
  read: boolean;
};

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (message: string) => void;
  markAsRead: (id: number) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be used inside NotificationProvider");
  return ctx;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string) => {
    setNotifications((prev) => [
      ...prev,
      { id: Date.now(), message, read: false },
    ]);
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
