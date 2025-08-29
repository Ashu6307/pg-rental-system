import React, { useContext, useState, useEffect } from 'react';
import MobileValidationInput from '../../components/validation/MobileValidationInput';
import UserNavbar from '../../components/UserNavbar';
import UserHeader from '../../components/UserHeader';
import UserFooter from '../../components/UserFooter';
import { AuthContext } from '../../context/AuthContext';
import { getBookings } from '../../services/bookingService';
import { showSuccess, showError, showWarning } from '../../utils/notifications';

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profilePhoto: user?.profilePhoto || '',
    address: user?.address || '',
    dob: user?.dob || '',
    gender: user?.gender || '',
  });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      const bookingRes = await getBookings();
      setBookings(bookingRes);
      setLoading(false);
    }
    fetchBookings();
  }, []);

  // Profile completeness calculation
  const completeness = [form.name, form.phone, form.profilePhoto, form.address, form.dob, form.gender].filter(Boolean).length / 6 * 100;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // TODO: Upload to server/cloudinary and get URL
    // For demo, show local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, profilePhoto: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const [phoneError, setPhoneError] = useState("");
  const handleSave = (e) => {
    e.preventDefault();
    // Strict validation: No field blank, valid phone, email, dob, gender
    const requiredFields = ['name', 'phone', 'profilePhoto', 'address', 'dob', 'gender', 'email'];
    for (let field of requiredFields) {
      if (!form[field] || form[field].trim() === '') {
        showError(`Please fill the ${field.replace(/([A-Z])/g, ' $1')} field.`);
        return;
      }
    }
    if (phoneError) {
      showError(phoneError);
      return;
    }
    // Email validation
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(form.email)) {
      showError('Please enter a valid email address.');
      return;
    }
    // DOB validation (must be past date and age >= 18)
    if (isNaN(Date.parse(form.dob)) || new Date(form.dob) >= new Date()) {
      showError('Please enter a valid date of birth (past date).');
      return;
    }
    const dobDate = new Date(form.dob);
    const age = new Date().getFullYear() - dobDate.getFullYear();
    const m = new Date().getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && new Date().getDate() < dobDate.getDate())) {
      age--;
    }
    if (age < 18) {
      showError('You must be at least 18 years old.');
      return;
    }
    // Gender validation
    if (!['male', 'female', 'other'].includes(form.gender)) {
      showError('Please select a valid gender.');
      return;
    }
    // Profile photo validation (basic)
    if (!form.profilePhoto.startsWith('http')) {
      showError('Please enter a valid profile photo URL (should start with http).');
      return;
    }
    // TODO: API call to update user profile
    showSuccess('Profile updated successfully!');
    setEditMode(false);
  };

  const handleChangePassword = () => {
    // TODO: Open change password modal
  };

  const handleKYCUpdate = () => {
    // TODO: Open KYC update modal
  };

  return (
    <>
      <UserNavbar />
      <UserHeader />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">User Profile</h2>
          <div className="mb-4">
            <div className="flex items-center gap-4">
              <img src={form.profilePhoto || '/default-avatar.png'} alt="Profile" className="h-20 w-20 rounded-full object-cover border" />
              <div>
                <div className="font-bold text-lg text-blue-700">{form.name}</div>
                <div className="text-sm text-gray-500">{form.email}</div>
                <div className="text-xs text-gray-400">Registered: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</div>
                <span className={`px-2 py-1 rounded text-xs ml-2 ${user?.kycStatus === 'verified' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>{user?.kycStatus || 'pending'}</span>
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-100 rounded-full h-3">
              <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${completeness}%` }}></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">Profile completeness: {Math.round(completeness)}%</div>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} disabled={!editMode} className="w-full px-3 py-2 border rounded focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" value={form.email} disabled className="w-full px-3 py-2 border rounded focus:outline-none bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Registration Date</label>
              <input type="text" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'} disabled className="w-full px-3 py-2 border rounded focus:outline-none bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">KYC Status</label>
              <input type="text" value={user?.kycStatus || 'pending'} disabled className="w-full px-3 py-2 border rounded focus:outline-none bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <MobileValidationInput
                value={form.phone}
                onChange={val => setForm({ ...form, phone: val })}
                error={phoneError}
                setError={setPhoneError}
                required
                disabled={!editMode}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input type="text" name="address" value={form.address} onChange={handleChange} disabled={!editMode} className="w-full px-3 py-2 border rounded focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input type="date" name="dob" value={form.dob} onChange={handleChange} disabled={!editMode} className="w-full px-3 py-2 border rounded focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} disabled={!editMode} className="w-full px-3 py-2 border rounded focus:outline-none">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col items-center mb-4">
              <img src={form.profilePhoto || '/default-avatar.png'} alt="Profile" className="h-20 w-20 rounded-full object-cover border mb-2" />
              {editMode && (
                <>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="mb-2" />
                  <input type="text" name="profilePhoto" value={form.profilePhoto} onChange={handleChange} placeholder="Profile Photo URL" className="border px-2 py-1 rounded w-full" />
                </>
              )}
            </div>
            <div className="flex gap-4 mt-6">
              {editMode ? (
                <>
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
                  <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setEditMode(false)}>Cancel</button>
                </>
              ) : (
                <>
                  <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => setEditMode(true)}>Edit Profile</button>
                  <button type="button" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700" onClick={handleChangePassword}>Change Password</button>
                  <button type="button" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={handleKYCUpdate}>Update KYC</button>
                </>
              )}
            </div>
          </form>
          <div className="mt-8">
            <h3 className="text-xl font-bold text-blue-700 mb-4">Booking History</h3>
            {loading ? (
              <div className="text-blue-600">Loading bookings...</div>
            ) : bookings.length === 0 ? (
              <div className="text-gray-500">No bookings found.</div>
            ) : (
              <ul className="space-y-4">
                {bookings.map(b => (
                  <li key={b._id} className="border-b pb-4 flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <span className="font-bold text-indigo-700">{b.itemType}:</span> {b.itemName} <br />
                      <span className="text-sm text-gray-500">Booking ID: {b._id}</span>
                    </div>
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow"
                        onClick={() => {/* TODO: download invoice */}}
                      >Download Invoice</button>
                      <span className={`px-2 py-1 rounded text-xs ${b.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{b.status}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <UserFooter />
    </>
  );
};

export default UserProfile;
