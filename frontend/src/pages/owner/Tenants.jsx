import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function OwnerTenants() {
  const [tenants, setTenants] = useState([]);
  const [form, setForm] = useState({ name: '', domain: '', settings: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/owner/tenants');
      setTenants(res.data);
    } catch (err) {
      setError('Error fetching tenants');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/owner/tenants', form);
      fetchTenants();
      setForm({ name: '', domain: '', settings: '' });
    } catch (err) {
      setError('Error adding tenant');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tenant?')) return;
    setLoading(true);
    try {
      await axios.delete(`/api/owner/tenants/${id}`);
      fetchTenants();
    } catch (err) {
      setError('Error deleting tenant');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Multi-Tenancy</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Tenant Name" className="input" required />
          <input name="domain" value={form.domain} onChange={handleChange} placeholder="Domain" className="input" required />
          <input name="settings" value={form.settings} onChange={handleChange} placeholder="Settings (JSON)" className="input" />
        </div>
        <button type="submit" className="mt-4 btn btn-primary" disabled={loading}>Add Tenant</button>
      </form>
      <ul className="bg-white shadow rounded p-4">
        {tenants.length === 0 && <li>No tenants found.</li>}
        {tenants.map(t => (
          <li key={t._id} className="mb-4 p-3 border rounded flex justify-between items-center">
            <div>
              <span className="font-semibold">{t.name}</span> - <span>{t.domain}</span>
            </div>
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(t._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
