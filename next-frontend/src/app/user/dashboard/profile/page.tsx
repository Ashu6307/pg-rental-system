'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Edit2,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Lock,
  Bell,
  CreditCard,
  Award,
  LogOut
} from 'lucide-react';
import toast from 'react-hot-toast';
import RoleBasedLayout from '@/components/RoleBasedLayout';
import { userDashboardService } from '@/services/userDashboardService';
import { useAuth } from '@/context/AuthContext';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  dateOfBirth?: string;
  avatar?: string;
  profilePicture?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  verificationStatus?: {
    email: boolean;
    phone: boolean;
    documents: boolean;
  };
  kycStatus?: 'pending' | 'verified' | 'rejected';
  dateJoined: string;
  joinedDate?: Date;
}

export default function ProfilePage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await userDashboardService.getUserProfile();
      setProfile(data);
      setFormData(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await userDashboardService.updateUserProfile(formData);
      setProfile({ ...profile, ...formData } as UserProfile);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile || {});
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const getKycBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
            <X className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <RoleBasedLayout role="user">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </RoleBasedLayout>
    );
  }

  if (!profile) {
    return (
      <RoleBasedLayout role="user">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Profile not found</p>
          </div>
        </div>
      </RoleBasedLayout>
    );
  }

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
                  <h1 className="text-3xl font-bold mb-1">My Profile</h1>
                  <p className="text-blue-100 text-sm">Manage your personal information</p>
                </div>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-xl hover:shadow-lg transition-all font-medium"
                >
                  <Edit2 className="w-5 h-5" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                {/* Profile Picture */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                  {(profile.avatar || profile.profilePicture) ? (
                    <img
                      src={profile.avatar || profile.profilePicture}
                      alt={profile.name}
                      className="w-full h-full rounded-full object-cover border-4 border-blue-100"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-200">
                      <User className="w-16 h-16 text-blue-600" />
                    </div>
                  )}
                  <button 
                    className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all"
                    aria-label="Upload profile picture"
                    title="Upload profile picture"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>

                {/* Profile Info */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile.name}</h2>
                  <p className="text-gray-500 text-sm mb-4">{profile.email}</p>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {profile.emailVerified && (
                      <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Email Verified
                      </span>
                    )}
                    {profile.phoneVerified && (
                      <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Phone Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* KYC Status */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">KYC Status</span>
                    {getKycBadge(profile.kycStatus || 'pending')}
                  </div>
                  {profile.kycStatus !== 'verified' && (
                    <button className="w-full mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all">
                      Complete KYC
                    </button>
                  )}
                </div>

                {/* Member Since */}
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Member Since</p>
                  <p className="text-lg font-bold text-blue-600">{formatDate(profile.dateJoined || profile.joinedDate || new Date())}</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 space-y-2">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                
                <button className="w-full flex items-center justify-between p-3 bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 rounded-xl transition-all">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <Lock className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-700">Change Password</span>
                  </div>
                  <Edit2 className="w-5 h-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-3 bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 rounded-xl transition-all">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <Bell className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-700">Notification Settings</span>
                  </div>
                  <Edit2 className="w-5 h-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-3 bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 rounded-xl transition-all">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-700">Payment Methods</span>
                  </div>
                  <Edit2 className="w-5 h-5 text-gray-400" />
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center p-3 bg-red-50 hover:bg-red-100 border-2 border-red-200 hover:border-red-300 rounded-xl transition-all mt-4"
                >
                  <LogOut className="w-5 h-5 text-red-600 mr-2" />
                  <span className="font-medium text-red-600">Logout</span>
                </button>
              </div>
            </div>

            {/* Profile Details Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
                  {isEditing && (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleCancel}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all font-medium"
                      >
                        <X className="w-5 h-5" />
                        <span>Cancel</span>
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-medium disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-600"
                        placeholder="Enter your full name"
                        aria-label="Full name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleInputChange}
                        disabled={true}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-600"
                        placeholder="your@email.com"
                        aria-label="Email address"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-600"
                        placeholder="+91 XXXXX XXXXX"
                        aria-label="Phone number"
                      />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-600"
                        aria-label="Date of birth"
                        title="Date of birth"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="address"
                        value={formData.address || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-600"
                        placeholder="Enter your address"
                        aria-label="Address"
                      />
                    </div>
                  </div>

                  {/* City, State, Pincode */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-600"
                        placeholder="City"
                        aria-label="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-600"
                        placeholder="State"
                        aria-label="State"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-600"
                        placeholder="Pincode"
                        aria-label="Pincode"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Statistics */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Account Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                    <p className="text-3xl font-bold text-blue-600">0</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Reviews Given</p>
                    <p className="text-3xl font-bold text-blue-600">0</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                    <p className="text-3xl font-bold text-blue-600">₹0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleBasedLayout>
  );
}
