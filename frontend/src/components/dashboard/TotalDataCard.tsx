import React, { useState, useMemo } from "react";
import { useAppData } from "@/contexts/AppDataContext";

type FilterType = "all" | "day" | "month" | "year";

const TotalDataCard: React.FC = () => {
  const { clients, projects, tasks } = useAppData();
  const [filter, setFilter] = useState<FilterType>("all");
  const now = new Date();

  const filteredData = useMemo(() => {
    const filterByDate = (dateString: string) => {
      const created = new Date(dateString);

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
    };

    return {
      clients: Array.isArray(clients) ? clients.filter(client => filterByDate(client.deadline)) : [],
      projects: Array.isArray(projects) ? projects.filter(project => filterByDate(project.created_at || new Date().toISOString())) : [],
      tasks: Array.isArray(tasks) ? tasks.filter(task => filterByDate(task.due_date)) : []
    };
  }, [clients, projects, tasks, filter]);

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold bg-black dark:from-white dark:to-blue-200 bg-clip-text text-transparent">Jumlah Data</h3>
          <p className="text-sm text-black dark:text-gray-400">Total data dalam sistem</p>
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
        <div className="group flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-blue-100 dark:border-gray-600 hover:shadow-md transition-all duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Klien</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{filteredData.clients.length}</span>
        </div>
        <div className="group flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-emerald-100 dark:border-gray-600 hover:shadow-md transition-all duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Proyek</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{filteredData.projects.length}</span>
        </div>
        <div className="group flex justify-between items-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-amber-100 dark:border-gray-600 hover:shadow-md transition-all duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Tugas</span>
          </div>
          <span className="text-2xl font-bold bg-yellow-600 bg-clip-text text-transparent">{filteredData.tasks.length}</span>
        </div>
      </div>
    </div>
  );
};

export default TotalDataCard;
