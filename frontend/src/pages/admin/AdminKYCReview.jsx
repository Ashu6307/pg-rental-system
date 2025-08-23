import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AdminKYCReview = () => {
  const token = useSelector(state => state.auth.token);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('verified');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    fetchPendingKYC();
  }, []);

  const fetchPendingKYC = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/kyc/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      setError('Failed to load users');
    }
    setLoading(false);
  };

  const handleVerify = async (id) => {
    try {
      await axios.post(`/api/kyc/verify/${id}`, { status, remarks }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelected(null);
      setRemarks('');
      fetchPendingKYC();
    } catch (err) {
      setError('Verification failed');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">KYC Verification</h2>
      {loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : (
        <table className="min-w-full border mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Aadhaar</th>
              <th className="p-2 border">PAN</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b">
                <td className="p-2 border">{u.name}</td>
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border">{u.kyc?.aadhaar?.number || '-'}</td>
                <td className="p-2 border">{u.kyc?.pan?.number || '-'}</td>
                <td className="p-2 border">{u.kyc?.status}</td>
                <td className="p-2 border">
                  <button className="bg-green-500 text-white px-2 py-1 rounded mr-2" onClick={() => setSelected(u._id)}>Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selected && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <h3 className="text-lg font-semibold mb-2">Verify/Reject KYC</h3>
          <label className="block mb-2">
            Status:
            <select value={status} onChange={e => setStatus(e.target.value)} className="border p-1 ml-2">
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
          <label className="block mb-2">
            Remarks:
            <input type="text" value={remarks} onChange={e => setRemarks(e.target.value)} className="border p-1 ml-2 w-64" />
          </label>
          <button className="bg-blue-900 text-white px-4 py-2 rounded" onClick={() => handleVerify(selected)}>Submit</button>
          <button className="ml-2 px-4 py-2" onClick={() => setSelected(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default AdminKYCReview;
