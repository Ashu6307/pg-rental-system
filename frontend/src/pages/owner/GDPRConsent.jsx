import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function OwnerGDPRConsent() {
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConsent();
  }, []);

  const fetchConsent = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/owner/gdprconsent');
      setConsent(res.data.consentGiven);
    } catch (err) {
      setError('Error fetching consent status');
    }
    setLoading(false);
  };

  const handleToggle = async () => {
    setLoading(true);
    try {
      await axios.put('/api/owner/gdprconsent', { consentGiven: !consent, consentType: 'general' });
      setConsent(!consent);
    } catch (err) {
      setError('Error updating consent');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">GDPR / Data Consent</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="bg-white shadow rounded p-4 flex items-center gap-4">
        <span className="font-semibold">Consent Status:</span>
        <span className={consent ? 'text-green-600' : 'text-red-600'}>{consent ? 'Given' : 'Not Given'}</span>
        <button className="btn btn-sm btn-primary" onClick={handleToggle} disabled={loading}>
          {consent ? 'Revoke Consent' : 'Give Consent'}
        </button>
      </div>
    </div>
  );
}
