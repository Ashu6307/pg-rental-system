import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AnalyticsReports = () => {
  const { role } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('/api/analytics/tenant/dashboard')
      .then(res => {
        setAnalytics(res.data.analytics);
        setSuccess('Analytics loaded successfully!');
      })
      .catch(() => setError('Failed to load analytics.'))
      .finally(() => setLoading(false));
  }, []);

  const handleExport = async (type) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await axios.get(`/api/admin/${type}/export?format=csv`);
      setReport(res.data.report);
      setSuccess('Report exported!');
    } catch {
      setError('Failed to export report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{role === 'admin' ? 'Admin' : 'Owner'} Analytics & Reports</h1>
      {loading && <div className="text-center my-4"><span className="loader"></span> Loading...</div>}
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">{success}</div>}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Analytics Dashboard</h2>
        <div className="mb-4">{JSON.stringify(analytics)}</div>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Export / Reporting</h2>
        <button className="btn" onClick={() => handleExport('analytics')} disabled={loading}>Export Analytics</button>
        <button className="btn ml-2" onClick={() => handleExport('audit')} disabled={loading}>Export Audit Logs</button>
        <button className="btn ml-2" onClick={() => handleExport('gdpr')} disabled={loading}>Export GDPR Logs</button>
        {report && <div className="mt-4">Report: <a href={report.url} className="text-blue-600 underline">Download</a></div>}
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Data Visualization</h2>
        <div className="mb-4">Charts/Graphs will be shown here.</div>
      </section>
    </div>
  );
};

export default AnalyticsReports;
