// DataConsent.jsx
// User GDPR/data consent page
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function DataConsent() {
  const [consent, setConsent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchConsent();
  }, []);

  const fetchConsent = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/consent/my');
      setConsent(res.data.consent);
    } catch (err) {
      setError('Failed to fetch consent status');
    }
    setLoading(false);
  };

  const handleAccept = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/consent/accept');
      setSuccess('Consent accepted');
      fetchConsent();
    } catch (err) {
      setError('Failed to accept consent');
    }
    setLoading(false);
  };

  const handleRevoke = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/consent/revoke');
      setSuccess('Consent revoked');
      fetchConsent();
    } catch (err) {
      setError('Failed to revoke consent');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">GDPR / Data Consent</h2>
      <p className="mb-4 text-gray-700">To use our services, you must accept our data processing and privacy policy as per GDPR guidelines.</p>
      {loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Consent Status:</span>
            <span className={consent && consent.accepted ? 'text-green-600' : 'text-red-600'}>
              {consent && consent.accepted ? 'Accepted' : 'Not Accepted'}
            </span>
          </div>
          <div className="flex gap-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleAccept}
              disabled={loading || (consent && consent.accepted)}
            >
              Accept Consent
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded"
              onClick={handleRevoke}
              disabled={loading || !(consent && consent.accepted)}
            >
              Revoke Consent
            </button>
          </div>
          {success && <div className="text-green-500">{success}</div>}
        </div>
      )}
    </div>
  );
}
