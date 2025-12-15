'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Heart,
  MapPin,
  DollarSign,
  Star,
  Users,
  Wifi,
  Coffee,
  Car,
  ArrowLeft,
  Search,
  X,
  Grid3x3,
  List,
  ChevronRight,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import RoleBasedLayout from '@/components/RoleBasedLayout';
import { userDashboardService } from '@/services/userDashboardService';

interface Property {
  _id: string;
  pg_name: string;
  address: string;
  city?: string;
  rent: { min: number; max: number };
  images: string[];
  rating: number;
  reviewsCount?: number;
  amenities: string[];
  roomType?: string;
  maxOccupancy?: number;
  verified: boolean;
}

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    filterFavorites();
  }, [searchQuery, favorites]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await userDashboardService.getFavoritePGs();
      setFavorites(response.favorites.map((fav: any) => fav.pgId));
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const filterFavorites = () => {
    let filtered = [...favorites];

    if (searchQuery) {
      filtered = filtered.filter(
        (property) =>
          property.pg_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (property.city && property.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
          property.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredFavorites(filtered);
  };

  const removeFavorite = async (propertyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setRemovingId(propertyId);
      await userDashboardService.toggleFavorite(propertyId);
      setFavorites(favorites.filter((fav) => fav._id !== propertyId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
    } finally {
      setRemovingId(null);
    }
  };

  const getAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes('wifi')) return <Wifi className="w-4 h-4" />;
    if (lowerAmenity.includes('food') || lowerAmenity.includes('meal')) return <Coffee className="w-4 h-4" />;
    if (lowerAmenity.includes('parking')) return <Car className="w-4 h-4" />;
    return null;
  };

  return (
    <RoleBasedLayout role="user">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="bg-blue-600 rounded-3xl shadow-2xl mb-8 p-8 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/user/dashboard')}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
                  aria-label="Back to dashboard"
                  title="Back to dashboard"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold mb-1 flex items-center">
                    <Heart className="w-8 h-8 mr-3 fill-white" />
                    Saved Properties
                  </h1>
                  <p className="text-blue-100 text-sm">Your favorite PGs and accommodations</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm text-blue-100">Total Saved</p>
                  <p className="text-2xl font-bold">{favorites.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and View Toggle */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search saved properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                    title="Clear search"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  aria-label="Grid view"
                  title="Grid view"
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  aria-label="List view"
                  title="List view"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Favorites Grid/List */}
          {loading ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredFavorites.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Saved Properties</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? 'No properties match your search'
                  : 'Start exploring and save your favorite properties'}
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-medium"
              >
                Explore Properties
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFavorites.map((property) => (
                <div
                  key={property._id}
                  onClick={() => router.push(`/pg/${property._id}`)}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer relative"
                >
                  {/* Property Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={property.images[0] || '/placeholder.jpg'}
                      alt={property.pg_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Remove Favorite Button */}
                    <button
                      onClick={(e) => removeFavorite(property._id, e)}
                      disabled={removingId === property._id}
                      className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full transition-all hover:scale-110 disabled:opacity-50"
                    >
                      {removingId === property._id ? (
                        <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                      )}
                    </button>
                    {/* Rating Badge */}
                    {property.rating > 0 && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 rounded-full flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-bold text-gray-900">{property.rating.toFixed(1)}</span>
                        <span className="text-xs text-gray-500">({property.reviewsCount})</span>
                      </div>
                    )}
                  </div>

                  {/* Property Details */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {property.pg_name}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                        {property.city}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2 text-blue-600" />
                        {property.roomType} • Max {property.maxOccupancy} guests
                      </div>
                    </div>

                    {/* Amenities */}
                    {property.amenities && property.amenities.length > 0 && (
                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        {property.amenities.slice(0, 3).map((amenity, index) => (
                          <div
                            key={index}
                            className="flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium"
                          >
                            {getAmenityIcon(amenity)}
                            <span className="ml-1">{amenity}</span>
                          </div>
                        ))}
                        {property.amenities.length > 3 && (
                          <span className="text-xs text-gray-500">+{property.amenities.length - 3} more</span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">Starting from</p>
                        <p className="text-xl font-bold text-blue-600">₹{property.rent.min.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">per month</p>
                      </div>
                      <ChevronRight className="w-6 h-6 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFavorites.map((property) => (
                <div
                  key={property._id}
                  onClick={() => router.push(`/pg/${property._id}`)}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Property Image */}
                    <div className="relative md:w-1/3 h-64 md:h-auto overflow-hidden">
                      <img
                        src={property.images[0] || '/placeholder.jpg'}
                        alt={property.pg_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <button
                        onClick={(e) => removeFavorite(property._id, e)}
                        disabled={removingId === property._id}
                        className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full transition-all hover:scale-110 disabled:opacity-50"
                      >
                        {removingId === property._id ? (
                          <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                        )}
                      </button>
                    </div>

                    {/* Property Details */}
                    <div className="md:w-2/3 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {property.pg_name}
                          </h3>
                          {property.rating > 0 && (
                            <div className="flex items-center space-x-1 px-3 py-1 bg-blue-50 rounded-full">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm font-bold text-gray-900">{property.rating.toFixed(1)}</span>
                              <span className="text-xs text-gray-500">({property.reviewsCount})</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                            {property.address}, {property.city}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-2 text-blue-600" />
                            {property.roomType} • Max {property.maxOccupancy} guests
                          </div>
                        </div>

                        {/* Amenities */}
                        {property.amenities && property.amenities.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap mb-4">
                            {property.amenities.slice(0, 5).map((amenity, index) => (
                              <div
                                key={index}
                                className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium"
                              >
                                {getAmenityIcon(amenity)}
                                <span className="ml-1">{amenity}</span>
                              </div>
                            ))}
                            {property.amenities.length > 5 && (
                              <span className="text-xs text-gray-500">+{property.amenities.length - 5} more</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500">Starting from</p>
                          <p className="text-2xl font-bold text-blue-600">₹{property.rent.min.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">per month</p>
                        </div>
                        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-medium flex items-center">
                          View Details
                          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </RoleBasedLayout>
  );
}
