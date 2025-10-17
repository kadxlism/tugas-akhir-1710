import axios from '@/services/axios';
import { Task } from '@/types/task';

export const getTasks = () => axios.get<Task[]>('/tasks');
export const createTask = (data: Partial<Task>) => axios.post('/tasks', data);
export const updateTask = (id: number, data: Partial<Task>) => axios.put(`/tasks/${id}`, data);
export const updateTaskStatus = (id: number, status: 'todo'|'in_progress'|'review'|'done') => axios.patch(`/tasks/${id}/status`, { status });
