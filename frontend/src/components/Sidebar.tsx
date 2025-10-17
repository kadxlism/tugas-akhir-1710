import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

const Sidebar = () => {
  const { theme } = useTheme();
  
  return (
    <aside className={`fixed top-0 left-0 w-72 h-screen transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-b from-blue-900 via-blue-700 to-blue-900'
    } shadow-2xl border-r border-white/10`}>
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Project Manager</h2>
            <p className="text-xs text-gray-400">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        <Link 
          to="/dashboard" 
          className="group flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 hover:bg-white/10 hover:scale-105"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-white to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
            </svg>
          </div>
          <span className="text-white font-medium group-hover:text-yellow-300 transition-colors">Dasbor</span>
        </Link>

        

        <Link 
          to="/clients" 
          className="group flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 hover:bg-white/10 hover:scale-105"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-white to-blue-100  rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <span className="text-white font-medium group-hover:text-yellow-300 transition-colors">Klien</span>
        </Link>

        <Link 
          to="/tasks" 
          className="group flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 hover:bg-white/10 hover:scale-105"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-white to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <span className="text-white font-medium group-hover:text-yellow-300 transition-colors">Tugas</span>
        </Link>

        <Link 
          to="/timeline" 
          className="group flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 hover:bg-white/10 hover:scale-105"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-white to-blue-100  rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-white font-medium group-hover:text-yellow-300 transition-colors">Garis Waktu</span>
        </Link>

        {/* Pengguna */}
        <Link 
          to="/users" 
          className="group flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 hover:bg-white/10 hover:scale-105"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-white to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-medium group-hover:text-yellow-300 transition-colors">Pengguna</span>
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-medium text-white/80 bg-white/10 px-2 py-0.5 rounded-full">
              Designer · Writer · Design Web
            </span>
          </div>
        </Link>

        <Link 
          to="/settings" 
          className="group flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 hover:bg-white/10 hover:scale-105"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-white to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-white font-medium group-hover:text-yellow-300 transition-colors">Pengaturan</span>
        </Link>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <div className="flex items-center space-x-3 px-4 py-3 rounded-2xl bg-white/5">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
