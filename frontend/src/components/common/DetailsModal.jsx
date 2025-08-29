// src/components/DetailsModal.jsx
import React from 'react';
import { FaStar, FaWifi, FaCar, FaUtensils, FaSnowflake, FaTshirt, FaShieldAlt, FaDumbbell, FaLeaf, FaBook, FaBolt, FaVideo, FaCrown, FaMale, FaFemale, FaUsers } from 'react-icons/fa';
import AutoImageCarousel from './AutoImageCarousel';

const DetailsModal = ({ item, onClose, loading }) => {

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center">Loading...</div>
        ) : (
          <div className="p-6">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
              onClick={onClose}
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-4">{item.name}</h2>

            {/* Images Carousel */}
            <AutoImageCarousel
              images={item.images || []}
              alt={item.name}
              className="h-56 rounded-xl mb-4"
              showControls
              showDots
              type="pg"
            />

            {/* Address & Price */}
            <div className="mb-2 text-gray-700"><strong>Address:</strong> {item.address}, {item.city}, {item.state}</div>
            <div className="mb-2 text-gray-700"><strong>Price:</strong> {item.price?.toLocaleString() || (item.priceRange?.min?.toLocaleString() + ' - ' + item.priceRange?.max?.toLocaleString())} /month</div>
            <div className="mb-2 text-gray-700"><strong>Available Rooms:</strong> {item.availableRooms}</div>

            {/* Amenities */}
            <div className="mb-2 text-gray-700"><strong>Amenities:</strong> {item.amenities?.join(', ')}</div>

            {/* Highlights */}
            <div className="mb-2 text-gray-700"><strong>Highlights:</strong> {item.highlights?.join(', ')}</div>

            {/* Nearby */}
            <div className="mb-2 text-gray-700">
              <strong>Nearby:</strong> {item.nearby?.map(n => `${n.name} (${n.distance})`).join(', ')}
            </div>

            {/* Rating */}
            <div className="mb-2 text-gray-700">
              <strong>Rating:</strong> {item.rating?.overall?.toFixed(1) || 'N/A'} / 5
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(DetailsModal);
