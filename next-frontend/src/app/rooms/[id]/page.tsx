'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  FaArrowLeft, 
  FaShare, 
  FaHeart, 
  FaRegHeart,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaWifi,
  FaParking,
  FaUtensils,
  FaTv,
  FaSnowflake,
  FaCar,
  FaDumbbell,
  FaShieldAlt,
  FaUsers,
  FaCalendarAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaUser,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaBuilding,
  FaHome,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaRupeeSign,
  FaBolt,
  FaWater,
  FaTrash,
  FaLeaf,
  FaCouch,
  FaDoorOpen,
  FaImages,
  FaExpand
} from 'react-icons/fa';
import apiService from '@/services/api';

interface Room {
  _id: string;
  title: string;
  description: string;
  propertyType: 'Room' | 'Flat';
  pricePerMonth: number;
  securityDeposit: number;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    latitude?: number;
    longitude?: number;
  };
  amenities: string[];
  images: string[];
  areaImages?: {
    kitchen?: string[];
    bedroom?: string[];
    bathroom?: string[];
    livingRoom?: string[];
    balcony?: string[];
    parking?: string[];
    entrance?: string[];
    others?: Array<{
      label: string;
      images: string[];
    }>;
  };
  availability: {
    isAvailable: boolean;
    availableFrom: string;
    preferredTenants: string[];
  };
  roomDetails?: {
    roomType: 'Single' | 'Double' | 'Triple';
    furnishing: 'Fully Furnished' | 'Semi Furnished' | 'Unfurnished';
    hasAttachedBathroom: boolean;
    hasBalcony: boolean;
    floorNumber: number;
    roomSize: number;
  };
  flatDetails?: {
    bhkType: '1BHK' | '2BHK' | '3BHK' | '4BHK' | '1RK';
    furnishing: 'Fully Furnished' | 'Semi Furnished' | 'Unfurnished';
    bathrooms: number;
    balconies: number;
    floorNumber: number;
    totalFloors: number;
    carpetArea: number;
    builtUpArea: number;
  };
  owner: {
    _id: string;
    name: string;
    phone: string;
    email: string;
    profileImage?: string;
  };
  reviews: Array<{
    _id: string;
    user: {
      name: string;
      profileImage?: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
  }>;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

const amenityIcons: { [key: string]: React.ReactNode } = {
  'WiFi': <FaWifi className="text-blue-500" />,
  'Parking': <FaParking className="text-green-500" />,
  'Kitchen': <FaUtensils className="text-orange-500" />,
  'TV': <FaTv className="text-purple-500" />,
  'AC': <FaSnowflake className="text-blue-400" />,
  'Gym': <FaDumbbell className="text-red-500" />,
  'Security': <FaShieldAlt className="text-gray-600" />,
  'Laundry': <FaLeaf className="text-green-400" />,
  'Power Backup': <FaBolt className="text-yellow-500" />,
  'Water Supply': <FaWater className="text-blue-600" />,
  'Waste Management': <FaTrash className="text-gray-500" />,
};

const areaImageIcons: { [key: string]: React.ReactNode } = {
  'kitchen': <FaUtensils className="text-orange-500" />,
  'bedroom': <FaBed className="text-blue-500" />,
  'bathroom': <FaBath className="text-blue-400" />,
  'livingRoom': <FaCouch className="text-purple-500" />,
  'balcony': <FaHome className="text-green-500" />,
  'parking': <FaParking className="text-gray-600" />,
  'entrance': <FaDoorOpen className="text-brown-500" />,
  'others': <FaImages className="text-gray-500" />,
};

const RoomDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [selectedAreaImages, setSelectedAreaImages] = useState<{area: string, images: string[], currentIndex: number} | null>(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        const response = await apiService.get(`/rooms/${roomId}`);
        setRoom(response.data);
      } catch (err: any) {
        console.error('Error fetching room details:', err);
        setError(err.response?.data?.message || 'Failed to load room details');
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      fetchRoomDetails();
    }
  }, [roomId]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
    }

    return stars;
  };

  const handleShareProperty = () => {
    if (navigator.share && room) {
      navigator.share({
        title: room.title,
        text: room.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You can add a toast notification here
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Here you would typically make an API call to update favorites
  };

  const handleContactOwner = () => {
    setShowContactInfo(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const nextImage = () => {
    if (room?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
    }
  };

  const prevImage = () => {
    if (room?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Room not found'}
          </h2>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleShareProperty}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaShare />
            </button>
            <button
              onClick={handleToggleFavorite}
              className="p-2 text-gray-600 hover:text-red-500 transition-colors"
            >
              {isFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative mb-8">
              <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden">
                {room.images && room.images.length > 0 ? (
                  <Image
                    src={room.images[currentImageIndex]}
                    alt={room.title}
                    width={800}
                    height={450}
                    className="w-full h-[450px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[450px] bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No images available</span>
                  </div>
                )}
              </div>
              
              {room.images && room.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                  >
                    ›
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {room.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {room.propertyType === 'Room' ? (
                    <FaBed className="text-blue-500 mr-2" />
                  ) : (
                    <FaBuilding className="text-green-500 mr-2" />
                  )}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    room.propertyType === 'Room' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {room.propertyType}
                  </span>
                </div>
                
                {room.averageRating > 0 && (
                  <div className="flex items-center">
                    <div className="flex mr-2">
                      {renderStars(room.averageRating)}
                    </div>
                    <span className="text-gray-600 text-sm">
                      {room.averageRating.toFixed(1)} ({room.totalReviews} reviews)
                    </span>
                  </div>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{room.title}</h1>
              
              <div className="flex items-center text-gray-600 mb-4">
                <FaMapMarkerAlt className="mr-2" />
                <span>{room.location.address}, {room.location.city}, {room.location.state} - {room.location.pincode}</span>
              </div>

              <p className="text-gray-700 mb-6">{room.description}</p>

              {/* Property Specific Details */}
              {room.propertyType === 'Room' && room.roomDetails && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <FaBed className="mx-auto mb-2 text-blue-500" />
                    <div className="text-sm text-gray-600">Room Type</div>
                    <div className="font-semibold">{room.roomDetails.roomType}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <FaHome className="mx-auto mb-2 text-green-500" />
                    <div className="text-sm text-gray-600">Furnishing</div>
                    <div className="font-semibold">{room.roomDetails.furnishing}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <FaBath className="mx-auto mb-2 text-blue-400" />
                    <div className="text-sm text-gray-600">Bathroom</div>
                    <div className="font-semibold">
                      {room.roomDetails.hasAttachedBathroom ? 'Attached' : 'Shared'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <FaBuilding className="mx-auto mb-2 text-gray-500" />
                    <div className="text-sm text-gray-600">Floor</div>
                    <div className="font-semibold">{room.roomDetails.floorNumber}</div>
                  </div>
                </div>
              )}

              {room.propertyType === 'Flat' && room.flatDetails && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <FaHome className="mx-auto mb-2 text-blue-500" />
                    <div className="text-sm text-gray-600">Type</div>
                    <div className="font-semibold">{room.flatDetails.bhkType}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <FaBath className="mx-auto mb-2 text-blue-400" />
                    <div className="text-sm text-gray-600">Bathrooms</div>
                    <div className="font-semibold">{room.flatDetails.bathrooms}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <FaBuilding className="mx-auto mb-2 text-gray-500" />
                    <div className="text-sm text-gray-600">Floor</div>
                    <div className="font-semibold">
                      {room.flatDetails.floorNumber}/{room.flatDetails.totalFloors}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <FaHome className="mx-auto mb-2 text-green-500" />
                    <div className="text-sm text-gray-600">Area</div>
                    <div className="font-semibold">{room.flatDetails.carpetArea} sq ft</div>
                  </div>
                </div>
              )}

              {/* Amenities */}
              {room.amenities && room.amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {room.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <span className="mr-3">
                          {amenityIcons[amenity] || <FaCheckCircle className="text-green-500" />}
                        </span>
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Availability</h3>
                <div className="flex items-center mb-2">
                  {room.availability.isAvailable ? (
                    <FaCheckCircle className="text-green-500 mr-2" />
                  ) : (
                    <FaTimesCircle className="text-red-500 mr-2" />
                  )}
                  <span className={`font-medium ${
                    room.availability.isAvailable ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {room.availability.isAvailable ? 'Available' : 'Not Available'}
                  </span>
                </div>
                
                {room.availability.availableFrom && (
                  <div className="flex items-center mb-2">
                    <FaCalendarAlt className="text-blue-500 mr-2" />
                    <span className="text-gray-700">
                      Available from: {formatDate(room.availability.availableFrom)}
                    </span>
                  </div>
                )}

                {room.availability.preferredTenants && room.availability.preferredTenants.length > 0 && (
                  <div className="flex items-center">
                    <FaUsers className="text-purple-500 mr-2" />
                    <span className="text-gray-700">
                      Preferred tenants: {room.availability.preferredTenants.join(', ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Area Specific Images */}
              {room.areaImages && Object.keys(room.areaImages).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">Area Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.entries(room.areaImages).map(([area, images]) => {
                      if (!images) return null;
                      
                      let areaImages: string[] = [];
                      
                      if (area === 'others' && Array.isArray(images)) {
                        // Handle others which is an array of objects
                        const othersArray = images as Array<{label: string; images: string[]}>;
                        return othersArray.map((item, index) => (
                          <div
                            key={`${area}-${index}`}
                            className="relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => setSelectedAreaImages({
                              area: item.label,
                              images: item.images,
                              currentIndex: 0
                            })}
                          >
                            <div className="aspect-w-4 aspect-h-3">
                              <Image
                                src={item.images[0]}
                                alt={`${item.label} image`}
                                width={200}
                                height={150}
                                className="w-full h-32 object-cover"
                              />
                            </div>
                            
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <FaExpand className="text-white text-xl" />
                            </div>
                            
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                              <div className="flex items-center text-white">
                                {areaImageIcons['others']}
                                <span className="ml-2 text-sm font-medium">
                                  {item.label}
                                </span>
                                {item.images.length > 1 && (
                                  <span className="ml-auto text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                                    +{item.images.length}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ));
                      } else if (Array.isArray(images) && area !== 'others') {
                        areaImages = images as string[];
                      } else {
                        return null;
                      }
                      
                      if (areaImages.length === 0) return null;

                      return (
                        <div
                          key={area}
                          className="relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                          onClick={() => setSelectedAreaImages({
                            area: area,
                            images: areaImages,
                            currentIndex: 0
                          })}
                        >
                          <div className="aspect-w-4 aspect-h-3">
                            <Image
                              src={areaImages[0]}
                              alt={`${area} image`}
                              width={200}
                              height={150}
                              className="w-full h-32 object-cover"
                            />
                          </div>
                          
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <FaExpand className="text-white text-xl" />
                          </div>
                          
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                            <div className="flex items-center text-white">
                              {areaImageIcons[area] || <FaImages />}
                              <span className="ml-2 text-sm font-medium capitalize">
                                {area === 'livingRoom' ? 'Living Room' : area}
                              </span>
                              {areaImages.length > 1 && (
                                <span className="ml-auto text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                                  +{areaImages.length}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews */}
            {room.reviews && room.reviews.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Reviews</h3>
                <div className="space-y-4">
                  {room.reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                          {review.user.profileImage ? (
                            <Image
                              src={review.user.profileImage}
                              alt={review.user.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            <FaUser className="text-gray-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{review.user.name}</div>
                          <div className="flex items-center">
                            {renderStars(review.rating)}
                            <span className="ml-2 text-sm text-gray-600">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Pricing Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <FaRupeeSign className="text-green-600 mr-1" />
                    <span className="text-3xl font-bold text-green-600">
                      {room.pricePerMonth.toLocaleString('en-IN')}
                    </span>
                    <span className="text-gray-600 ml-1">/month</span>
                  </div>
                  
                  {room.securityDeposit > 0 && (
                    <div className="text-gray-600">
                      Security Deposit: ₹{room.securityDeposit.toLocaleString('en-IN')}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleContactOwner}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-4"
                >
                  Contact Owner
                </button>

                <div className="text-center text-sm text-gray-600">
                  Listed {formatDate(room.createdAt)}
                </div>
              </div>

              {/* Owner Info */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Property Owner</h3>
                
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    {room.owner.profileImage ? (
                      <Image
                        src={room.owner.profileImage}
                        alt={room.owner.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    ) : (
                      <FaUser className="text-gray-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{room.owner.name}</div>
                    <div className="text-sm text-gray-600">Property Owner</div>
                  </div>
                </div>

                {showContactInfo && (
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaPhoneAlt className="text-green-500 mr-3" />
                      <a 
                        href={`tel:${room.owner.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {room.owner.phone}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <FaEnvelope className="text-blue-500 mr-3" />
                      <a 
                        href={`mailto:${room.owner.email}`}
                        className="text-blue-600 hover:underline break-all"
                      >
                        {room.owner.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Area Images Modal */}
      {selectedAreaImages && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-semibold capitalize">
                {selectedAreaImages.area === 'livingRoom' ? 'Living Room' : selectedAreaImages.area} Images
              </h3>
              <button
                onClick={() => setSelectedAreaImages(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9">
                <Image
                  src={selectedAreaImages.images[selectedAreaImages.currentIndex]}
                  alt={`${selectedAreaImages.area} image ${selectedAreaImages.currentIndex + 1}`}
                  width={800}
                  height={450}
                  className="w-full h-[400px] object-cover"
                />
              </div>
              
              {selectedAreaImages.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedAreaImages(prev => prev ? {
                      ...prev,
                      currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length
                    } : null)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-opacity"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setSelectedAreaImages(prev => prev ? {
                      ...prev,
                      currentIndex: (prev.currentIndex + 1) % prev.images.length
                    } : null)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-opacity"
                    aria-label="Next image"
                  >
                    ›
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {selectedAreaImages.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedAreaImages(prev => prev ? {
                          ...prev,
                          currentIndex: index
                        } : null)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === selectedAreaImages.currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <div className="p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {selectedAreaImages.currentIndex + 1} of {selectedAreaImages.images.length}
                </span>
                <span className="text-sm text-gray-600">
                  {selectedAreaImages.area === 'livingRoom' ? 'Living Room' : selectedAreaImages.area}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetailsPage;
