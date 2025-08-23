import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileUpload from '../../components/FileUpload.jsx';

const PG_TYPE_OPTIONS = ['Single', 'Double', 'Triple', 'Four'];

const initialForm = {
  name: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  contactNumber: '',
  email: '',
  rooms: '',
  availableRooms: '',
  price: '',
  priceType: 'monthly',
  deposit: '',
  pgType: 'Single',
  amenities: [],
  rules: [],
  furnished: false,
  foodIncluded: false,
  genderAllowed: 'any',
  allowedVisitors: false,
  parkingAvailable: false,
  wifiAvailable: false,
  acAvailable: false,
  laundryAvailable: false,
  electricityBill: {
    included: false,
    amount: '',
    perUnit: '',
    type: 'shared',
    notes: ''
  },
  images: []
};

export default function PGManagement() {
  const [form, setForm] = useState(initialForm);
  const [pgList, setPgList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchPGs();
  }, []);

  const fetchPGs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/pg');
      setPgList(res.data);
    } catch (err) {
      alert('Error fetching PGs');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`/api/pg/${editId}`, form);
      } else {
        await axios.post('/api/pg', form);
      }
      fetchPGs();
      setForm(initialForm);
      setEditId(null);
    } catch (err) {
      alert('Error saving PG');
    }
    setLoading(false);
  };

  const handleEdit = (pg) => {
    setForm(pg);
    setEditId(pg._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this PG?')) return;
    setLoading(true);
    try {
      await axios.delete(`/api/pg/${id}`);
      fetchPGs();
    } catch (err) {
      alert('Error deleting PG');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Owner PG Management</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="PG Name" className="input" required />
          <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="input" required />
          <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="input" required />
          <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="input" required />
          <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="Pincode" className="input" required />
          <input name="contactNumber" value={form.contactNumber} onChange={handleChange} placeholder="Contact Number" className="input" required />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="input" />
          <input name="rooms" value={form.rooms} onChange={handleChange} placeholder="Total Rooms" className="input" required />
          <input name="availableRooms" value={form.availableRooms} onChange={handleChange} placeholder="Available Rooms" className="input" />
          <input name="price" value={form.price} onChange={handleChange} placeholder="Price" className="input" required />
          <select name="priceType" value={form.priceType} onChange={handleChange} className="input">
            <option value="monthly">Monthly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
          <input name="deposit" value={form.deposit} onChange={handleChange} placeholder="Deposit" className="input" />
          <select name="pgType" value={form.pgType} onChange={handleChange} className="input">
            {PG_TYPE_OPTIONS.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          <FileUpload onUpload={url => setForm(f => ({ ...f, images: [...(f.images || []), url] }))} accept="image/*" />
          {/* Show uploaded images */}
          {form.images && form.images.length > 0 && (
            <div className="col-span-2 mb-2">
              <div className="flex gap-2 flex-wrap">
                {form.images.map((img, idx) => (
                  <img key={idx} src={img} alt="PG" className="h-16 w-16 object-cover rounded border" />
                ))}
              </div>
            </div>
          )}
        </div>
        <button type="submit" className="mt-4 btn btn-primary" disabled={loading}>{editId ? 'Update' : 'Add'} PG</button>
        {editId && <button type="button" className="ml-2 btn btn-secondary" onClick={() => { setForm(initialForm); setEditId(null); }}>Cancel</button>}
      </form>
      <h3 className="text-xl font-semibold mb-2">Your PGs</h3>
      {loading ? <div>Loading...</div> : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th>Name</th>
              <th>City</th>
              <th>Type</th>
              <th>Rooms</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pgList.map(pg => (
              <tr key={pg._id}>
                <td>{pg.name}</td>
                <td>{pg.city}</td>
                <td>{pg.pgType}</td>
                <td>{pg.rooms}</td>
                <td>{pg.price}</td>
                <td>
                  <button className="btn btn-sm btn-info mr-2" onClick={() => handleEdit(pg)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(pg._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
