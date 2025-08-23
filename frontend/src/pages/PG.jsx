import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBuilding } from 'react-icons/fa';
import apiService from '../services/api';

const PG = () => {
  const [pgs, setPgs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPGs = async () => {
      try {
        const data = await apiService.get('/api/pgs/public');
        setPgs(Array.isArray(data) ? data : (data.pgs || []));
        console.log('PG API response:', data);
      } catch (error) {
        console.error('PG API error:', error);
      }
    };

    fetchPGs();
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
                <FaBuilding size={40} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow-lg">PG Listings</h1>
                <p className="text-lg text-white/90">Find and book your perfect PG accommodation from our verified listings.</p>
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
          {Array.isArray(pgs) && pgs.map(item => (
            <div
              key={item._id}
              className="relative rounded-2xl p-4 cursor-pointer transition-all duration-300 group card-attractive"
              onClick={handleClick}
            >
              <div className="absolute inset-0 rounded-2xl card-gradient z-0"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center mb-3 border-4 border-blue-200 group-hover:border-blue-400 transition-all duration-300">
                  {item.images && item.images[0] ? (
                    <img src={item.images[0]} alt={item.name} className="w-20 h-20 object-cover rounded-full" />
                  ) : (
                    <FaBuilding size={40} className="text-blue-400" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-blue-700 mb-1 truncate group-hover:text-purple-700 transition">{item.name}</h3>
                <p className="text-gray-500 mb-1 text-sm">{item.city}, {item.state}</p>
                <span className="text-green-600 font-bold text-lg mb-2">₹{item.price}</span>
                <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow group-hover:bg-purple-600 transition">PG</div>
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
            Show More PGs &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default PG;
