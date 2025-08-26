import React, { useState, useEffect } from 'react';
import TermsPopup from '../components/TermsPopup';
import axios from 'axios';
import { getPricing } from '../api/pricingAPI';
import { getBikes } from '../api/bikeAPI';
import { showSuccess, showError, showWarning } from '../utils/notifications';

// durations will be fetched per bike

const helmetPrice = 50;

const BikeBookingForm = () => {

  const [bikes, setBikes] = useState([]);
  const [selectedBike, setSelectedBike] = useState('');
  const [durations, setDurations] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState(null);
  const [endDate, setEndDate] = useState('');
  const [helmets, setHelmets] = useState(0);
  const [showTerms, setShowTerms] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [licenseFile, setLicenseFile] = useState(null);
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [price, setPrice] = useState(0);

  useEffect(() => {
    // Fetch all bikes
    getBikes().then(setBikes);
  }, []);

  useEffect(() => {
    // Fetch durations for selected bike
    const fetchDurations = async () => {
      if (selectedBike) {
        const options = await getPricing(selectedBike);
        setDurations(options);
      } else {
        setDurations([]);
      }
    };
    fetchDurations();
    setDuration(null);
    setPrice(0);
  }, [selectedBike]);

  useEffect(() => {
    if (duration) setPrice(Number(duration.price));
    else setPrice(0);
  }, [duration]);

  // Calculate end date automatically
  const handleBikeChange = (e) => {
    setSelectedBike(e.target.value);
  };

  const handleDurationChange = (e) => {
    const val = durations.find(d => String(d.days) === e.target.value);
    setDuration(val);
    if (startDate && val) {
      const sd = new Date(startDate);
      const ed = new Date(sd);
      ed.setDate(sd.getDate() + Number(val.days));
      setEndDate(ed.toISOString().slice(0, 10));
    }
  };

  // Manual end date change
  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setDuration(null);
    setPrice(0);
  };

  // Show Terms popup before final submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowTerms(true);
  };

  // Final booking after T&C accept
  const handleAcceptTerms = async () => {
    setAcceptedTerms(true);
    setShowTerms(false);
    // Call booking API here
    try {
      const bookingPayload = {
        bike: selectedBike,
        duration: {
          startDate,
          endDate,
          days: duration?.days || null
        },
        price,
        helmets,
        licenseNumber,
        aadhaarNumber,
        // For simplicity, not sending files here
        termsAccepted: true
      };
      await axios.post('/api/booking', bookingPayload);
      showSuccess('Booking confirmed successfully!');
    } catch (err) {
      showError('Booking failed. Please try again.');
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">Bike Booking</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block font-semibold mb-1">Select Bike</label>
          <select value={selectedBike} onChange={handleBikeChange} className="w-full border rounded px-3 py-2">
            <option value="">Select Bike</option>
            {bikes.map(b => <option key={b._id} value={b._id}>{b.name} ({b.model})</option>)}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Start Date</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        {durations.length > 0 && (
          <div>
            <label className="block font-semibold mb-1">Duration</label>
            <select value={duration?.days || ''} onChange={handleDurationChange} className="w-full border rounded px-3 py-2">
              <option value="">Select Duration</option>
              {durations.map(d => <option key={d.days} value={d.days}>{d.days} Days (₹{d.price})</option>)}
            </select>
          </div>
        )}
        <div>
          <label className="block font-semibold mb-1">End Date</label>
          <input type="date" value={endDate} onChange={handleEndDateChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Helmets (max 2, ₹{helmetPrice} each)</label>
          <select value={helmets} onChange={e => setHelmets(Number(e.target.value))} className="w-full border rounded px-3 py-2">
            <option value={0}>No Helmet</option>
            <option value={1}>1 Helmet</option>
            <option value={2}>2 Helmets</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Driving License Number</label>
          <input type="text" value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} className="w-full border rounded px-3 py-2" />
          <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={e => setLicenseFile(e.target.files[0])} className="mt-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Aadhaar Number</label>
          <input type="text" value={aadhaarNumber} onChange={e => setAadhaarNumber(e.target.value)} className="w-full border rounded px-3 py-2" />
          <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={e => setAadhaarFile(e.target.files[0])} className="mt-2" />
        </div>
        <div className="font-bold text-lg mt-4">Total Price: ₹{price + (helmets * helmetPrice)}</div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Book Now</button>
        <button
          type="submit"
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${(acceptedTerms ? '' : 'opacity-50 cursor-not-allowed')}`}
          disabled={!acceptedTerms}
        >
          Book Now
        </button>
      </form>
      <TermsPopup isOpen={showTerms} type="bike_booking" onAccept={handleAcceptTerms} onClose={() => setShowTerms(false)} />
      {acceptedTerms && <div className="mt-4 text-green-600 font-semibold">Booking confirmed! T&C accepted.</div>}
    </div>
  );
};

export default BikeBookingForm;
