export interface TimeEntry {
  id: number;
  user_id: number;
  task_id: number;
  project_id: number;
  start_time: string;
  end_time: string;
  duration: number; // in seconds or minutes, depending on your system
  note?: string;
  created_at?: string;
  updated_at?: string;
}