import React, { useState, useMemo } from "react";
import { useAppData } from "@/contexts/AppDataContext";

type FilterType = "all" | "day" | "month" | "year";

const TaskStatusCard: React.FC = () => {
  const { tasks } = useAppData();
  const [filter, setFilter] = useState<FilterType>("all");
  const now = new Date();

  const filteredTasks = useMemo(() => {
    return Array.isArray(tasks) ? tasks.filter((task) => {
      const created = new Date(task.due_date);

      if (filter === "day") {
        return (
          created.getDate() === now.getDate() &&
          created.getMonth() === now.getMonth() &&
          created.getFullYear() === now.getFullYear()
        );
      }
      if (filter === "month") {
        return (
          created.getMonth() === now.getMonth() &&
          created.getFullYear() === now.getFullYear()
        );
      }
      if (filter === "year") {
        return created.getFullYear() === now.getFullYear();
      }
      return true;
    }) : [];
  }, [tasks, filter]);

  const activeCount = useMemo(() => {
    return filteredTasks.filter((task) => {
      const today = new Date();
      const dueDate = new Date(task.due_date);
      
      return (task.status === "todo" || task.status === "inprogress") && dueDate >= today;
    }).length;
  }, [filteredTasks]);

  const completedCount = useMemo(() => {
    return filteredTasks.filter((task) => task.status === "done").length;
  }, [filteredTasks]);

  const overdueCount = useMemo(() => {
    return filteredTasks.filter((task) => {
      const today = new Date();
      const dueDate = new Date(task.due_date);
      
      return (task.status === "todo" || task.status === "inprogress") && dueDate < today;
    }).length;
  }, [filteredTasks]);

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold bg-black dark:from-white dark:to-blue-200 bg-clip-text text-transparent">Status Tugas</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Progress dan status tugas</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6">
        <div className="flex flex-wrap gap-2">
          {(["all", "day", "month", "year"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm rounded-xl transition-all duration-200 ${
                filter === f
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              }`}
            >
              {f === "all"
                ? "Semua"
                : f === "day"
                ? "Hari ini"
                : f === "month"
                ? "Bulan ini"
                : "Tahun ini"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="group flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-blue-100 dark:border-gray-600 hover:shadow-md transition-all duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Aktif</span>
          </div>
          <span className="text-2xl font-bold bg-blue-600 bg-clip-text text-transparent">{activeCount}</span>
        </div>
        <div className="group flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-emerald-100 dark:border-gray-600 hover:shadow-md transition-all duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Selesai</span>
          </div>
          <span className="text-2xl font-bold bg-green-600 bg-clip-text text-transparent">{completedCount}</span>
        </div>
        <div className="group flex justify-between items-center p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-red-100 dark:border-gray-600 hover:shadow-md transition-all duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Terlambat</span>
          </div>
          <span className="text-2xl font-bold bg-red-600 bg-clip-text text-transparent">{overdueCount}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskStatusCard;
