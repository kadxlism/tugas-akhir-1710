import axios from '@/services/axios';
import { TimeEntry } from '@/types/time-tracker';

export const getTimeTrackers = () => axios.get<TimeEntry[]>('/time-tracker');
export const createTimeTracker = (data: Partial<TimeEntry>) => axios.post('/time-tracker', data);
export const updateTimeTracker = (id: number, data: Partial<TimeEntry>) => axios.put(`/time-tracker/${id}`, data);
export const deleteTimeTracker = (id: number) => axios.delete(`/time-tracker/${id}`);
