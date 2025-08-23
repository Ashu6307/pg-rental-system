// PaymentHistory.jsx
// User payment history page
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/payments/my');
      setPayments(res.data.payments);
    } catch (err) {
      setError('Failed to fetch payment history');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Payment History</h2>
      {loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Booking</th>
              <th className="border px-2 py-1">Amount</th>
              <th className="border px-2 py-1">Method</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Transaction ID</th>
              <th className="border px-2 py-1">Paid At</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment._id}>
                <td className="border px-2 py-1">{payment.booking ? payment.booking._id : '-'}</td>
                <td className="border px-2 py-1">₹{payment.amount}</td>
                <td className="border px-2 py-1">{payment.method}</td>
                <td className="border px-2 py-1">{payment.status}</td>
                <td className="border px-2 py-1">{payment.transactionId || '-'}</td>
                <td className="border px-2 py-1">{payment.paidAt ? new Date(payment.paidAt).toLocaleString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
