// AdminSoftDeleteAudit.jsx
// Industry-level admin soft delete + audit log management page
import React, { useState } from 'react';
import axios from 'axios';

export default function AdminSoftDeleteAudit() {
  const [form, setForm] = useState({ model: '', id: '', userId: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDelete = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await axios.post('/api/softDelete/delete', form);
      setResult(res.data);
      setSuccess(res.data.message);
    } catch (err) {
      setError('Failed to soft delete');
    }
  };

  const handleRestore = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await axios.post('/api/softDelete/restore', form);
      setResult(res.data);
      setSuccess(res.data.message);
    } catch (err) {
      setError('Failed to restore');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Admin Soft Delete & Audit Log</h2>
      <form className="mb-6 flex flex-col gap-4">
        <input type="text" name="model" value={form.model} onChange={handleChange} placeholder="Model (e.g. User, Booking)" className="p-2 border rounded" />
        <input type="text" name="id" value={form.id} onChange={handleChange} placeholder="Record ID" className="p-2 border rounded" />
        <input type="text" name="userId" value={form.userId} onChange={handleChange} placeholder="Admin/User ID" className="p-2 border rounded" />
        <div className="flex gap-2">
          <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleDelete}>Soft Delete</button>
          <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleRestore}>Restore</button>
        </div>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-500 mb-2">{success}</div>}
      {result && (
        <div className="bg-gray-100 p-4 rounded mt-4">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
