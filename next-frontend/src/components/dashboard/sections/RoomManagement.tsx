'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  IndianRupee, 
  Zap,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Settings,
  Phone,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  User,
  Home,
  Wifi,
  Car,
  Wrench
} from 'lucide-react';

interface Room {
  id: string;
  floor: string;
  type: string;
  occupancy: string;
  rate: number;
  status: 'occupied' | 'partial' | 'available' | 'maintenance';
  tenants: string[];
  electricityReading?: number;
  lastBillAmount?: number;
  amenities?: string[];
  area?: number;
  furnished?: boolean;
}

interface Tenant {
  name: string;
  phone: string;
  checkIn: string;
  rent: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
}

const RoomManagement = () => {
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample room data with enhanced details
  const rooms: Room[] = [
    { 
      id: '101', 
      floor: 'Ground', 
      type: 'Double', 
      occupancy: '2/2', 
      rate: 8000, 
      status: 'occupied', 
      tenants: ['Rahul Sharma', 'Amit Kumar'],
      electricityReading: 1250,
      lastBillAmount: 1200,
      amenities: ['AC', 'WiFi', 'Attached Bathroom'],
      area: 120,
      furnished: true
    },
    { 
      id: '102', 
      floor: 'Ground', 
      type: 'Single', 
      occupancy: '1/1', 
      rate: 7500, 
      status: 'occupied', 
      tenants: ['Priya Singh'],
      electricityReading: 980,
      lastBillAmount: 800,
      amenities: ['AC', 'WiFi'],
      area: 100,
      furnished: true
    },
    { 
      id: '103', 
      floor: 'Ground', 
      type: 'Double', 
      occupancy: '1/2', 
      rate: 8000, 
      status: 'partial', 
      tenants: ['Neha Patel'],
      electricityReading: 1100,
      lastBillAmount: 600,
      amenities: ['AC', 'WiFi', 'Balcony'],
      area: 130,
      furnished: true
    },
    { 
      id: '104', 
      floor: 'Ground', 
      type: 'Triple', 
      occupancy: '0/3', 
      rate: 6500, 
      status: 'available', 
      tenants: [],
      amenities: ['Fan', 'WiFi'],
      area: 150,
      furnished: false
    },
    { 
      id: '201', 
      floor: 'First', 
      type: 'Double', 
      occupancy: '2/2', 
      rate: 8500, 
      status: 'occupied', 
      tenants: ['Ravi Gupta', 'Suresh Kumar'],
      electricityReading: 1350,
      lastBillAmount: 1300,
      amenities: ['AC', 'WiFi', 'Attached Bathroom', 'Balcony'],
      area: 140,
      furnished: true
    },
    { 
      id: '202', 
      floor: 'First', 
      type: 'Single', 
      occupancy: '1/1', 
      rate: 8000, 
      status: 'occupied', 
      tenants: ['Anjali Sharma'],
      electricityReading: 1050,
      lastBillAmount: 850,
      amenities: ['AC', 'WiFi', 'Study Table'],
      area: 110,
      furnished: true
    },
    { 
      id: '203', 
      floor: 'First', 
      type: 'Double', 
      occupancy: '1/2', 
      rate: 8500, 
      status: 'partial', 
      tenants: ['Vikash Singh'],
      electricityReading: 1180,
      lastBillAmount: 650,
      amenities: ['AC', 'WiFi'],
      area: 125,
      furnished: true
    },
    { 
      id: '204', 
      floor: 'First', 
      type: 'Triple', 
      occupancy: '3/3', 
      rate: 7000, 
      status: 'occupied', 
      tenants: ['Mohan Lal', 'Deepak Kumar', 'Rohit Sharma'],
      electricityReading: 1450,
      lastBillAmount: 1500,
      amenities: ['Fan', 'WiFi', 'Common Bathroom'],
      area: 160,
      furnished: false
    },
  ];

  // Enhanced tenant details
  const tenantDetails: { [key: string]: Tenant } = {
    'Rahul Sharma': { name: 'Rahul Sharma', phone: '+91-9876543210', checkIn: '15 Dec 2024', rent: 8000, dueDate: '1 Feb 2025', status: 'paid' },
    'Amit Kumar': { name: 'Amit Kumar', phone: '+91-8765432109', checkIn: '20 Jan 2025', rent: 8000, dueDate: '1 Feb 2025', status: 'pending' },
    'Priya Singh': { name: 'Priya Singh', phone: '+91-7654321098', checkIn: '5 Jan 2025', rent: 7500, dueDate: '5 Feb 2025', status: 'paid' },
    'Neha Patel': { name: 'Neha Patel', phone: '+91-6543210987', checkIn: '10 Jan 2025', rent: 8000, dueDate: '10 Feb 2025', status: 'overdue' },
    'Ravi Gupta': { name: 'Ravi Gupta', phone: '+91-5432109876', checkIn: '1 Dec 2024', rent: 8500, dueDate: '1 Feb 2025', status: 'paid' },
    'Suresh Kumar': { name: 'Suresh Kumar', phone: '+91-4321098765', checkIn: '15 Dec 2024', rent: 8500, dueDate: '15 Feb 2025', status: 'paid' },
    'Anjali Sharma': { name: 'Anjali Sharma', phone: '+91-3210987654', checkIn: '20 Dec 2024', rent: 8000, dueDate: '20 Feb 2025', status: 'pending' },
    'Vikash Singh': { name: 'Vikash Singh', phone: '+91-2109876543', checkIn: '25 Dec 2024', rent: 8500, dueDate: '25 Feb 2025', status: 'paid' },
    'Mohan Lal': { name: 'Mohan Lal', phone: '+91-1098765432', checkIn: '1 Jan 2025', rent: 7000, dueDate: '1 Feb 2025', status: 'paid' },
    'Deepak Kumar': { name: 'Deepak Kumar', phone: '+91-0987654321', checkIn: '10 Jan 2025', rent: 7000, dueDate: '10 Feb 2025', status: 'paid' },
    'Rohit Sharma': { name: 'Rohit Sharma', phone: '+91-9876543210', checkIn: '15 Jan 2025', rent: 7000, dueDate: '15 Feb 2025', status: 'pending' }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'occupied': return 'bg-green-100 text-green-800 border-green-200';
      case 'partial': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'available': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'occupied': return '🟢';
      case 'partial': return '🟡';
      case 'available': return '🔵';
      case 'maintenance': return '🔴';
      default: return '⚪';
    }
  };

  const getPaymentStatusColor = (status: string): string => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesFloor = selectedFloor === 'all' || room.floor === selectedFloor;
    const matchesSearch = room.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.tenants.some(tenant => tenant.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFloor && matchesSearch;
  });

  const RoomDetailModal = ({ room, onClose }: { room: Room; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Home className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Room {room.id}</h2>
                <p className="text-gray-500">{room.floor} Floor • {room.type} Sharing</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Close modal"
            >
              <XCircle className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Room Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">Room Status</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(room.status)}`}>
                  {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{room.occupancy}</p>
              <p className="text-sm text-gray-500">Current Occupancy</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">Monthly Rate</h3>
                <IndianRupee className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">₹{room.rate.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Per bed</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">Room Area</h3>
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{room.area || 'N/A'}</p>
              <p className="text-sm text-gray-500">sq ft</p>
            </div>
          </div>

          {/* Current Tenants */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Tenants</h3>
            {room.tenants.length > 0 ? (
              <div className="space-y-3">
                {room.tenants.map((tenantName, index) => {
                  const tenant = tenantDetails[tenantName];
                  return (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{tenant.name}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center space-x-1">
                                <Phone className="h-3 w-3" />
                                <span>{tenant.phone}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>Since {tenant.checkIn}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">₹{tenant.rent.toLocaleString()}/month</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(tenant.status)}`}>
                            {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No current tenants</p>
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Add Tenant
                </button>
              </div>
            )}
          </div>

          {/* Room Amenities */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {room.amenities?.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
                  {amenity === 'AC' && <Zap className="h-4 w-4 text-blue-600" />}
                  {amenity === 'WiFi' && <Wifi className="h-4 w-4 text-green-600" />}
                  {amenity === 'Parking' && <Car className="h-4 w-4 text-purple-600" />}
                  {!['AC', 'WiFi', 'Parking'].includes(amenity) && <CheckCircle className="h-4 w-4 text-gray-600" />}
                  <span className="text-sm font-medium text-gray-700">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Electricity Details */}
          {room.electricityReading && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Electricity Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-yellow-800">Current Reading</h4>
                    <Zap className="h-5 w-5 text-yellow-600" />
                  </div>
                  <p className="text-xl font-bold text-yellow-900">{room.electricityReading} units</p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-green-800">Last Bill</h4>
                    <IndianRupee className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-xl font-bold text-green-900">₹{room.lastBillAmount}</p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-blue-800">Per Tenant</h4>
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-xl font-bold text-blue-900">
                    ₹{room.tenants.length > 0 ? Math.round((room.lastBillAmount || 0) / room.tenants.length) : 0}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              <span>Add Tenant</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Zap className="h-4 w-4" />
              <span>Record Reading</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
              <Wrench className="h-4 w-4" />
              <span>Maintenance</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              <Edit className="h-4 w-4" />
              <span>Edit Room</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Room Detail Modal */}
      {showRoomModal && selectedRoom && (
        <RoomDetailModal 
          room={selectedRoom} 
          onClose={() => {
            setShowRoomModal(false);
            setSelectedRoom(null);
          }} 
        />
      )}
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Rooms</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <Building2 className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Occupied</p>
              <p className="text-2xl font-bold text-green-600">18</p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Available</p>
              <p className="text-2xl font-bold text-blue-600">4</p>
            </div>
            <Plus className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Monthly Income</p>
              <p className="text-2xl font-bold text-purple-600">₹1.8L</p>
            </div>
            <IndianRupee className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search rooms or tenants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select 
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Select Floor"
            >
              <option value="all">All Floors</option>
              <option value="Ground">Ground Floor</option>
              <option value="First">First Floor</option>
              <option value="Second">Second Floor</option>
            </select>
            
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </button>
          </div>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            <span>Add New Room</span>
          </button>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRooms.map((room) => (
          <div key={room.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Room Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-gray-900">Room {room.id}</span>
                  <span className="text-sm">{getStatusIcon(room.status)}</span>
                </div>
                <button 
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Room options"
                >
                  <MoreVertical className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              <p className="text-sm text-gray-500">{room.floor} Floor • {room.type} Sharing</p>
            </div>

            {/* Room Content */}
            <div className="p-4">
              {/* Occupancy Status */}
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(room.status)}`}>
                  {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                </span>
                <span className="text-sm font-medium text-gray-700">{room.occupancy}</span>
              </div>

              {/* Monthly Rate */}
              <div className="mb-3">
                <p className="text-lg font-bold text-gray-900">₹{room.rate.toLocaleString()}/month</p>
                <p className="text-xs text-gray-500">per bed</p>
              </div>

              {/* Current Tenants */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Current Tenants:</p>
                {room.tenants.length > 0 ? (
                  <div className="space-y-1">
                    {room.tenants.map((tenant, index) => (
                      <p key={index} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                        {tenant}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No current tenants</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => {
                    setSelectedRoom(room);
                    setShowRoomModal(true);
                  }}
                  className="flex items-center justify-center py-2 px-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </button>
                <button className="flex items-center justify-center py-2 px-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 text-xs">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </button>
                <button className="flex items-center justify-center py-2 px-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  Bills
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Room Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Room Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Add New Tenant</p>
              <p className="text-sm text-gray-500">Check-in new tenant to available room</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Bulk Meter Reading</p>
              <p className="text-sm text-gray-500">Record electricity readings for all rooms</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Room Configuration</p>
              <p className="text-sm text-gray-500">Update room types and pricing</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomManagement;
