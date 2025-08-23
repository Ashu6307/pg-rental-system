import React, { useState, useEffect } from 'react';
import axios from 'axios';

const termTypes = [
  { key: 'user_registration', label: 'User Registration' },
  { key: 'owner_registration', label: 'Owner Registration' },
  { key: 'pg_booking', label: 'PG Booking' },
  { key: 'bike_booking', label: 'Bike Booking' },
  { key: 'add_pg', label: 'Add PG' },
  { key: 'add_bike', label: 'Add Bike' }
];

const TermsManager = () => {
  const [selectedType, setSelectedType] = useState(termTypes[0].key);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    axios.get(`/api/terms/${selectedType}`)
      .then(res => setContent(res.data.content || ''))
      .catch(() => setContent(''))
      .finally(() => setLoading(false));
  }, [selectedType]);

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`/api/terms/${selectedType}`, { content });
      setSuccess('Terms updated successfully!');
    } catch (err) {
      setError('Failed to update terms.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="mb-4">
        <label className="font-semibold mr-2">Select Flow:</label>
        <select value={selectedType} onChange={e => setSelectedType(e.target.value)} className="border rounded px-2 py-1">
          {termTypes.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
        </select>
      </div>
      <textarea
        className="w-full border rounded p-2 mb-4 min-h-[180px]"
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Enter Terms & Conditions..."
        disabled={loading}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Terms'}
      </button>
      {success && <div className="text-green-600 mt-2">{success}</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
};

export default TermsManager;
