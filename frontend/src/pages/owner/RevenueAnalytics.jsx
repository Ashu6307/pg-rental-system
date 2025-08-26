import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import { useRef } from 'react';
Chart.register(...registerables);

export default function RevenueAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [pgId, setPgId] = useState('');
  const [bikeId, setBikeId] = useState('');
  const chartRef = useRef(null);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, pgId, bikeId]);

  useEffect(() => {
    if (data && data.trend && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: data.trend.map(t => t.month),
            datasets: [{
              label: 'Revenue',
              data: data.trend.map(t => t.revenue),
              borderColor: 'rgb(59,130,246)',
              backgroundColor: 'rgba(59,130,246,0.2)',
              fill: true,
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: true },
              title: { display: true, text: 'Revenue Trend (Last 6 Months)' }
            }
          }
        });
      }
    }
  }, [data]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const params = {};
      if (dateRange.from) params.from = dateRange.from;
      if (dateRange.to) params.to = dateRange.to;
      if (pgId) params.pgId = pgId;
      if (bikeId) params.bikeId = bikeId;
      const res = await axios.get('/api/owner/analytics', { params });
      setData(res.data);
    } catch (err) {
      setError('Error fetching analytics');
    }
    setLoading(false);
  };

  const handleExport = () => {
    if (!data) return;
    const rows = [
      ['Month', 'Revenue'],
      ...Object.entries(data.monthlyBreakdown)
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'advanced_analytics_report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Owner Advanced Analytics (Industry Level)</h2>
      <div className="mb-4 flex gap-4 flex-wrap">
        <div>
          <label className="block text-sm font-medium">From:</label>
          <input type="date" value={dateRange.from} onChange={e => setDateRange({ ...dateRange, from: e.target.value })} className="border rounded px-2 py-1" />
        </div>
        <div>
          <label className="block text-sm font-medium">To:</label>
          <input type="date" value={dateRange.to} onChange={e => setDateRange({ ...dateRange, to: e.target.value })} className="border rounded px-2 py-1" />
        </div>
        <div>
          <label className="block text-sm font-medium">PG:</label>
          <input type="text" placeholder="PG ID" value={pgId} onChange={e => setPgId(e.target.value)} className="border rounded px-2 py-1" />
        </div>
        <div>
          <label className="block text-sm font-medium">Bike:</label>
          <input type="text" placeholder="Bike ID" value={bikeId} onChange={e => setBikeId(e.target.value)} className="border rounded px-2 py-1" />
        </div>
        <button className="btn btn-primary" onClick={handleExport}>Export CSV</button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {data && (
        <div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>Total Revenue: <span className="font-bold">₹{data.totalRevenue}</span></div>
            <div>PG Revenue: <span className="font-bold">₹{data.pgRevenue}</span></div>
            <div>Bike Revenue: <span className="font-bold">₹{data.bikeRevenue}</span></div>
            <div>Bookings: <span className="font-bold">{data.totalBookings}</span></div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Monthly Breakdown</h3>
          <table className="min-w-full bg-white rounded shadow mb-4">
            <thead>
              <tr>
                <th>Month</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.monthlyBreakdown).map(([month, rev]) => (
                <tr key={month}>
                  <td>{month}</td>
                  <td>₹{rev}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mb-6">
            <canvas ref={chartRef} height={120}></canvas>
          </div>
          {data.topPG && (
            <div className="mb-2">Top Earning PG: <span className="font-bold">{data.topPG.name}</span> (₹{data.topPG.revenue})</div>
          )}
          {data.topBike && (
            <div className="mb-2">Top Earning Bike: <span className="font-bold">{data.topBike.brand} {data.topBike.model} ({data.topBike.type})</span> (₹{data.topBike.revenue})</div>
          )}
          <h3 className="text-lg font-semibold mb-2">Occupancy Rates (PGs)</h3>
          <table className="min-w-full bg-white rounded shadow mb-4">
            <thead>
              <tr>
                <th>PG Name</th>
                <th>Occupancy (%)</th>
              </tr>
            </thead>
            <tbody>
              {data.occupancyRates.map(o => (
                <tr key={o.pgId}>
                  <td>{o.name}</td>
                  <td>{o.occupancy}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3 className="text-lg font-semibold mb-2">Payment Method Breakdown</h3>
          <table className="min-w-full bg-white rounded shadow mb-4">
            <thead>
              <tr>
                <th>Method</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.paymentBreakdown).map(([method, rev]) => (
                <tr key={method}>
                  <td>{method}</td>
                  <td>₹{rev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
