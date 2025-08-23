import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Payments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    // Fetch user payment history
    const fetchPayments = async () => {
      try {
        const res = await axios.get('/api/user/payments');
        setPayments(res.data);
      } catch (err) {
        setPayments([]);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">Payment History</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Amount</th>
            <th className="border px-2 py-1">Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p, idx) => (
            <tr key={idx}>
              <td className="border px-2 py-1">{new Date(p.date).toLocaleDateString()}</td>
              <td className="border px-2 py-1">₹{p.amount}</td>
              <td className="border px-2 py-1">{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Payments;
