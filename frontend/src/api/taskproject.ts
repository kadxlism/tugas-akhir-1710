import axios from "@/services/axios";
import { TaskPayload } from "@/types/task";

export const fetchTasks = async (projectId: number) => {
  return axios.get(`/api/projects/${projectId}/tasks`);
};

export const createTask = async (projectId: number, data: TaskPayload) => {
  return axios.post(`/api/projects/${projectId}/tasks`, data);
};
