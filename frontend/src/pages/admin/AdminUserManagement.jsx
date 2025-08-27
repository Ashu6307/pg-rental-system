// AdminUserManagement.jsx
// Admin user management page (add/edit/delete, RBAC, industry-level)
import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import axios from 'axios';

const roles = [
  { value: 'MainAdmin', label: 'Main Admin' },
  { value: 'SubAdmin', label: 'Sub Admin' },
  { value: 'Owner', label: 'Owner' },
  { value: 'User', label: 'User' }
];

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'User' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/adminUsers');
      setUsers(res.data.users);
    } catch (err) {
      setError('Failed to fetch users');
    }
    setLoading(false);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (editId) {
        await axios.put(`/api/adminUsers/edit/${editId}`, form);
        setSuccess('User updated');
      } else {
        await axios.post('/api/adminUsers/add', form);
        setSuccess('User added');
      }
      setForm({ name: '', email: '', password: '', role: 'User' });
      setEditId(null);
      fetchUsers();
    } catch (err) {
      setError('Failed to save user');
    }
    setLoading(false);
  };

  const handleEdit = user => {
    setEditId(user._id);
    setForm({ name: user.name, email: user.email, password: '', role: user.role });
  };

  const handleDelete = async id => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`/api/adminUsers/delete/${id}`);
      setSuccess('User deleted');
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Admin User Management</h2>
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />
        <div className="relative">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
          />
          
          {/* Email validation icons */}
          {form.email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(form.email) ? (
            <FaExclamationCircle className="absolute right-3 top-2.5 h-5 w-5 text-red-500" />
          ) : form.email && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(form.email) ? (
            <FaCheckCircle className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
          ) : (
            <FaEnvelope className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          )}
        </div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />
        <select name="role" value={form.role} onChange={handleChange} className="p-2 border rounded w-full">
          {roles.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? (editId ? 'Updating...' : 'Adding...') : (editId ? 'Update User' : 'Add User')}
        </button>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
      </form>
      <h3 className="text-lg font-semibold mb-2">All Users</h3>
      {loading ? <div>Loading...</div> : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Role</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td className="border px-2 py-1">{user.name}</td>
                <td className="border px-2 py-1">{user.email}</td>
                <td className="border px-2 py-1">{user.role}</td>
                <td className="border px-2 py-1">
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleEdit(user)}>
                    Edit
                  </button>
                  <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(user._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
