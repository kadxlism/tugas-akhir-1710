import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import { useAppData } from "@/contexts/AppDataContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import TopQuickActions from "@/components/dashboard/TopQuickActions";
import ProjectOverview, { Project } from "@/components/dashboard/ProjectOverview";
import ProgressProject, { ProjectProgress } from "@/components/dashboard/ProgressProject";
import CompanyFactsChart from "@/components/dashboard/CompanyFactsCharts";
import StatisticsChart from "@/components/dashboard/StatisticsCharts";
import ProjectCount from "@/components/dashboard/ProjectCount";
import TaskStatusCard from "@/components/dashboard/TaskStatusCard";
import ClientStatusCard from "@/components/dashboard/ClientStatusCard";
import TotalDataCard from "@/components/dashboard/TotalDataCard";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Stats {
  clients: number;
  projects: number;
  tasks: number;
}

const Dashboard = () => {
  const { clients, projects, tasks } = useAppData();
  const navigate = useNavigate();
  const { logout } = useAuth();


  const chartData = useMemo(
    () => ({
      labels: ["Clients", "Projects", "Tasks"],
      datasets: [
        {
          data: [clients.length, projects.length, tasks.length],
          backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
          borderWidth: 2,
          borderColor: "#ffffff",
        },
      ],
    }),
    [clients, projects, tasks]
  );

  const companyFacts = {
    month: "Jan Feb Mar Apr",
    values: [
      { label: "Company Profil", data: [120, 180, 260, 320], color: "#10b981" },
      { label: "Logo", data: [80, 160, 140, 200], color: "#3b82f6" },
      { label: "San Francisco", data: [60, 140, 220, 300], color: "#f59e0b" },
    ],
  };

  const projectProgress: ProjectProgress[] = projects.slice(0, 3).map((proj, idx) => ({
    id: proj.id,
    name: proj.name ?? `Project ${idx + 1}`,
    progress: Math.floor(Math.random() * 100),
  }));

  // Hitung statistik tugas untuk StatisticsChart
  const taskStats = useMemo(() => {
    let active = 0;
    let completed = 0;
    let overdue = 0;

    tasks.forEach((task) => {
      const today = new Date();
      const dueDate = new Date(task.due_date);
      
      if (task.status === "done") {
        completed++;
      } else if (task.status === "todo" || task.status === "inprogress") {
        if (dueDate < today) {
          overdue++;
        } else {
          active++;
        }
      }
    });

    return { active, completed, overdue };
  }, [tasks]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-white to-blue-100  rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-black dark:from-white dark:via-blue-200 dark:to-yellow-400 bg-clip-text text-transparent">
                Dashboard Overview
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Ringkasan lengkap data sistem Anda</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
        >
          <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>

   

      {/* Quick Actions */}
      <TopQuickActions />


      {/* Grid Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <TotalDataCard />
          <ProgressProject projects={projectProgress} />
          <CompanyFactsChart data={companyFacts} />
        </div>

        <div className="space-y-6">
          <TaskStatusCard />
          <StatisticsChart stats={taskStats} />
        </div>

        <div className="space-y-6">
          <ClientStatusCard />
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-indigo-800 dark:from-white dark:to-indigo-200 bg-clip-text text-transparent">
                Project Overview
              </h3>
            </div>
            <div className="max-w-xs mx-auto">
              <Doughnut 
                data={chartData} 
                options={{
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                          size: 12,
                          weight: '500'
                        }
                      }
                    }
                  },
                  cutout: '60%',
                  maintainAspectRatio: true
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
