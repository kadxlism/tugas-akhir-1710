import axios from '@/services/axios';
import { Client } from '@/types/client';

export const getClients = () => axios.get<Client[]>('/clients');
export const createClient = (data: Partial<Client>) => axios.post('/clients', data);
export const updateClient = (id: number, data: Partial<Client>) => axios.put(`/clients/${id}`, data);
export const deleteClient = (id: number) => axios.delete(`/clients/${id}`);
