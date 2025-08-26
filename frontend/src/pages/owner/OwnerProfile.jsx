import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FileUpload from '../../components/FileUpload.jsx';

export default function OwnerProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', consent: false });
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/owner/profile');
      setProfile(res.data);
      setForm({
        name: res.data.name || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
        address: res.data.address || '',
        consent: res.data.consent || false
      });
      setAvatar(res.data.avatar || '');
    } catch (err) {
      setError('Error fetching profile');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put('/api/owner/profile', form);
      fetchProfile();
    } catch (err) {
      setError('Error updating profile');
    }
    setLoading(false);
  };

  const handleAvatarUpload = async (url) => {
    setLoading(true);
    try {
      await axios.post('/api/owner/profile/avatar', { avatarUrl: url });
      setAvatar(url);
      fetchProfile();
    } catch (err) {
      setError('Avatar upload failed');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Owner Profile & KYC</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="input" required />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="input" required />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="input" />
          <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="input" />
          <label className="flex items-center">
            <input type="checkbox" name="consent" checked={form.consent} onChange={handleChange} /> GDPR/Data Consent
          </label>
        </div>
        <button type="submit" className="mt-4 btn btn-primary" disabled={loading}>Update Profile</button>
      </form>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Profile Image</h3>
        {avatar && <img src={avatar} alt="Avatar" className="h-20 w-20 object-cover rounded-full border mb-2" />}
        <FileUpload onUpload={handleAvatarUpload} accept="image/*" />
      </div>
      {profile && (
        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">KYC Status</h3>
          <div>Status: <span className="font-bold">{profile.KYC_status}</span></div>
          <div>Approval: <span className="font-bold">{profile.approval_status}</span></div>
          {profile.rejection_reason && <div>Rejection Reason: {profile.rejection_reason}</div>}
        </div>
      )}
    </div>
  );
}
