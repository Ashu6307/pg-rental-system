import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminOfferManager = () => {
  const [offers, setOffers] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', images: [] });
  const [editingId, setEditingId] = useState(null);

  // Fetch offers
  useEffect(() => {
    axios.get('/api/offers')
      .then(res => setOffers(res.data))
      .catch(() => toast.error('Failed to fetch offers'));
  }, []);

  // Handle form change
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/offers/${editingId}`, form);
        toast.success('Offer updated');
      } else {
        await axios.post('/api/offers', form);
        toast.success('Offer added');
      }
      setForm({ name: '', description: '', images: [] });
      setEditingId(null);
      // Refresh offers
      const res = await axios.get('/api/offers');
      setOffers(res.data);
    } catch {
      toast.error('Failed to save offer');
    }
  };

  // Edit offer
  const handleEdit = offer => {
    setForm({ name: offer.name, description: offer.description, images: offer.images });
    setEditingId(offer._id);
  };

  // Delete offer
  const handleDelete = async id => {
    if (window.confirm('Delete this offer?')) {
      try {
        await axios.delete(`/api/offers/${id}`);
        toast.success('Offer deleted');
        setOffers(offers.filter(o => o._id !== id));
      } catch {
        toast.error('Failed to delete offer');
      }
    }
  };

  // Add image upload logic
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    try {
      const res = await axios.post('/api/offers/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm({ ...form, images: res.data.urls });
      toast.success('Images uploaded');
    } catch {
      toast.error('Image upload failed');
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Offer Management</h2>
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Offer Name" className="border p-2 w-full rounded" required />
        <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border p-2 w-full rounded" />
        <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="border p-2 w-full rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editingId ? 'Update' : 'Add'} Offer</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', description: '', images: [] }); }} className="ml-2 text-gray-600">Cancel</button>}
      </form>
      <div>
        <h3 className="font-semibold mb-2">Current Offers</h3>
        <ul className="space-y-2">
          {offers.map(offer => (
            <li key={offer._id} className="flex items-center justify-between bg-yellow-50 p-3 rounded">
              <div>
                <span className="font-bold">{offer.name}</span> - {offer.description}
                {offer.images && offer.images.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {offer.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`Offer ${idx + 1}`} className="w-16 h-12 object-cover rounded" />
                    ))}
                  </div>
                )}
              </div>
              <div>
                <button onClick={() => handleEdit(offer)} className="text-blue-600 mr-2">Edit</button>
                <button onClick={() => handleDelete(offer._id)} className="text-red-600">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminOfferManager;
