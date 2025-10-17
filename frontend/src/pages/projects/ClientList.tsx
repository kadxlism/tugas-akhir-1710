import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "@/services/axios";
import { useAppData, Client } from "@/contexts/AppDataContext";

const ClientList = () => {
  const { clients, setClients } = useAppData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  // Fungsi untuk menampilkan toast notification
  const showToastNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000); // Auto dismiss setelah 3 detik
  };

  const [form, setForm] = useState<Client>({
    id: 0,
    company_name: "",
    owner: "",
    phone: "",
    package: "",
    deadline: "",
    dp: "",
  });

  // Load clients from API on mount (admin/customer_service)
  useEffect(() => {
    axios
      .get('/clients')
      .then((res) => {
        if (Array.isArray(res.data)) setClients(res.data);
      })
      .catch(() => {});
  }, [setClients]);

  // ✅ pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(clients.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const currentClients = clients.slice(startIndex, startIndex + rowsPerPage);

  const handleAdd = () => {
    setEditClient(null);
    setForm({
      id: 0,
      company_name: "",
      owner: "",
      phone: "",
      package: "",
      deadline: "",
      dp: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (client: Client) => {
    setEditClient(client);
    setForm(client);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const client = clients.find((c) => c.id === id);
    if (client) {
      setClientToDelete(client);
      setShowDeleteConfirm(true);
    }
  };

  const confirmDelete = () => {
    if (clientToDelete) {
      setClients((prev) => prev.filter((c) => c.id !== clientToDelete.id));
      showToastNotification("Data klien berhasil dihapus!");
      setShowDeleteConfirm(false);
      setClientToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setClientToDelete(null);
  };

  // Validasi tanggal deadline
  const validateDeadline = (date: string) => {
    const today = new Date();
    const deadline = new Date(date);
    today.setHours(0, 0, 0, 0); // Reset time untuk perbandingan yang akurat

    if (deadline < today) {
      alert("⚠️ Tanggal deadline tidak boleh sebelum hari ini!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi deadline
    if (!validateDeadline(form.deadline)) {
      return;
    }

    try {
      if (editClient) {
        const res = await axios.put(`/clients/${editClient.id}`, form);
        setClients((prev) => prev.map((c) => (c.id === editClient.id ? res.data : c)));
        showToastNotification("Data klien berhasil diperbarui!");
      } else {
        const res = await axios.post("/clients", form);
        setClients((prev) => [res.data, ...prev]);
        setPage(1);
        showToastNotification("Data klien berhasil tersimpan!");
      }
    } catch (error) {
      console.log("API error:", error);
    } finally {
      setIsModalOpen(false);
      setEditClient(null);
    }
  };

  // EXPORT EXCEL
  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(clients);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
    XLSX.writeFile(workbook, "clients.xlsx");
  };

  // IMPORT EXCEL
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const importedData: any[] = XLSX.utils.sheet_to_json(sheet);

      const newClients: Client[] = importedData.map((row: any, idx) => ({
        id: Date.now() + idx,
        company_name: row.company_name || "",
        owner: row.owner || "",
        phone: row.phone || "",
        category: row.category || "",
        package: row.package || "",
        deadline: row.deadline || "",
        dp: row.dp || "",
        paid: row.paid || "",
      }));

      setClients((prev) => [...newClients, ...prev]); // taruh di atas
      setPage(1); // balik ke page 1
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="p-6">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 backdrop-blur-sm border border-white/20">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Toast */}
      {showDeleteConfirm && clientToDelete && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white border border-gray-200 text-gray-800 px-8 py-6 rounded-2xl shadow-2xl text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Konfirmasi Hapus</h3>
          <p className="text-gray-600 mb-6">Yakin ingin menghapus klien "{clientToDelete.company_name}"?</p>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Klien</h2>
            <p className="text-gray-600">Kelola data klien dan informasi pembayaran</p>
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Tambahkan Klien</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-700">
                <th className="w-1/6 px-4 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Perusahaan
                </th>
                <th className="w-1/6 px-4 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Pemilik
                </th>
                <th className="w-1/6 px-4 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Telepon
                </th>
                <th className="w-1/6 px-4 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Paket
                </th>
                <th className="w-1/6 px-4 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Tenggat Waktu
                </th>
                <th className="w-1/6 px-4 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Status Pembayaran
                </th>
                <th className="w-1/6 px-4 py-4 text-center text-sm font-semibold text-white uppercase tracking-wider">
                  Tindakan
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-lg">Belum ada klien</p>
                      <p className="text-gray-400">Klik "Tambahkan Klien" untuk menambah klien pertama</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentClients.map((client, index) => (
                  <tr key={client.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="px-4 py-3 truncate">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-2 flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{client.company_name}</div>
                          <div className="text-xs text-gray-500">ID: {client.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 truncate">
                      <div className="flex items-center">
                        <div className="w-5 h-5 bg-gradient-to-br from-white to-blue-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                          <svg className="w-2.5 h-2.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-900 truncate">{client.owner}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 truncate">
                      <div className="flex items-center">
                        <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-900 truncate">{client.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300">
                        {client.package}
                      </span>
                    </td>
                    <td className="px-4 py-3 truncate">
                      <div className="flex items-center">
                        <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-900 truncate">{client.deadline}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        client.dp === 'paid' ? 'bg-green-100 text-green-800 border border-green-200' :
                        client.dp === 'down-payment' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        client.dp.includes('termin') ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {client.dp}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleEdit(client)}
                          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-2 py-1 rounded text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Sunting</span>
                        </button>
                        <button
                          onClick={() => handleDelete(client.id)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-2 py-1 rounded text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export, Import, Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Ekspor Excel</span>
          </button>

          <label className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            <span>Impor Excel</span>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Sebelumnya</span>
          </button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                  page === num
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
          >
            <span>Berikutnya</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {editClient ? "Edit Klien" : "Tambah Klien"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {editClient ? "Ubah informasi klien" : "Tambah klien baru"}
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Perusahaan</label>
                    <input
                      type="text"
                      placeholder="Masukkan nama perusahaan"
                      value={form.company_name}
                      onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pemilik</label>
                    <input
                      type="text"
                      placeholder="Masukkan nama pemilik"
                      value={form.owner}
                      onChange={(e) => setForm({ ...form, owner: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Telepon</label>
                  <input
                    type="text"
                    placeholder="Masukkan nomor telepon"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Paket</label>
                    <select
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={form.package}
                      onChange={(e) => setForm({ ...form, package: e.target.value })}
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tenggat Waktu</label>
                    <input
                      type="date"
                      value={form.deadline}
                      onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status Pembayaran</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={form.dp}
                    onChange={(e) => setForm({ ...form, dp: e.target.value })}
                    required
                  >
                    <option value="">Pilih Status Payment</option>
                    <option value="down-payment">Down Payment</option>
                    <option value="paid">Paid</option>
                    <option value="termin-1">Termin 1</option>
                    <option value="termin-2">Termin 2</option>
                    <option value="termin-3">Termin 3</option>
                    <option value="tagihan">Tagihan</option>
                  </select>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;
