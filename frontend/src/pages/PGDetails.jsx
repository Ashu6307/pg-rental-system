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
} from "react-icons/fa"
import apiService from "../services/api"
import AutoImageCarousel from "../components/AutoImageCarousel"
import ScrollToTop from "../components/ScrollToTop"

const PGDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [pg, setPg] = useState(location.state?.pg || null)
  const [loading, setLoading] = useState(!location.state?.pg)

  useEffect(() => {
    if (!pg) {
      const fetchPG = async () => {
        setLoading(true)
        try {
          const response = await apiService.get(`/api/pgs/public/${id}`)
          if (response.success && response.data) {
            setPg(response.data)
          } else {
            setPg(null)
          }
        } catch (error) {
          setPg(null)
        } finally {
          setLoading(false)
        }
      }
      fetchPG()
    }
  }, [id, pg])

  const renderStars = (rating) => (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <FaStar key={i} className={`${i < Math.floor(rating) ? "text-amber-400" : "text-gray-300"} text-sm`} />
      ))}
    </div>
  )

  const getGenderIcon = () => {
    if (pg.genderAllowed === "male") return <FaMale className="text-blue-600 text-lg" />
    if (pg.genderAllowed === "female") return <FaFemale className="text-pink-600 text-lg" />
    return <FaUsers className="text-purple-600 text-lg" />
  }

  const getGenderText = () => {
    if (pg.genderAllowed === "male") return "Boys Only"
    if (pg.genderAllowed === "female") return "Girls Only"
    return "Co-Living"
  }

  const amenityIcons = [
    {
      condition: pg.wifiAvailable || pg.amenities?.includes("WiFi"),
      icon: FaWifi,
      color: "text-blue-500",
      label: "WiFi",
    },
    {
      condition: pg.parkingAvailable || pg.amenities?.includes("Parking"),
      icon: FaCar,
      color: "text-green-500",
      label: "Parking",
    },
    {
      condition: pg.foodIncluded || pg.amenities?.includes("Food"),
      icon: FaUtensils,
      color: "text-orange-500",
      label: "Food",
    },
    {
      condition: pg.acAvailable || pg.amenities?.includes("AC"),
      icon: FaSnowflake,
      color: "text-cyan-500",
      label: "AC",
    },
    {
      condition: pg.laundryAvailable || pg.amenities?.includes("Laundry"),
      icon: FaTshirt,
      color: "text-purple-500",
      label: "Laundry",
    },
    {
      condition: pg.securityGuard || pg.cctv || pg.amenities?.includes("Security"),
      icon: FaShieldAlt,
      color: "text-red-500",
      label: "Security",
    },
    { condition: pg.amenities?.includes("Gym"), icon: FaDumbbell, color: "text-gray-600", label: "Gym" },
    { condition: pg.amenities?.includes("Garden"), icon: FaLeaf, color: "text-green-600", label: "Garden" },
    { condition: pg.amenities?.includes("Study Room"), icon: FaBook, color: "text-indigo-500", label: "Study Room" },
    {
      condition: pg.powerBackup || pg.amenities?.includes("Power Backup"),
      icon: FaBolt,
      color: "text-yellow-500",
      label: "Power Backup",
    },
    { condition: pg.cctv || pg.amenities?.includes("CCTV"), icon: FaVideo, color: "text-gray-700", label: "CCTV" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!pg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <p className="text-xl text-gray-600">PG not found.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <ScrollToTop scrollOnMount={true} />

      {/* Header */}
      {/* <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <FaArrowLeft className="text-sm" />
            Back to Listings
          </button>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-2">
         <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-lg text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <FaArrowLeft className="text-sm" />
            Back to Listings
          </button>
          <h1 className="text-3xl font-extrabold text-gray-900 text-center drop-shadow-sm mr-48">PG Details</h1>
          <span></span>
        </div>
        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative">
              <AutoImageCarousel
                images={pg.images || []}
                alt={pg.name}
                className="h-80 lg:h-96 w-full"
                showControls
                showDots
                type="pg"
              />
              {pg.featured && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold shadow-lg">
                  <FaCrown className="text-xs" />
                  Featured
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="p-8 lg:p-10">
              <div className="space-y-6">
                {/* Title and Rating */}
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">{pg.name}</h1>
                  <div className="flex items-center gap-3 mb-4">
                    {renderStars(pg.rating?.overall || 0)}
                    <span className="text-lg font-semibold text-gray-800">
                      {pg.rating?.overall?.toFixed(1) || "N/A"}
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {pg.reviews?.total || 0} reviews
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <FaMapMarkerAlt className="text-red-500 text-lg mt-1 flex-shrink-0" />
                  <span className="text-gray-700 leading-relaxed">
                    {pg.address}, {pg.city}, {pg.state}
                  </span>
                </div>

                {/* Gender and Availability */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 bg-purple-50 px-4 py-3 rounded-xl">
                    {getGenderIcon()}
                    <span className="font-medium text-gray-800">{getGenderText()}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-green-50 px-4 py-3 rounded-xl">
                    <FaBed className="text-green-600" />
                    <span className="font-semibold text-green-800">{pg.availableRooms} beds available</span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                  <div className="flex items-baseline gap-2 mb-2">
                    <FaRupeeSign className="text-green-600 text-lg" />
                    <span className="text-3xl font-bold text-green-700">
                      {pg.price?.toLocaleString() ||
                        pg.priceRange?.min?.toLocaleString() + " - " + pg.priceRange?.max?.toLocaleString()}
                    </span>
                    <span className="text-gray-600">/month</span>
                    {pg.originalPrice && pg.originalPrice > pg.price && (
                      <span className="text-lg text-gray-500 line-through ml-2">
                        ₹{pg.originalPrice?.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {pg.deposit && (
                    <p className="text-sm text-gray-600">
                      Security Deposit: <span className="font-semibold">₹{pg.deposit.toLocaleString()}</span>
                    </p>
                  )}
                </div>

                {/* Book Now Button */}
                <button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 text-lg"
                  onClick={() => navigate("/user/login", { state: { redirectTo: `/pg/${pg._id}/book` } })}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="px-8 lg:px-10 py-8 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {amenityIcons
                .filter((amenity) => amenity.condition)
                .map((amenity, index) => {
                  const IconComponent = amenity.icon
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    >
                      <IconComponent className={`${amenity.color} text-2xl mb-2`} />
                      <span className="text-sm font-medium text-gray-700 text-center">{amenity.label}</span>
                    </div>
                  )
                })}
            </div>
          </div>

          {/* Details Grid */}
          <div className="px-8 lg:px-10 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Highlights */}
                <div className="bg-blue-50 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    Highlights
                  </h3>
                  <ul className="space-y-2">
                    {pg.highlights?.length ? (
                      pg.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-700">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          {highlight}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500 italic">No highlights listed.</li>
                    )}
                  </ul>
                </div>

                {/* Nearby Places */}
                <div className="bg-orange-50 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    Nearby Places
                  </h3>
                  <ul className="space-y-2">
                    {pg.nearby?.length ? (
                      pg.nearby.map((place, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-700">
                          <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                          {place.name} <span className="text-gray-500">({place.distance})</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500 italic">No nearby places listed.</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Room Types */}
                <div className="bg-green-50 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Room Types
                  </h3>
                  <div className="space-y-3">
                    {pg.roomTypes?.length ? (
                      pg.roomTypes.map((room, i) => {
                        const hasDiscount = room.originalPrice && room.originalPrice > room.price;
                        const discountPercent = hasDiscount
                          ? Math.round(((room.originalPrice - room.price) / room.originalPrice) * 100)
                          : 0;
                        return (
                          <div key={i} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                            <span className="font-medium text-gray-800">{room.type}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-green-700 font-bold text-lg">₹{room.price?.toLocaleString()}</span>
                              <span className="text-xs text-gray-500">/month</span>
                              {hasDiscount && (
                                <>
                                  <span className="text-xs text-gray-500 line-through ml-2">
                                    ₹{room.originalPrice?.toLocaleString()}
                                  </span>
                                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                                    {discountPercent}% off
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500 italic">No room types listed.</p>
                    )}
                  </div>
                </div>

                {/* Reviews */}
                <div className="bg-purple-50 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    Reviews
                  </h3>
                  <div className="space-y-4">
                    {pg.reviews?.list?.length ? (
                      pg.reviews.list.map((review, i) => (
                        <div key={i} className="p-4 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {renderStars(review.rating)}
                              <span className="font-semibold text-gray-800">{review.user}</span>
                            </div>
                            <span className="text-xs text-gray-500">{review.date}</span>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No reviews yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PGDetails
