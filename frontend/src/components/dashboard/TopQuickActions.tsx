import { FC, useState } from "react";
import { JSX } from "react";
import { useNotification } from "@/contexts/NotificationContext";
import { useNavigate } from "react-router-dom";

const ActionCard: FC<{
  title: string;
  icon: JSX.Element;
  onClick?: () => void;
  badgeCount?: number;
}> = ({ title, icon, onClick, badgeCount }) => (
  <button
    onClick={onClick}
    className="relative bg-white w-full sm:w-auto shadow-sm rounded-xl p-5 border border-transparent hover:border-gray-200 hover:shadow-md transition flex items-center gap-3 text-left"
  >
    <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 relative">
      {icon}
      {badgeCount && badgeCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {badgeCount}
        </span>
      )}
    </span>
    <span className="text-sm font-medium text-gray-700">{title}</span>
  </button>
);

interface TopQuickActionsProps {
  onCreateProject?: () => void;
}

const TopQuickActions: FC<TopQuickActionsProps> = () => {
  const { notifications, markAsRead } = useNotification();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // hitung notifikasi unread
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleClick = (n: any) => {
    // ✅ tandai notif sudah dibaca
    markAsRead(n.id);

    // ✅ navigasi ke halaman tujuan (default ke /tasks)
    if (n.path) {
      navigate(n.path);
    } else {
      navigate("/tasks");
    }

    // ✅ tutup dropdown
    setOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 relative">
      {/* Tombol Notification */}
      <ActionCard
        title="Notification"
        icon={
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5L4 18v1h16v-1l-2-2Z" />
          </svg>
        }
        badgeCount={unreadCount}
        onClick={() => setOpen(!open)}
      />

      {/* Dropdown daftar notifikasi */}
      {open && (
        <div className="eft-40 bg-whiabsolute top-0 lte shadow-lg rounded-lg space-y-2 max-h-40 overflow-y-auto pr-1 w-72z-50 p-3">
          <h3 className="font-semibold mb-2 text-sm">Pemberitahuan</h3>
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-xs">Belum ada notifikasi</p>
          ) : (
<ul className="space-y-2">
  {[...notifications].reverse().map((n) => (
    <li
      key={n.id}
      onClick={() => handleClick(n)}
      className={`p-2 rounded-md text-sm cursor-pointer ${
        n.read
          ? "bg-gray-300 text-black"
          : "bg-green-400 font-semibold text-black"
      }`}
    >
      {n.message}
    </li>
  ))}
</ul>

          )}
        </div>
      )}
    </div>
  );
};

export default TopQuickActions;
