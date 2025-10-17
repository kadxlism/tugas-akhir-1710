import { useState, useEffect } from "react";
import { useAppData } from "@/contexts/AppDataContext";
import { useAuth } from "@/contexts/useAuth";
import { getTasks, createTask, updateTask, updateTaskStatus } from "@/api/alltasks";
import { useNotification } from "@/contexts/NotificationContext"; // ✅ notifikasi
import TinyMCE from "@/components/TinyMCE";

const emptyForm = {
  title: "",
  due_date: "",
  status: "todo",
  paket: "",
  assigned_to: undefined as number | undefined,
  description: ""
};

const TaskTable = () => {
  const { tasks, setTasks } = useAppData();
  const { user } = useAuth();
  const { addNotification } = useNotification(); // ✅ akses notifikasi
  const [assignees, setAssignees] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<any>(emptyForm);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<any>(null);

  useEffect(() => {
    getTasks().then(res => setTasks(res.data)).catch(() => {});
    if (user && (user.role === 'admin' || user.role === 'customer_service')) {
      import('@/services/axios').then(({ default: ax }) => {
        ax.get('/admin/users').then(r => setAssignees(r.data)).catch(() => {});
      });
    }
  }, [setTasks, user]);

  const handleAdd = () => {
    setEditTask(null);
    setForm(emptyForm);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDetail = (task: any) => {
    setEditTask(task);
    setForm({
      title: task.title,
      due_date: task.due_date,
      status: task.status,
      paket: String(task.paket),
      assigned_to: task.assigned_to ?? undefined,
      description: task.description || "",
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditToggle = (task?: any) => {
    if (task) {
      setEditTask(task);
      setForm({
        title: task.title,
        due_date: task.due_date,
        status: task.status,
        paket: String(task.paket),
        assigned_to: task.assigned_to ?? undefined,
        description: task.description || "",
      });
    }
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setTaskToDelete(task);
      setShowDeleteConfirm(true);
    }
  };

  const markDone = async (task: any) => {
    try {
      const res = await updateTaskStatus(task.id, 'done');
      setTasks(tasks.map(t => t.id === task.id ? res.data : t));
      addNotification(`Tugas "${task.title}" ditandai selesai ✅`);
    } catch {
      addNotification('Gagal mengubah status tugas');
    }
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      setTasks(tasks.filter((t) => t.id !== taskToDelete.id));
      addNotification(`Tugas "${taskToDelete.title}" berhasil dihapus ✅`);
      setShowDeleteConfirm(false);
      setTaskToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setTaskToDelete(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editTask) {
        const res = await updateTask(editTask.id, {
          title: form.title,
          description: form.description,
          status: form.status,
          due_date: form.due_date,
          priority: 'medium',
          assigned_to: form.assigned_to ?? null,
        });
        setTasks(tasks.map((t) => (t.id === editTask.id ? res.data : t)));
        addNotification(`Tugas "${form.title}" berhasil diperbarui ✅`);
      } else {
        const res = await createTask({
          title: form.title,
          description: form.description,
          status: form.status,
          due_date: form.due_date,
          project_id: 1,
          assigned_to: form.assigned_to ?? null,
          priority: 'medium'
        });
        setTasks([res.data, ...tasks]);
        addNotification(`Tugas baru ditambahkan: "${form.title}" 📌`);
      }
    } catch (err) {
      addNotification('Gagal menyimpan tugas');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      {/* Delete Confirmation Toast */}
      {showDeleteConfirm && taskToDelete && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white border border-gray-200 text-gray-800 px-8 py-6 rounded-2xl shadow-2xl text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Konfirmasi Hapus</h3>
          <p className="text-gray-600 mb-6">Yakin ingin menghapus tugas "{taskToDelete.title}"?</p>
          <div className="flex space-x-3 justify-center">
            <button
              onClick={cancelDelete}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl transition-colors"
            >
              Hapus
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-white to-blue-100 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tabel Tugas</h2>
            <p className="text-gray-600">Kelola dan pantau semua tugas</p>
          </div>
        </div>
        {user && (user.role === 'admin' || user.role === 'customer_service') && (
        <button
          onClick={handleAdd}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Tambahkan Tugas</span>
        </button>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-700">
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Judul
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Paket
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Pengguna yang Ditugaskan
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-white uppercase tracking-wider">
                  Tindakan
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-lg">Belum ada tugas</p>
                      <p className="text-gray-400">Klik "Tambahkan Tugas" untuk membuat tugas pertama</p>
                    </div>
                  </td>
                </tr>
              ) : (
                tasks.map((task, index) => (
                  <tr key={task.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{task.title}</div>
                          <div className="text-sm text-gray-500">ID: {task.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300">
                        {task.paket}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-white to-blue-100 rounded-full flex items-center justify-center mr-2">
                          <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-900 capitalize">{task.assignee?.name || "-"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleDetail(task)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>Detil</span>
                        </button>
                        {(user && (user.role === 'admin' || user.role === 'customer_service')) && (
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Hapus</span>
                        </button>
                        )}
                        {user && user.id === task.assigned_to && task.status !== 'done' && (
                        <button
                          onClick={() => markDone(task)}
                          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Tandai Selesai</span>
                        </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {isEditing ? (editTask ? "Edit Tugas" : "Tambah Tugas") : "Detail Tugas"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {isEditing ? "Ubah informasi tugas" : "Lihat detail tugas"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Tugas</label>
                  <input
                    type="text"
                    placeholder="Masukkan judul tugas"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
                  <TinyMCE
                    value={form.description}
                    onChange={(content) => setForm({ ...form, description: content })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Jatuh Tempo</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={form.due_date}
                      onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <select
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                      <option value="todo">Belum Dikerjakan</option>
                      <option value="in_progress">Sedang Dalam Proses</option>
                      <option value="done">Selesai</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Paket</label>
                  <select
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={form.paket}
                      onChange={(e) => setForm({ ...form, paket: e.target.value })}
                      required
                    >
                      <option value="">Pilih Paket</option>
                      <option value="startup">Startup</option>
                      <option value="business">Business</option>
                      <option value="enterprise">Enterprise</option>
                      <option value="elite">Elite</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pengguna yang Ditugaskan</label>
                    <select
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={form.assigned_to ?? ''}
                      onChange={(e) => setForm({ ...form, assigned_to: e.target.value ? Number(e.target.value) : undefined })}
                    >
                      <option value="">Pilih User</option>
                      {assignees.map(u => (
                        <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Simpan</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-500 mb-1">Judul</label>
                      <p className="text-lg font-medium text-gray-900">{form.title}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-500 mb-1">Tanggal Jatuh Tempo</label>
                      <p className="text-gray-900">{form.due_date}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-500 mb-1">Status</label>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        form.status === 'done' ? 'bg-green-100 text-green-800' :
                        form.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {form.status === 'done' ? 'Selesai' :
                         form.status === 'in_progress' ? 'Sedang Dalam Proses' :
                         'Belum Dikerjakan'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-500 mb-1">Paket</label>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                        {form.paket}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-500 mb-1">Pengguna yang Ditugaskan</label>
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-2">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span className="text-gray-900 capitalize">{form.assignedUserId}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-2">Deskripsi</label>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div
                      className="prose prose-sm max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: form.description || 'Tidak ada deskripsi' }}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleEditToggle(editTask)}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTable;
