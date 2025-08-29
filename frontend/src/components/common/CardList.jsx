// src/components/CardList.jsx
import React from 'react';
import { FaStar, FaMapMarkerAlt, FaWifi, FaCar, FaUtensils, FaSnowflake, FaTshirt, FaShieldAlt, FaDumbbell, FaLeaf, FaBook, FaBolt, FaVideo, FaCrown, FaHeart, FaEye, FaMale, FaFemale, FaUsers } from 'react-icons/fa';
import AutoImageCarousel from './AutoImageCarousel';

const CardList = ({ items = [], onCardClick, showLoadMore = false, loadMoreAction }) => {

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar 
        key={i} 
        className={`${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'} text-sm`}
      />
    ));
  };

  const getDiscountBadge = (item) => {
    if (item.roomTypes && item.roomTypes.length > 0) {
      const maxDiscount = Math.max(...item.roomTypes.map(room => {
        if (room.originalPrice && room.originalPrice > room.price) {
          return Math.round(((room.originalPrice - room.price) / room.originalPrice) * 100);
        }
        return 0;
      }));
      if (maxDiscount > 0) {
        return (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            UP TO {maxDiscount}% OFF
          </div>
        );
      }
    }
    if (item.originalPrice && item.originalPrice > item.price) {
      const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
      return (
        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          {discount}% OFF
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {items.length === 0 && (
        <div className="text-center py-12">
          <FaBuilding size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Items Found</h3>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map(item => (
          <div
            key={item._id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
            onClick={() => onCardClick(item)}
          >
            <div className="relative">
              <AutoImageCarousel
                images={item.images || []}
                alt={item.name}
                className="h-36"
                autoSlideInterval={4000}
                showControls
                showDots
                type="pg"
              />

              {getDiscountBadge(item)}

              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 z-20">
                <FaEye /> {item.analytics?.views || 0}
              </div>
            </div>

            <div className="p-3">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-base font-bold text-gray-800 group-hover:text-blue-600 transition line-clamp-1" title={item.name}>
                  {item.name}
                </h3>
                <button className="text-gray-400 hover:text-red-500 transition">
                  <FaHeart className="text-sm" />
                </button>
              </div>

              <div className="flex items-center justify-between mb-2 text-xs text-gray-600">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-1 text-red-500" />
                  <span>{item.city}, {item.state}</span>
                </div>
                {item.rating?.overall > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="flex">{renderStars(item.rating.overall)}</div>
                    <span>{item.rating.overall.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Amenities */}
              <div className="flex items-center flex-wrap gap-1 text-gray-600 mb-2">
                {(item.wifiAvailable || item.amenities?.includes('WiFi')) && <FaWifi className="text-blue-500 text-xs" />}
                {(item.parkingAvailable || item.amenities?.includes('Parking')) && <FaCar className="text-green-500 text-xs" />}
                {(item.foodIncluded || item.amenities?.includes('Food')) && <FaUtensils className="text-orange-500 text-xs" />}
                {(item.acAvailable || item.amenities?.includes('AC')) && <FaSnowflake className="text-cyan-500 text-xs" />}
                {(item.laundryAvailable || item.amenities?.includes('Laundry')) && <FaTshirt className="text-purple-500 text-xs" />}
                {(item.securityGuard || item.cctv || item.amenities?.includes('Security')) && <FaShieldAlt className="text-red-500 text-xs" />}
                {item.amenities?.includes('Gym') && <FaDumbbell className="text-gray-600 text-xs" />}
                {item.amenities?.includes('Garden') && <FaLeaf className="text-green-600 text-xs" />}
                {item.amenities?.includes('Study Room') && <FaBook className="text-indigo-500 text-xs" />}
                {(item.powerBackup || item.amenities?.includes('Power Backup')) && <FaBolt className="text-yellow-500 text-xs" />}
                {(item.cctv || item.amenities?.includes('CCTV')) && <FaVideo className="text-gray-700 text-xs" />}
                {item.featured && <FaCrown className="text-yellow-500 text-xs" />}
              </div>

              {/* Gender & Availability */}
              <div className="flex items-center justify-between mb-2">
                {item.genderAllowed && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      item.genderAllowed === 'male' ? 'bg-blue-100 text-blue-700' :
                      item.genderAllowed === 'female' ? 'bg-pink-100 text-pink-700' :
                      'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {item.genderAllowed === 'male' && <FaMale className="text-xs" />}
                    {item.genderAllowed === 'female' && <FaFemale className="text-xs" />}
                    {(item.genderAllowed === 'both' || item.genderAllowed === 'unisex') && <FaUsers className="text-xs" />}
                    <span className="capitalize">
                      {item.genderAllowed === 'both' || item.genderAllowed === 'unisex' ? 'Co-living' : item.genderAllowed === 'male' ? 'Boys' : 'Girls'}
                    </span>
                  </div>
                )}
                <div className="text-right text-xs font-semibold text-blue-600">
                  {item.availableRooms} beds available
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.priceRange && item.priceRange.min !== item.priceRange.max ? (
                    <span className="text-lg font-bold text-green-600">
                      ₹{item.priceRange.min?.toLocaleString()} - ₹{item.priceRange.max?.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-lg font-bold text-green-600">₹{item.price?.toLocaleString()}</span>
                  )}
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-xs text-gray-500 line-through">₹{item.originalPrice?.toLocaleString()}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showLoadMore && loadMoreAction && (
        <div className="flex justify-center mt-12">
          <button
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all text-lg tracking-wide"
            onClick={loadMoreAction}
          >
            View All Properties & Book Now →
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(CardList);
