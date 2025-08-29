import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaCheckCircle, FaExclamationCircle, FaPhone } from 'react-icons/fa';
import FileUpload from '../../components/FileUpload.jsx';
import { formatPhoneNumber, isValidIndianMobile } from '../../utils/validation/mobileValidation';
import { handleNameChange, isValidName, getNameValidationError, formatName } from '../../utils/validation/nameValidation';
import { handleEmailChange, isValidEmail, getEmailValidationError } from '../../utils/validation/emailValidation';

export default function OwnerProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', consent: false });
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState(''); // Name validation error
  const [emailError, setEmailError] = useState(''); // Email validation error

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/owner/profile');
      setProfile(res.data);
      setForm({
        name: res.data.name || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
        address: res.data.address || '',
        consent: res.data.consent || false
      });
      setAvatar(res.data.avatar || '');
    } catch (err) {
      setError('Error fetching profile');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'phone') {
      const formatted = formatPhoneNumber(value);
      setForm({ ...form, phone: formatted });
    } else {
      setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put('/api/owner/profile', form);
      fetchProfile();
    } catch (err) {
      setError('Error updating profile');
    }
    setLoading(false);
  };

  const handleAvatarUpload = async (url) => {
    setLoading(true);
    try {
      await axios.post('/api/owner/profile/avatar', { avatarUrl: url });
      setAvatar(url);
      fetchProfile();
    } catch (err) {
      setError('Avatar upload failed');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Owner Profile & KYC</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="relative">
              <input 
                name="name" 
                value={form.name} 
                onChange={(e) => {
                  const processedValue = handleNameChange(e.target.value, 
                    (value) => setForm({...form, name: value}), 
                    setNameError
                  );
                }}
                placeholder="Name (4-20 chars)" 
                maxLength="20"
                className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md placeholder-gray-400 focus:outline-none sm:text-sm ${
                  nameError 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : form.name && isValidName(form.name)
                      ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                required 
              />
              <div className="absolute right-3 top-2.5 flex items-center space-x-1">
                {form.name && (
                  isValidName(form.name) ? (
                    <FaCheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <FaExclamationCircle className="h-4 w-4 text-red-500" />
                  )
                )}
              </div>
            </div>
            <div className="flex justify-between items-center mt-1">
              <div className="h-4">
                {nameError && (
                  <p className="text-xs text-red-600">{nameError}</p>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {form.name.length}/20
              </div>
            </div>
          </div>
          <div>
            <div className="relative">
              <input 
                name="email" 
                type="email"
                value={form.email} 
                onChange={(e) => {
                  const processedValue = handleEmailChange(
                    e.target.value, 
                    (value) => setForm({...form, email: value}), 
                    setEmailError
                  );
                }}
                placeholder="Email Address" 
                className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md placeholder-gray-400 focus:outline-none sm:text-sm ${
                  emailError 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : form.email && isValidEmail(form.email)
                      ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                required 
              />
              
              {/* Email validation icons */}
              {emailError ? (
                <FaExclamationCircle className="absolute right-3 top-2.5 h-5 w-5 text-red-500" />
              ) : form.email && isValidEmail(form.email) ? (
                <FaCheckCircle className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
              ) : (
                <FaEnvelope className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              )}
            </div>
            
            {/* Email Error Message - Fixed height container */}
            <div className="h-5 mt-1">
              {emailError && (
                <p className="text-xs text-red-600">{emailError}</p>
              )}
            </div>
          </div>
          
          <div className="relative">
            <input 
              name="phone" 
              value={form.phone} 
              onChange={handleChange} 
              type="tel"
              maxLength="10"
              placeholder="Phone Number" 
              className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md placeholder-gray-400 focus:outline-none sm:text-sm ${
                form.phone && isValidIndianMobile(form.phone)
                  ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                  : form.phone && form.phone.length > 0 && !isValidIndianMobile(form.phone)
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            <div className="absolute right-3 top-2.5">
              {form.phone && isValidIndianMobile(form.phone) ? (
                <FaCheckCircle className="h-5 w-5 text-green-500" />
              ) : form.phone && form.phone.length > 0 ? (
                <FaExclamationCircle className="h-5 w-5 text-red-500" />
              ) : (
                <FaPhone className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>
          {/* Fixed height container for error message */}
          <div className="h-5 mt-1">
            {form.phone && form.phone.length > 0 && !isValidIndianMobile(form.phone) && (
              <p className="text-red-500 text-xs">
                📱 Please enter a valid Indian mobile number (10 digits, starting with 6-9)
              </p>
            )}
          </div>
          
          <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="input" />
          <label className="flex items-center">
            <input type="checkbox" name="consent" checked={form.consent} onChange={handleChange} /> GDPR/Data Consent
          </label>
        </div>
        <button type="submit" className="mt-4 btn btn-primary" disabled={loading}>Update Profile</button>
      </form>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Profile Image</h3>
        {avatar && <img src={avatar} alt="Avatar" className="h-20 w-20 object-cover rounded-full border mb-2" />}
        <FileUpload onUpload={handleAvatarUpload} accept="image/*" />
      </div>
      {profile && (
        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">KYC Status</h3>
          <div>Status: <span className="font-bold">{profile.KYC_status}</span></div>
          <div>Approval: <span className="font-bold">{profile.approval_status}</span></div>
          {profile.rejection_reason && <div>Rejection Reason: {profile.rejection_reason}</div>}
        </div>
      )}
    </div>
  );
}
