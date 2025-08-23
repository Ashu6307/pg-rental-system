import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PricingManager = () => {
  const [bikes, setBikes] = useState([]);
  const [selectedBike, setSelectedBike] = useState('');
  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch all bikes
    axios.get('/api/bike').then(res => setBikes(res.data));
  }, []);

  useEffect(() => {
    if (selectedBike) {
      axios.get(`/api/pricing?bikeId=${selectedBike}`).then(res => setOptions(res.data));
    } else {
      setOptions([]);
    }
  }, [selectedBike]);

  const handleOptionChange = (idx, field, value) => {
    const newOptions = [...options];
    newOptions[idx][field] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { days: '', price: '' }]);
  };

  const removeOption = (idx) => {
    setOptions(options.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/pricing', { bikeId: selectedBike, options });
      setMessage('Pricing updated successfully!');
    } catch {
      setMessage('Error updating pricing.');
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">Bike Pricing Manager</h2>
      <div className="mb-4">
        <label className="mr-2 font-semibold">Select Bike:</label>
        <select value={selectedBike} onChange={e => setSelectedBike(e.target.value)} className="border rounded px-2 py-1">
          <option value="">Select</option>
          {bikes.map(b => <option key={b._id} value={b._id}>{b.name} ({b.model})</option>)}
        </select>
      </div>
      {selectedBike && (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block font-semibold mb-1">Pricing Options</label>
            {options.map((opt, idx) => (
              <div key={idx} className="flex space-x-2 mb-2">
                <input type="number" placeholder="Days" value={opt.days} onChange={e => handleOptionChange(idx, 'days', e.target.value)} className="border rounded px-2 py-1 w-1/2" />
                <input type="number" placeholder="Price" value={opt.price} onChange={e => handleOptionChange(idx, 'price', e.target.value)} className="border rounded px-2 py-1 w-1/2" />
                <button type="button" onClick={() => removeOption(idx)} className="text-red-600">Remove</button>
              </div>
            ))}
            <button type="button" onClick={addOption} className="bg-green-600 text-white px-2 py-1 rounded">Add Option</button>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Update Pricing</button>
        </form>
      )}
      {message && <div className="mt-4 text-green-600 font-semibold">{message}</div>}
    </div>
  );
};

export default PricingManager;
