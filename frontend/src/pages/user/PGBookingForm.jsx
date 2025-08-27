
import React, { useState } from 'react';
import { FaEnvelope, FaCheckCircle, FaExclamationCircle, FaPhone } from 'react-icons/fa';
import TermsPopup from '../components/TermsPopup';
import { bookPG } from '../api/pgBookingAPI';
import { formatPhoneNumber, isValidIndianMobile } from '../../utils/mobileValidation';
import { handleNameChange, isValidName, getNameValidationError, formatName } from '../../utils/nameValidation';
import { handleEmailChange, isValidEmail, getEmailValidationError } from '../../utils/emailValidation';

const PGBookingForm = ({ pg }) => {
  const colors = { main: 'bg-blue-50', btn: 'bg-blue-600 hover:bg-blue-700', text: 'text-blue-700' };
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(''); // Name validation error
  const [emergencyNameError, setEmergencyNameError] = useState(''); // Emergency contact name error
  const [emailError, setEmailError] = useState(''); // Email validation error
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [panNumber, setPanNumber] = useState('');
  const [panFile, setPanFile] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [gender, setGender] = useState('');
  const [occupation, setOccupation] = useState('');
  const [age, setAge] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [consent, setConsent] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [message, setMessage] = useState('');

  // Phone number formatters
  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleEmergencyPhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setEmergencyPhone(formatted);
  };

  // Dummy OTP send
  const sendOtp = () => {
    setOtpSent(true);
    setMessage('OTP sent to your mobile/email');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptedTerms || !consent) {
      setMessage('Please accept Terms & Conditions and Data Consent');
      return;
    }
    const formData = new FormData();
    formData.append('pgId', pg._id);
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('address', address);
    formData.append('aadhaarNumber', aadhaarNumber);
    if (aadhaarFile) formData.append('aadhaarFile', aadhaarFile);
    formData.append('panNumber', panNumber);
    if (panFile) formData.append('panFile', panFile);
    if (profilePhoto) formData.append('profilePhoto', profilePhoto);
    formData.append('emergencyName', emergencyName);
    formData.append('emergencyPhone', emergencyPhone);
    formData.append('gender', gender);
    formData.append('occupation', occupation);
    formData.append('age', age);
    formData.append('otp', otp);
    formData.append('consent', consent);
    formData.append('acceptedTerms', acceptedTerms);
    try {
      // TODO: Replace with actual token from auth context/store
      const token = localStorage.getItem('token');
      const res = await bookPG(formData, token);
      setMessage('PG booking submitted!');
    } catch (err) {
      setMessage(err.error || 'Booking failed');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${colors.main}`}>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h2 className={`text-3xl font-extrabold mb-6 text-center ${colors.text}`}>PG Booking</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Full Name <span className="text-red-500">*</span></label>
          <div className="relative">
            <input 
              type="text" 
              value={name} 
              onChange={(e) => {
                const processedValue = handleNameChange(e.target.value, setName, setNameError);
              }}
              maxLength="20"
              className={`w-full border rounded px-3 py-2 pr-10 ${
                nameError 
                  ? 'border-red-500' 
                  : name && isValidName(name)
                    ? 'border-green-500'
                    : 'border-gray-300'
              }`}
              placeholder="Enter your full name (4-20 chars)"
              required 
            />
            <div className="absolute right-3 top-2.5 flex items-center space-x-1">
              {name && (
                isValidName(name) ? (
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
              {name.length}/20 characters
            </div>
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Phone Number <span className="text-red-500">*</span></label>
          <div className="relative">
            <input 
              type="tel" 
              value={phone} 
              onChange={handlePhoneChange} 
              maxLength="10"
              className={`appearance-none block w-full px-3 py-2 pr-10 border rounded placeholder-gray-400 focus:outline-none sm:text-sm ${
                phone && isValidIndianMobile(phone)
                  ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                  : phone && phone.length > 0 && !isValidIndianMobile(phone)
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Enter mobile number (e.g., 9876543210)" 
              required 
            />
            <div className="absolute right-3 top-2.5">
              {phone && isValidIndianMobile(phone) ? (
                <FaCheckCircle className="h-5 w-5 text-green-500" />
              ) : phone && phone.length > 0 ? (
                <FaExclamationCircle className="h-5 w-5 text-red-500" />
              ) : (
                <FaPhone className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>
          {/* Fixed height container for error message */}
          <div className="h-5 mt-1">
            {phone && phone.length > 0 && !isValidIndianMobile(phone) && (
              <p className="text-red-500 text-xs">
                📱 Please enter a valid Indian mobile number (10 digits, starting with 6-9)
              </p>
            )}
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Email Address <span className="text-red-500">*</span></label>
          <div className="relative">
            <input 
              type="email" 
              value={email} 
              onChange={(e) => {
                const processedValue = handleEmailChange(
                  e.target.value, 
                  setEmail, 
                  setEmailError
                );
              }}
              className={`appearance-none block w-full px-3 py-2 pr-10 border rounded placeholder-gray-400 focus:outline-none ${
                emailError 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : email && isValidEmail(email)
                    ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Enter your email address"
              required 
            />
            
            {/* Email validation icons */}
            {emailError ? (
              <FaExclamationCircle className="absolute right-3 top-2.5 h-5 w-5 text-red-500" />
            ) : email && isValidEmail(email) ? (
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
        <div>
          <label className="block font-semibold mb-1">Address</label>
          <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Profile Photo</label>
          <input type="file" accept=".jpg,.jpeg,.png" onChange={e => setProfilePhoto(e.target.files[0])} />
        </div>
        <div>
          <label className="block font-semibold mb-1">Aadhaar Number</label>
          <input type="text" value={aadhaarNumber} onChange={e => setAadhaarNumber(e.target.value)} className="w-full border rounded px-3 py-2" required />
          <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={e => setAadhaarFile(e.target.files[0])} className="mt-2" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">PAN Number (optional)</label>
          <input type="text" value={panNumber} onChange={e => setPanNumber(e.target.value)} className="w-full border rounded px-3 py-2" />
          <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={e => setPanFile(e.target.files[0])} className="mt-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Emergency Contact Name</label>
          <div className="relative">
            <input 
              type="text" 
              value={emergencyName} 
              onChange={(e) => {
                const processedValue = handleNameChange(e.target.value, setEmergencyName, setEmergencyNameError);
              }}
              maxLength="20"
              className={`w-full border rounded px-3 py-2 pr-10 ${
                emergencyNameError 
                  ? 'border-red-500' 
                  : emergencyName && isValidName(emergencyName)
                    ? 'border-green-500'
                    : 'border-gray-300'
              }`}
              placeholder="Emergency contact name (4-20 chars)"
            />
            <div className="absolute right-3 top-2.5 flex items-center space-x-1">
              {emergencyName && (
                isValidName(emergencyName) ? (
                  <FaCheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <FaExclamationCircle className="h-4 w-4 text-red-500" />
                )
              )}
            </div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <div className="h-4">
              {emergencyNameError && (
                <p className="text-xs text-red-600">{emergencyNameError}</p>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {emergencyName.length}/20 characters
            </div>
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Emergency Contact Phone</label>
          <div className="relative">
            <input 
              type="tel" 
              value={emergencyPhone} 
              onChange={handleEmergencyPhoneChange} 
              maxLength="10"
              className={`appearance-none block w-full px-3 py-2 pr-10 border rounded placeholder-gray-400 focus:outline-none sm:text-sm ${
                emergencyPhone && isValidIndianMobile(emergencyPhone)
                  ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                  : emergencyPhone && emergencyPhone.length > 0 && !isValidIndianMobile(emergencyPhone)
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Enter emergency contact number" 
            />
            <div className="absolute right-3 top-2.5">
              {emergencyPhone && isValidIndianMobile(emergencyPhone) ? (
                <FaCheckCircle className="h-5 w-5 text-green-500" />
              ) : emergencyPhone && emergencyPhone.length > 0 ? (
                <FaExclamationCircle className="h-5 w-5 text-red-500" />
              ) : (
                <FaPhone className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>
          {/* Fixed height container for error message */}
          <div className="h-5 mt-1">
            {emergencyPhone && emergencyPhone.length > 0 && !isValidIndianMobile(emergencyPhone) && (
              <p className="text-red-500 text-xs">
                📱 Please enter a valid Indian mobile number
              </p>
            )}
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Gender</label>
          <select value={gender} onChange={e => setGender(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Occupation</label>
          <input type="text" value={occupation} onChange={e => setOccupation(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Age</label>
          <input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
        <button type="button" onClick={sendOtp} className="bg-yellow-600 text-white px-4 py-2 rounded shadow hover:bg-yellow-700">Send OTP</button>
        {otpSent && (
          <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter OTP" className="w-full border rounded px-3 py-2 mt-2" />
        )}
        </div>
        <div className="font-bold text-lg mt-4 text-blue-700">Security Charge: ₹{pg.securityCharge || 0} (Refundable)</div>
        <div className="mt-2">
          <label className="inline-flex items-center">
            <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
            <span className="ml-2">I consent to data privacy & GDPR</span>
          </label>
        </div>
        <button type="button" onClick={() => setShowTerms(true)} className="bg-gray-600 text-white px-4 py-2 rounded shadow hover:bg-gray-700">View Terms & Conditions</button>
        <button
          type="submit"
          className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow ml-4 ${(!acceptedTerms || !consent) ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!acceptedTerms || !consent}
        >
          Book Now
        </button>
        </form>
        <TermsPopup isOpen={showTerms} type="pg_booking" onAccept={() => setAcceptedTerms(true)} onClose={() => setShowTerms(false)} />
        {message && <div className="mt-4 text-green-600 font-semibold text-center">{message}</div>}
      </div>
    </div>
  );
};

export default PGBookingForm;
