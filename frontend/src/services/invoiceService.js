import axios from 'axios';

const API_BASE = '/api/invoices';

export const getInvoiceById = async (invoiceId) => {
  const res = await axios.get(`${API_BASE}/${invoiceId}`);
  return res.data;
};

export const downloadInvoicePDF = async (invoiceId) => {
  const res = await axios.get(`${API_BASE}/${invoiceId}/pdf`, { responseType: 'blob' });
  return res.data;
};

export const getInvoices = async () => {
  const res = await axios.get(API_BASE);
  return res.data;
};
