// AdminPGManagement.jsx
// Admin PG/Bike/Owner management page (approve/reject, industry-level)
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminPGManagement() {
  const [pgs, setPGs] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [pgRes, bikeRes, ownerRes] = await Promise.all([
        axios.get('/api/adminPG/pgs'),
        axios.get('/api/adminPG/bikes'),
        axios.get('/api/adminPG/owners')
      ]);
      setPGs(pgRes.data.pgs);
      setBikes(bikeRes.data.bikes);
      setOwners(ownerRes.data.owners);
    } catch (err) {
      setError('Failed to fetch data');
    }
    setLoading(false);
  };

  const handleAction = async (type, entity, id) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`/api/adminPG/${entity}/${type}/${id}`);
      setSuccess(`${entity.charAt(0).toUpperCase() + entity.slice(1)} ${type}d`);
      fetchAll();
    } catch (err) {
      setError('Action failed');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Admin PG/Bike/Owner Management</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-500 mb-2">{success}</div>}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">PGs</h3>
        <table className="w-full border mb-4">
          <thead>
            <tr>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pgs.map(pg => (
              <tr key={pg._id}>
                <td className="border px-2 py-1">{pg.name}</td>
                <td className="border px-2 py-1">{pg.status}</td>
                <td className="border px-2 py-1">
                  <button className="bg-green-600 text-white px-2 py-1 rounded mr-2" onClick={() => handleAction('approve', 'pgs', pg._id)} disabled={pg.status === 'approved'}>
                    Approve
                  </button>
                  <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleAction('reject', 'pgs', pg._id)} disabled={pg.status === 'rejected'}>
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Bikes</h3>
        <table className="w-full border mb-4">
          <thead>
            <tr>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bikes.map(bike => (
              <tr key={bike._id}>
                <td className="border px-2 py-1">{bike.name}</td>
                <td className="border px-2 py-1">{bike.status}</td>
                <td className="border px-2 py-1">
                  <button className="bg-green-600 text-white px-2 py-1 rounded mr-2" onClick={() => handleAction('approve', 'bikes', bike._id)} disabled={bike.status === 'approved'}>
                    Approve
                  </button>
                  <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleAction('reject', 'bikes', bike._id)} disabled={bike.status === 'rejected'}>
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Owners</h3>
        <table className="w-full border mb-4">
          <thead>
            <tr>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {owners.map(owner => (
              <tr key={owner._id}>
                <td className="border px-2 py-1">{owner.name}</td>
                <td className="border px-2 py-1">{owner.status}</td>
                <td className="border px-2 py-1">
                  <button className="bg-green-600 text-white px-2 py-1 rounded mr-2" onClick={() => handleAction('approve', 'owners', owner._id)} disabled={owner.status === 'approved'}>
                    Approve
                  </button>
                  <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleAction('reject', 'owners', owner._id)} disabled={owner.status === 'rejected'}>
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
