import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMotorcycle } from 'react-icons/fa';
import apiService from '../services/api';
import AutoImageCarousel from '../components/AutoImageCarousel';

const Bike = () => {
  const [bikes, setBikes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const data = await apiService.get('/api/bikes/public');
        setBikes(Array.isArray(data) ? data : (data.bikes || []));
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Bike API error:', error);
        }
      }
    };

    fetchBikes();
  }, []);

  const handleClick = () => {
    navigate('/user/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-12">
        {/* Attractive Gradient Header with Icon */}
        <div className="relative mb-8 px-2">
          <div className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 rounded-2xl shadow-lg p-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-full p-3 shadow-lg">
                <FaMotorcycle size={40} className="text-purple-600" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow-lg">Bike Rentals</h1>
                <p className="text-lg text-white/90">Find and book your perfect ride from our wide range of bikes.</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="badge-animated-border">Industry Trusted</span>
              <span className="badge-animated-border">Verified</span>
            </div>
          </div>
        </div>
        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {Array.isArray(bikes) && bikes.map(item => (
            <div
              key={item._id}
              className="relative rounded-2xl p-4 cursor-pointer transition-all duration-300 group card-attractive"
              onClick={handleClick}
            >
              <div className="absolute inset-0 rounded-2xl card-gradient z-0"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center mb-3 border-4 border-purple-200 group-hover:border-purple-400 transition-all duration-300">
                  {item.images && item.images[0] ? (
                    <img src={item.images[0]} alt={item.model} className="w-20 h-20 object-cover rounded-full" />
                  ) : (
                    <FaMotorcycle size={40} className="text-purple-400" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-blue-700 mb-1 truncate group-hover:text-pink-700 transition">{item.brand} {item.model}</h3>
                <p className="text-gray-500 mb-1 text-sm">{item.type}, {item.color}</p>
                <span className="text-green-600 font-bold text-lg mb-2">₹{item.price_per_day}</span>
                <div className="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow group-hover:bg-pink-600 transition">Bike</div>
              </div>
            </div>
          ))}
        </div>
        {/* Stylish More Button */}
        <div className="flex justify-center mt-10">
          <button
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full shadow-lg hover:scale-105 hover:from-blue-700 hover:to-purple-700 transition-all text-lg tracking-wide"
            onClick={handleClick}
          >
            Show More Bikes &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bike;
