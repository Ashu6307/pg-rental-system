// AdminTenants.jsx
// Industry-level admin multi-tenancy management page
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminTenants() {
  const [tenants, setTenants] = useState([]);
  const [form, setForm] = useState({ name: '', owner: '', settings: {} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/tenants');
      setTenants(res.data.tenants);
    } catch (err) {
      setError('Failed to fetch tenants');
    }
    setLoading(false);
  };

  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/tenants/create', form);
      setSuccess('Tenant created');
      fetchTenants();
    } catch (err) {
      setError('Failed to create tenant');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Admin Multi-Tenancy Management</h2>
      <form onSubmit={handleCreate} className="mb-6 flex gap-4 flex-wrap items-end">
        <input type="text" name="name" value={form.name} onChange={handleFormChange} placeholder="Tenant Name" className="p-2 border rounded" />
        <input type="text" name="owner" value={form.owner} onChange={handleFormChange} placeholder="Owner ID" className="p-2 border rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-500 mb-2">{success}</div>}
      {loading ? <div>Loading...</div> : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Owner</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Created At</th>
              <th className="border px-2 py-1">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map(t => (
              <tr key={t._id}>
                <td className="border px-2 py-1">{t.name}</td>
                <td className="border px-2 py-1">{t.owner?.email || t.owner?._id}</td>
                <td className="border px-2 py-1">{t.status}</td>
                <td className="border px-2 py-1">{new Date(t.createdAt).toLocaleString()}</td>
                <td className="border px-2 py-1">{new Date(t.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
