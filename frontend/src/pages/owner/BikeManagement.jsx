import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileUpload from '../../components/FileUpload.jsx';
import { showSuccess, showError } from '../../utils/notifications';

const BIKE_TYPE_OPTIONS = ['Standard', 'Sports', 'Scooter', 'Electric'];
const FUEL_TYPE_OPTIONS = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
const TRANSMISSION_OPTIONS = ['Manual', 'Automatic'];

const initialForm = {
  name: '',
  brand: '',
  model: '',
  type: 'Standard',
  year: '',
  color: '',
  mileage: '',
  fuelType: 'Petrol',
  transmission: 'Manual',
  number_plate: '',
  registration_docs: [],
  insurance: {
    provider: '',
    policyNumber: '',
    validTill: ''
  },
  price_per_day: '',
  price_per_week: '',
  price_per_month: '',
  available: true,
  description: '',
  images: [],
  features: [],
};

export default function BikeManagement() {
  const [form, setForm] = useState(initialForm);
  const [bikeList, setBikeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/bikes');
      setBikeList(res.data);
    } catch (err) {
      showError('Error fetching bikes. Please try again.');
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

  const handleInsuranceChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, insurance: { ...form.insurance, [name]: value } });
  };

  const handleFeaturesChange = (e) => {
    setForm({ ...form, features: e.target.value.split(',').map(f => f.trim()) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`/api/bikes/${editId}`, form);
        showSuccess('Bike updated successfully!');
      } else {
        await axios.post('/api/bikes', form);
        showSuccess('Bike added successfully!');
      }
      fetchBikes();
      setForm(initialForm);
      setEditId(null);
    } catch (err) {
      showError(err.response?.data?.message || 'Error saving bike. Please try again.');
    }
    setLoading(false);
  };

  const handleEdit = (bike) => {
    setForm({
      ...bike,
      insurance: bike.insurance || initialForm.insurance,
      features: bike.features || [],
    });
    setEditId(bike._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this bike?')) return;
    setLoading(true);
    try {
      await axios.delete(`/api/bikes/${id}`);
      showSuccess('Bike deleted successfully!');
      fetchBikes();
    } catch (err) {
      showError(err.response?.data?.message || 'Error deleting bike. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Owner Bike Management</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Bike Name" className="input" required />
          <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" className="input" required />
          <input name="model" value={form.model} onChange={handleChange} placeholder="Model" className="input" required />
          <select name="type" value={form.type} onChange={handleChange} className="input">
            {BIKE_TYPE_OPTIONS.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          <input name="year" value={form.year} onChange={handleChange} placeholder="Year" className="input" />
          <input name="color" value={form.color} onChange={handleChange} placeholder="Color" className="input" />
          <input name="mileage" value={form.mileage} onChange={handleChange} placeholder="Mileage" className="input" />
          <select name="fuelType" value={form.fuelType} onChange={handleChange} className="input">
            {FUEL_TYPE_OPTIONS.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          <select name="transmission" value={form.transmission} onChange={handleChange} className="input">
            {TRANSMISSION_OPTIONS.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          <input name="number_plate" value={form.number_plate} onChange={handleChange} placeholder="Registration Number" className="input" required />
          <input name="registration_docs" value={form.registration_docs} onChange={handleChange} placeholder="Registration Docs (comma separated URLs)" className="input" />
          <input name="price_per_day" value={form.price_per_day} onChange={handleChange} placeholder="Price Per Day" className="input" required />
          <input name="price_per_week" value={form.price_per_week} onChange={handleChange} placeholder="Price Per Week" className="input" />
          <input name="price_per_month" value={form.price_per_month} onChange={handleChange} placeholder="Price Per Month" className="input" />
          <label className="flex items-center">
            <input type="checkbox" name="available" checked={form.available} onChange={handleChange} /> Available
          </label>
          <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="input" />
          <input name="features" value={form.features.join(', ')} onChange={handleFeaturesChange} placeholder="Features (comma separated)" className="input" />
          <div className="col-span-2">
            <h4 className="font-semibold mb-2">Insurance Details</h4>
            <input name="provider" value={form.insurance.provider} onChange={handleInsuranceChange} placeholder="Provider" className="input mb-2" />
            <input name="policyNumber" value={form.insurance.policyNumber} onChange={handleInsuranceChange} placeholder="Policy Number" className="input mb-2" />
            <input name="validTill" type="date" value={form.insurance.validTill ? form.insurance.validTill.substring(0,10) : ''} onChange={handleInsuranceChange} className="input mb-2" />
          </div>
          <FileUpload onUpload={url => setForm(f => ({ ...f, images: [...(f.images || []), url] }))} accept="image/*" />
          {/* Show uploaded images */}
          {form.images && form.images.length > 0 && (
            <div className="col-span-2 mb-2">
              <div className="flex gap-2 flex-wrap">
                {form.images.map((img, idx) => (
                  <img key={idx} src={img} alt="Bike" className="h-16 w-16 object-cover rounded border" />
                ))}
              </div>
            </div>
          )}
        </div>
        <button type="submit" className="mt-4 btn btn-primary" disabled={loading}>{editId ? 'Update' : 'Add'} Bike</button>
        {editId && <button type="button" className="ml-2 btn btn-secondary" onClick={() => { setForm(initialForm); setEditId(null); }}>Cancel</button>}
      </form>
      <h3 className="text-xl font-semibold mb-2">Your Bikes</h3>
      {loading ? <div>Loading...</div> : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th>Name</th>
              <th>Brand</th>
              <th>Type</th>
              <th>Year</th>
              <th>Price/Day</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bikeList.map(bike => (
              <tr key={bike._id}>
                <td>{bike.name}</td>
                <td>{bike.brand}</td>
                <td>{bike.type}</td>
                <td>{bike.year}</td>
                <td>{bike.price_per_day}</td>
                <td>{bike.available ? 'Yes' : 'No'}</td>
                <td>
                  <button className="btn btn-sm btn-info mr-2" onClick={() => handleEdit(bike)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(bike._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
