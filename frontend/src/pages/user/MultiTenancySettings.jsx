// MultiTenancySettings.jsx
// User multi-tenancy settings page (industry-level)
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function MultiTenancySettings() {
  const [tenant, setTenant] = useState(null);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTenant();
  }, []);

  const fetchTenant = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/tenants/my');
      setTenant(res.data.tenant);
      setSettings(res.data.tenant?.settings || {});
    } catch (err) {
      setError('Failed to fetch tenant info');
    }
    setLoading(false);
  };

  const handleChange = e => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/tenants/update', { settings });
      setSuccess('Settings updated');
      fetchTenant();
    } catch (err) {
      setError('Failed to update settings');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Multi-Tenancy Settings</h2>
      {loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : tenant && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-2">
            <span className="font-medium">Tenant Name:</span> {tenant.name}
          </div>
          <div className="mb-2">
            <span className="font-medium">Domain:</span> {tenant.domain}
          </div>
          {/* Example settings fields, can be extended for advanced config */}
          <div className="flex flex-col gap-2">
            <label>
              Support Email:
              <input type="email" name="supportEmail" value={settings.supportEmail || ''} onChange={handleChange} className="ml-2 p-1 border rounded" />
            </label>
            <label>
              Theme Color:
              <input type="text" name="themeColor" value={settings.themeColor || ''} onChange={handleChange} className="ml-2 p-1 border rounded" />
            </label>
            <label>
              Custom Footer:
              <input type="text" name="footer" value={settings.footer || ''} onChange={handleChange} className="ml-2 p-1 border rounded" />
            </label>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
          {success && <div className="text-green-500">{success}</div>}
        </form>
      )}
    </div>
  );
}
