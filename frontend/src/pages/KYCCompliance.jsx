import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const KYCCompliance = () => {
  const { role } = useContext(AuthContext);
  const [kycStatus, setKycStatus] = useState('Pending');
  const [docStatus, setDocStatus] = useState('Pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get('/api/users/admin/kyc-status/me'),
      axios.get('/api/users/admin/doc-status/me'),
    ])
      .then(([k, d]) => {
        setKycStatus(k.data.kycStatus);
        setDocStatus(d.data.documents ? 'Approved' : 'Pending');
        setSuccess('Compliance data loaded!');
      })
      .catch(() => setError('Failed to load compliance data.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{role === 'admin' ? 'Admin' : role === 'owner' ? 'Owner' : 'User'} KYC & Compliance</h1>
      {loading && <div className="text-center my-4"><span className="loader"></span> Loading...</div>}
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">{success}</div>}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">KYC Status</h2>
        <div className="mb-4">Your KYC Status: <span className="font-semibold">{kycStatus}</span></div>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Document Verification</h2>
        <div className="mb-4">Document Status: <span className="font-semibold">{docStatus}</span></div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Compliance Actions</h2>
        <button className="btn">Upload Document</button>
        <button className="btn ml-2">Request Verification</button>
      </section>
    </div>
  );
};

export default KYCCompliance;
