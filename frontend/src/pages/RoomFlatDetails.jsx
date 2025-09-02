"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import {
  FaMapMarkerAlt,
  FaStar,
  FaWifi,
  FaCar,
  FaUtensils,
  FaSnowflake,
  FaTshirt,
  FaShieldAlt,
  FaDumbbell,
  FaLeaf,
  FaBook,
  FaBolt,
  FaVideo,
  FaCrown,
  FaMale,
  FaFemale,
  FaUsers,
  FaArrowLeft,
  FaBed,
  FaRupeeSign,
  FaHome,
  FaBath,
  FaKey,
  FaParking,
  FaEye,
  FaHeart,
  FaPhone,
  FaWhatsapp,
  FaEnvelope
} from "react-icons/fa"
import apiService from "../services/api"
import AutoImageCarousel from "../components/AutoImageCarousel"
import ScrollToTop from "../components/ScrollToTop"

const RoomFlatDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [property, setProperty] = useState(location.state?.property || null)
  const [loading, setLoading] = useState(!location.state?.property)

  useEffect(() => {
    if (!property) {
      const fetchProperty = async () => {
        setLoading(true)
        try {
          const response = await apiService.get(`/api/rooms/public/${id}`)
          if (response.success && response.data) {
            setProperty(response.data)
          } else {
            setProperty(null)
          }
        } catch (error) {
          setProperty(null)
        } finally {
          setLoading(false)
        }
      }
      fetchProperty()
    }
  }, [id, property])

  const renderStars = (rating) => (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <FaStar key={i} className={`${i < Math.floor(rating) ? "text-amber-400" : "text-gray-300"} text-sm`} />
      ))}
    </div>
  )

  const getGenderIcon = () => {
    const genderPref = property.tenantPreferences?.genderPreference
    if (genderPref === "Male") return <FaMale className="text-blue-600 text-lg" />
    if (genderPref === "Female") return <FaFemale className="text-pink-600 text-lg" />
    return <FaUsers className="text-green-600 text-lg" />
  }

  const getGenderText = () => {
    const genderPref = property.tenantPreferences?.genderPreference
    if (genderPref === "Male") return "Boys Only"
    if (genderPref === "Female") return "Girls Only"
    return "Co-living"
  }

  const getPropertyTypeIcon = () => {
    return property.propertyType === 'Room' ? 
      <FaBed className="text-purple-600 text-xl" /> : 
      <FaHome className="text-indigo-600 text-xl" />
  }

  const getPropertyConfig = () => {
    if (property.propertyType === 'Room' && property.roomConfig) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-purple-600">{property.roomConfig.roomType}</div>
            <div className="text-xs text-gray-600">Room Type</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-blue-600">{property.roomConfig.area} sq ft</div>
            <div className="text-xs text-gray-600">Area</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-green-600">Floor {property.roomConfig.floor}</div>
            <div className="text-xs text-gray-600">Location</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-orange-600">{property.roomConfig.acType}</div>
            <div className="text-xs text-gray-600">AC Type</div>
          </div>
        </div>
      )
    }

    if (property.propertyType === 'Flat' && property.flatConfig) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-indigo-50 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-indigo-600">{property.flatConfig.flatType}</div>
            <div className="text-xs text-gray-600">Flat Type</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-blue-600">{property.flatConfig.areas.carpetArea} sq ft</div>
            <div className="text-xs text-gray-600">Carpet Area</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-green-600">Floor {property.flatConfig.floor}/{property.flatConfig.totalFloors}</div>
            <div className="text-xs text-gray-600">Floor</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-purple-600">{property.flatConfig.furnishingStatus}</div>
            <div className="text-xs text-gray-600">Furnishing</div>
          </div>
        </div>
      )
    }

    return null
  }

  const amenityIcons = [
    { condition: property.amenities?.basic?.wifi, icon: FaWifi, color: "text-blue-500", label: "WiFi" },
    { condition: property.amenities?.basic?.parking, icon: FaCar, color: "text-green-500", label: "Parking" },
    { condition: property.amenities?.room?.ac, icon: FaSnowflake, color: "text-cyan-500", label: "AC" },
    { condition: property.amenities?.basic?.security || property.amenities?.basic?.cctv, icon: FaShieldAlt, color: "text-red-500", label: "Security" },
    { condition: property.amenities?.services?.laundry, icon: FaTshirt, color: "text-purple-500", label: "Laundry" },
    { condition: property.amenities?.society?.gym, icon: FaDumbbell, color: "text-gray-600", label: "Gym" },
    { condition: property.amenities?.society?.garden, icon: FaLeaf, color: "text-green-600", label: "Garden" },
    { condition: property.amenities?.basic?.powerBackup, icon: FaBolt, color: "text-yellow-500", label: "Power Backup" },
    { condition: property.amenities?.basic?.cctv, icon: FaVideo, color: "text-gray-700", label: "CCTV" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50">
        <div className="text-center">
          <FaKey className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition flex items-center gap-2 mx-auto"
          >
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <ScrollToTop scrollOnMount={true} behavior="smooth" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-purple-100 hover:bg-purple-200 px-4 py-2 rounded-lg text-purple-600 hover:text-purple-800 transition-colors font-medium"
          >
            <FaArrowLeft className="text-sm" />
            Back to Listings
          </button>
          <h1 className="text-3xl font-extrabold text-gray-900 text-center drop-shadow-sm mr-48">Property Details</h1>
          <span></span>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative">
              <AutoImageCarousel
                images={property.media?.images || []}
                alt={property.name}
                className="h-80 lg:h-96 w-full"
                showControls
                showDots
                type="room"
              />
              {property.propertyStatus?.featured && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold shadow-lg">
                  <FaCrown className="text-xs" />
                  Featured
                </div>
              )}
              {property.propertyStatus?.verified && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold shadow-lg">
                  <FaCheck className="text-xs" />
                  Verified
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="p-8 lg:p-10">
              <div className="space-y-6">
                {/* Title and Rating */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    {getPropertyTypeIcon()}
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      {property.propertyType}
                    </span>
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">{property.name}</h1>
                  <div className="flex items-center gap-3 mb-4">
                    {property.averageRating > 0 ? (
                      <>
                        {renderStars(property.averageRating)}
                        <span className="text-lg font-semibold text-gray-800">
                          {property.averageRating?.toFixed(1) || "N/A"}
                        </span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {property.reviews?.length || 0} reviews
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-500">No reviews yet</span>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <FaMapMarkerAlt className="text-red-500 text-lg mt-1 flex-shrink-0" />
                  <span className="text-gray-700 leading-relaxed">
                    {property.address}, {property.locality}, {property.city}, {property.state} - {property.pincode}
                  </span>
                </div>

                {/* Gender and Availability */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 bg-purple-50 px-4 py-3 rounded-xl">
                    {getGenderIcon()}
                    <span className="font-medium text-gray-800">{getGenderText()}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-green-50 px-4 py-3 rounded-xl">
                    <FaBed className="text-green-600 text-lg" />
                    <span className="font-medium text-gray-800">
                      {property.availableUnits}/{property.totalUnits} Available
                    </span>
                  </div>
                </div>

                {/* Property Configuration */}
                {getPropertyConfig()}

                {/* Pricing */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-3xl font-bold text-green-600">₹{property.pricing?.rent?.toLocaleString()}</span>
                      <span className="text-gray-600 ml-2">per month</span>
                    </div>
                    <FaRupeeSign className="text-green-600 text-2xl" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Security Deposit:</span>
                      <span className="font-semibold ml-2">₹{property.pricing?.securityDeposit?.toLocaleString()}</span>
                    </div>
                    {property.pricing?.maintenanceCharges > 0 && (
                      <div>
                        <span className="text-gray-600">Maintenance:</span>
                        <span className="font-semibold ml-2">₹{property.pricing.maintenanceCharges?.toLocaleString()}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">Electricity:</span>
                      <span className="font-semibold ml-2">{property.pricing?.electricityCharges}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Water:</span>
                      <span className="font-semibold ml-2">{property.pricing?.waterCharges}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="p-8 lg:p-10 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities & Features</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-4">
              {amenityIcons.map((amenity, index) => (
                amenity.condition && (
                  <div key={index} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <amenity.icon className={`${amenity.color} text-2xl mb-2`} />
                    <span className="text-xs text-center text-gray-600 font-medium">{amenity.label}</span>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="p-8 lg:p-10 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Property</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {property.description}
            </p>
          </div>

          {/* Tenant Preferences */}
          <div className="p-8 lg:p-10 border-t border-gray-200 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tenant Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-600">Occupation</div>
                <div className="font-semibold">{property.tenantPreferences?.occupationType || 'Any'}</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-600">Age Group</div>
                <div className="font-semibold">{property.tenantPreferences?.ageGroup || 'Any'}</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-600">Food Habits</div>
                <div className="font-semibold">{property.tenantPreferences?.foodHabits || 'Any'}</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-600">Max Occupancy</div>
                <div className="font-semibold">{property.tenantPreferences?.maximumOccupancy || 'N/A'} people</div>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {property.tenantPreferences?.smokingAllowed === false && (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">No Smoking</span>
              )}
              {property.tenantPreferences?.drinkingAllowed === false && (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">No Drinking</span>
              )}
              {property.tenantPreferences?.petsAllowed === false && (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">No Pets</span>
              )}
              {property.tenantPreferences?.guestsAllowed && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Guests Allowed</span>
              )}
            </div>
          </div>

          {/* Contact Section */}
          <div className="p-8 lg:p-10 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {property.contact?.primaryPhone && (
                <a
                  href={`tel:${property.contact.primaryPhone}`}
                  className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <FaPhone className="text-blue-600 text-xl" />
                  <div>
                    <div className="font-semibold text-gray-800">Call</div>
                    <div className="text-blue-600">{property.contact.primaryPhone}</div>
                  </div>
                </a>
              )}
              
              {property.contact?.whatsappNumber && (
                <a
                  href={`https://wa.me/91${property.contact.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <FaWhatsapp className="text-green-600 text-xl" />
                  <div>
                    <div className="font-semibold text-gray-800">WhatsApp</div>
                    <div className="text-green-600">{property.contact.whatsappNumber}</div>
                  </div>
                </a>
              )}
              
              {property.contact?.email && (
                <a
                  href={`mailto:${property.contact.email}`}
                  className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <FaEnvelope className="text-purple-600 text-xl" />
                  <div>
                    <div className="font-semibold text-gray-800">Email</div>
                    <div className="text-purple-600">{property.contact.email}</div>
                  </div>
                </a>
              )}
            </div>
            
            {property.contact?.availability && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Contact Hours</div>
                <div className="font-semibold">
                  {property.contact.availability.callTime?.start} - {property.contact.availability.callTime?.end}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Preferred: {property.contact.availability.preferredContactMethod}
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="p-8 lg:p-10 border-t border-gray-200 bg-gray-50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{property.analytics?.views?.total || 0}</div>
                <div className="text-sm text-gray-600">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{property.analytics?.inquiries || 0}</div>
                <div className="text-sm text-gray-600">Inquiries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{property.propertyStatus?.qualityScore || 0}%</div>
                <div className="text-sm text-gray-600">Quality Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {property.propertyStatus?.verified ? 'Yes' : 'No'}
                </div>
                <div className="text-sm text-gray-600">Verified</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomFlatDetails
