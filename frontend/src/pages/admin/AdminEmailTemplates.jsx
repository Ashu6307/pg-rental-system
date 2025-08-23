import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const templateTypes = [
  { value: 'PG_BOOKING_CONFIRM', label: 'PG Booking Confirmation' },
  { value: 'PG_BOOKING_REJECT', label: 'PG Booking Rejection' },
  { value: 'BIKE_BOOKING_CONFIRM', label: 'Bike Booking Confirmation' },
  { value: 'BIKE_BOOKING_REJECT', label: 'Bike Booking Rejection' },
  { value: 'RESET_PASSWORD', label: 'Password Reset' }
];

const AdminEmailTemplates = () => {
  const token = useSelector(state => state.auth.token);
  const [templates, setTemplates] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ type: '', subject: '', header: '', body: '', footer: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await axios.get('/api/email-templates', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTemplates(res.data);
    } catch (err) {
      setMessage('Failed to load templates');
    }
  };

  const handleEdit = (tpl) => {
    setEditing(tpl._id);
    setForm({ type: tpl.type, subject: tpl.subject, header: tpl.header, body: tpl.body, footer: tpl.footer });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await axios.put(`/api/email-templates/${editing}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Template updated!');
      } else {
        await axios.post('/api/email-templates', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Template created!');
      }
      setEditing(null);
      setForm({ type: '', subject: '', header: '', body: '', footer: '' });
      fetchTemplates();
    } catch (err) {
      setMessage('Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this template?')) return;
    try {
      await axios.delete(`/api/email-templates/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Template deleted');
      fetchTemplates();
    } catch (err) {
      setMessage('Delete failed');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Email Templates</h2>
      {message && <div className="mb-2 text-blue-600">{message}</div>}
      <table className="min-w-full border mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Subject</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {templates.map(tpl => (
            <tr key={tpl._id} className="border-b">
              <td className="p-2 border">{tpl.type}</td>
              <td className="p-2 border">{tpl.subject}</td>
              <td className="p-2 border">
                <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleEdit(tpl)}>Edit</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(tpl._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">{editing ? 'Edit Template' : 'Add New Template'}</h3>
        <form className="space-y-3">
          <label className="block">
            Type:
            <select name="type" value={form.type} onChange={handleChange} className="border p-1 w-full">
              <option value="">Select type</option>
              {templateTypes.map(tt => <option key={tt.value} value={tt.value}>{tt.label}</option>)}
            </select>
          </label>
          <label className="block">
            Subject:
            <input name="subject" value={form.subject} onChange={handleChange} className="border p-1 w-full" />
          </label>
          <label className="block">
            Header (HTML):
            <textarea name="header" value={form.header} onChange={handleChange} className="border p-1 w-full" rows={2} />
          </label>
          <label className="block">
            Body (HTML):
            <textarea name="body" value={form.body} onChange={handleChange} className="border p-1 w-full" rows={4} />
          </label>
          <label className="block">
            Footer (HTML):
            <textarea name="footer" value={form.footer} onChange={handleChange} className="border p-1 w-full" rows={2} />
          </label>
          <div className="flex gap-2 mt-2">
            <button type="button" className="bg-blue-900 text-white px-4 py-2 rounded" onClick={handleSave}>{editing ? 'Update' : 'Create'}</button>
            {editing && <button type="button" className="px-4 py-2" onClick={() => {setEditing(null);setForm({ type: '', subject: '', header: '', body: '', footer: '' });}}>Cancel</button>}
          </div>
        </form>
        <div className="mt-4 text-sm text-gray-500">
          Variables: <span className="font-mono">{{name}}</span>, <span className="font-mono">{{pgName}}</span>, <span className="font-mono">{{reason}}</span>, etc. Use as needed per template type.
        </div>
      </div>
    </div>
  );
};

export default AdminEmailTemplates;
