import { useState, useEffect } from 'react';
import axios from '@/services/axios';
import { useParams, useNavigate } from 'react-router-dom';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('designer');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios.get(`/admin/users/${id}`)
        .then(res => {
          setName(res.data.name);
          setEmail(res.data.email);
          setRole(res.data.role);
        })
        .catch(err => {
          console.error('Error fetching user:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const data = {
        name,
        email,
        role,
        ...(password && { password })
      };

      if (id) {
        await axios.put(`/admin/users/${id}`, data);
      } else {
        await axios.post('/admin/users', { ...data, password });
      }
      navigate('/users');
    } catch (err: any) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setErrors({ general: 'Terjadi kesalahan saat menyimpan data' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <div className="p-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          {id ? 'Edit User' : 'Tambah User Baru'}
        </h1>

        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              required
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Masukkan email"
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                errors.role ? 'border-red-500' : 'border-gray-300'
              }`}
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="designer">Designer</option>
              <option value="copywriter">Copywriter</option>
              <option value="web_designer">Web Designer</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password {id && <span className="text-gray-500">(kosongkan jika tidak ingin mengubah)</span>}
            </label>
            <input
              type="password"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={id ? 'Password baru (opsional)' : 'Masukkan password'}
              required={!id}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed active:text-white hover:text-white transition-colors duration-200"
            >
              {loading ? 'Menyimpan...' : (id ? 'Update User' : 'Simpan User')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/users')}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 active:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 active:text-gray-800 hover:text-gray-800 transition-colors duration-200"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
