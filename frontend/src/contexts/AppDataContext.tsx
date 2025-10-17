import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";

export type Client = { 
  id: number; 
  company_name: string; 
  owner: string; 
  phone: string; 
  package: string; 
  deadline: string; 
  dp: string; 
};
export type User = { id: number; name: string; email: string };
export type Project = {
  created_at: string; id: number; name: string; clientId: number 
};
export type Task = {
  id: number;
  title: string;
  due_date: string;
  status: "todo" | "inprogress" | "done";
  paket: string;
  assignedUserId: string;
  description: string;
};
export type Assignment = { userId: number; projectId: number };
export type TimeLog = { id: number; taskId: number; userId: number; minutes: number; date: string };

type AppData = {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  timeLogs: TimeLog[];
  setTimeLogs: React.Dispatch<React.SetStateAction<TimeLog[]>>;
};

const AppDataContext = createContext<AppData | undefined>(undefined);

export const AppDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    // Load tasks
    const storedTasks = localStorage.getItem('tasks_data');
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks);
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error parsing stored tasks:', error);
      }
    }

    // Load clients
    const storedClients = localStorage.getItem('clients_data');
    if (storedClients) {
      try {
        const parsedClients = JSON.parse(storedClients);
        setClients(parsedClients);
      } catch (error) {
        console.error('Error parsing stored clients:', error);
      }
    }

    // Load projects
    const storedProjects = localStorage.getItem('projects_data');
    if (storedProjects) {
      try {
        const parsedProjects = JSON.parse(storedProjects);
        setProjects(parsedProjects);
      } catch (error) {
        console.error('Error parsing stored projects:', error);
      }
    }

    // Load users
    const storedUsers = localStorage.getItem('users_data');
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        setUsers(parsedUsers);
      } catch (error) {
        console.error('Error parsing stored users:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('tasks_data', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('clients_data', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('projects_data', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('users_data', JSON.stringify(users));
  }, [users]);

  return (
    <AppDataContext.Provider
      value={{
        clients, setClients,
        users, setUsers,
        projects, setProjects,
        tasks, setTasks,
        assignments, setAssignments,
        timeLogs, setTimeLogs,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
};
