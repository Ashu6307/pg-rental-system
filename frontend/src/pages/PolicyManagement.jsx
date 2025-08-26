import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const PolicyManagement = () => {
  const { role } = useContext(AuthContext);
  const [policies, setPolicies] = useState([]);
  const [type, setType] = useState('Privacy');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('/api/policy/list')
      .then(res => {
        setPolicies(res.data.policies);
        setSuccess('Policies loaded successfully!');
      })
      .catch(() => setError('Failed to load policies.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/policy/admin/create', { type, content, updatedBy: 'admin' });
      const res = await axios.get('/api/policy/list');
      setPolicies(res.data.policies);
      setContent('');
      setSuccess('Policy saved successfully!');
    } catch {
      setError('Failed to save policy.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, updatedPolicy) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.put(`/api/policy/update/${id}`, updatedPolicy);
      setSuccess('Policy updated!');
      const res = await axios.get('/api/policy/list');
      setPolicies(res.data.policies);
    } catch {
      setError('Failed to update policy.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{role === 'admin' ? 'Admin' : role === 'owner' ? 'Owner' : 'User'} Policy Management</h1>
      {loading && <div className="text-center my-4"><span className="loader"></span> Loading...</div>}
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">{success}</div>}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Current Policies</h2>
        {policies.length === 0 ? <div className="mb-4">No policies found.</div> : policies.map(policy => (
          <div key={policy._id} className="mb-4 p-2 border rounded">
            <div className="font-semibold">{policy.type} Policy</div>
            <div>{policy.content}</div>
            {role === 'admin' && (
              <button className="btn mt-2" onClick={() => handleUpdate(policy._id, { ...policy, status: 'updated' })} disabled={loading}>
                {loading ? 'Updating...' : 'Update Policy'}
              </button>
            )}
          </div>
        ))}
      </section>
      {role === 'admin' && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Add / Update Policy</h2>
          <form onSubmit={handleSave} className="max-w-lg">
            <select className="input mb-2 w-full" value={type} onChange={e => setType(e.target.value)}>
              <option>Privacy</option>
              <option>Cancellation</option>
              <option>Refund</option>
            </select>
            <textarea className="input mb-2 w-full" placeholder="Policy Content" value={content} onChange={e => setContent(e.target.value)} />
            <button className="btn w-full" disabled={loading}>{loading ? 'Saving...' : 'Save Policy'}</button>
          </form>
        </section>
      )}
    </div>
  );
};

export default PolicyManagement;
