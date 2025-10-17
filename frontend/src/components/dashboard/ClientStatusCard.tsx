import React, { useState, useMemo } from "react";
import { useAppData } from "@/contexts/AppDataContext";

type FilterType = "all" | "day" | "month" | "year";

const ClientStatusCard: React.FC = () => {
  const { clients } = useAppData();
  const [filter, setFilter] = useState<FilterType>("all");
  const now = new Date();

  const filteredClients = useMemo(() => {
    return Array.isArray(clients) ? clients.filter((client) => {
      const created = new Date(client.deadline);

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
  }, [clients, filter]);

  const paidCount = useMemo(() => {
    return filteredClients.filter((client) => client.dp === "paid").length;
  }, [filteredClients]);

  const pendingCount = useMemo(() => {
    return filteredClients.filter((client) => {
      const today = new Date();
      const deadline = new Date(client.deadline);
      
      return client.dp !== "paid" && deadline >= today;
    }).length;
  }, [filteredClients]);

  const overdueCount = useMemo(() => {
    return filteredClients.filter((client) => {
      const today = new Date();
      const deadline = new Date(client.deadline);
      
      return client.dp !== "paid" && deadline < today;
    }).length;
  }, [filteredClients]);

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold bg-black dark:from-white dark:to-blue-200 bg-clip-text text-transparent">Status Klien</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Status pembayaran klien</p>
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
        <div className="group flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-emerald-100 dark:border-gray-600 hover:shadow-md transition-all duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Lunas</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{paidCount}</span>
        </div>
        <div className="group flex justify-between items-center p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-amber-100 dark:border-gray-600 hover:shadow-md transition-all duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Tertunda</span>
          </div>
          <span className="text-2xl font-bold bg-amber-600 bg-clip-text text-transparent">{pendingCount}</span>
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

export default ClientStatusCard;
