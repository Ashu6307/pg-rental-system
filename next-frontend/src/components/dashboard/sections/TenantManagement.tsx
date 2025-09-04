'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  Calendar, 
  IndianRupee, 
  MapPin, 
  User, 
  Mail, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Edit,
  Eye,
  MessageSquare,
  FileText,
  Clock,
  Home
} from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  phone: string;
  email: string;
  room: string;
  checkIn: string;
  rent: number;
  deposit: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  emergencyContact: string;
  idProof: string;
  profileImage?: string;
  agreementEnd: string;
  lastPayment: string;
  totalPaid: number;
}

const TenantManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showTenantModal, setShowTenantModal] = useState(false);

  // Sample tenant data
  const tenants: Tenant[] = [
    {
      id: '1',
      name: 'Rahul Sharma',
      phone: '+91-9876543210',
      email: 'rahul.sharma@email.com',
      room: '101-A',
      checkIn: '15 Dec 2024',
      rent: 8000,
      deposit: 16000,
      dueDate: '1 Feb 2025',
      status: 'paid',
      emergencyContact: '+91-9876543200',
      idProof: 'Aadhaar: 1234-5678-9012',
      agreementEnd: '15 Dec 2025',
      lastPayment: '1 Jan 2025',
      totalPaid: 24000
    },
    {
      id: '2',
      name: 'Priya Singh',
      phone: '+91-7654321098',
      email: 'priya.singh@email.com',
      room: '102',
      checkIn: '5 Jan 2025',
      rent: 7500,
      deposit: 15000,
      dueDate: '5 Feb 2025',
      status: 'paid',
      emergencyContact: '+91-7654321000',
      idProof: 'Aadhaar: 2345-6789-0123',
      agreementEnd: '5 Jan 2026',
      lastPayment: '5 Jan 2025',
      totalPaid: 22500
    },
    {
      id: '3',
      name: 'Amit Kumar',
      phone: '+91-8765432109',
      email: 'amit.kumar@email.com',
      room: '101-B',
      checkIn: '20 Jan 2025',
      rent: 8000,
      deposit: 16000,
      dueDate: '1 Feb 2025',
      status: 'pending',
      emergencyContact: '+91-8765432100',
      idProof: 'Driving License: DL123456789',
      agreementEnd: '20 Jan 2026',
      lastPayment: '20 Jan 2025',
      totalPaid: 24000
    },
    {
      id: '4',
      name: 'Neha Patel',
      phone: '+91-6543210987',
      email: 'neha.patel@email.com',
      room: '103-A',
      checkIn: '10 Jan 2025',
      rent: 8000,
      deposit: 16000,
      dueDate: '10 Jan 2025',
      status: 'overdue',
      emergencyContact: '+91-6543210900',
      idProof: 'Aadhaar: 3456-7890-1234',
      agreementEnd: '10 Jan 2026',
      lastPayment: '10 Dec 2024',
      totalPaid: 16000
    },
    {
      id: '5',
      name: 'Ravi Gupta',
      phone: '+91-5432109876',
      email: 'ravi.gupta@email.com',
      room: '201-A',
      checkIn: '1 Dec 2024',
      rent: 8500,
      deposit: 17000,
      dueDate: '1 Feb 2025',
      status: 'paid',
      emergencyContact: '+91-5432109800',
      idProof: 'Passport: P1234567',
      agreementEnd: '1 Dec 2025',
      lastPayment: '1 Jan 2025',
      totalPaid: 34000
    }
  ];

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <XCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.phone.includes(searchTerm) ||
                         tenant.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || tenant.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const TenantDetailModal = ({ tenant, onClose }: { tenant: Tenant; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">{tenant.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{tenant.name}</h2>
                <p className="text-gray-500">Room {tenant.room} • Tenant ID: {tenant.id}</p>
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
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-green-800">Monthly Rent</h3>
                <IndianRupee className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-xl font-bold text-green-900">₹{tenant.rent.toLocaleString()}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-blue-800">Security Deposit</h3>
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-xl font-bold text-blue-900">₹{tenant.deposit.toLocaleString()}</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-purple-800">Total Paid</h3>
                <CheckCircle className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-xl font-bold text-purple-900">₹{tenant.totalPaid.toLocaleString()}</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-800">Payment Status</h3>
                {getStatusIcon(tenant.status)}
              </div>
              <span className={`px-2 py-1 rounded-full text-sm font-medium border ${getStatusColor(tenant.status)}`}>
                {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium text-gray-900">{tenant.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium text-gray-900">{tenant.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">ID Proof</p>
                    <p className="font-medium text-gray-900">{tenant.idProof}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Home className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Room Number</p>
                    <p className="font-medium text-gray-900">{tenant.room}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Check-in Date</p>
                    <p className="font-medium text-gray-900">{tenant.checkIn}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Emergency Contact</p>
                    <p className="font-medium text-gray-900">{tenant.emergencyContact}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Payment Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next Due Date:</span>
                    <span className="font-medium text-gray-900">{tenant.dueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Payment:</span>
                    <span className="font-medium text-gray-900">{tenant.lastPayment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Agreement End:</span>
                    <span className="font-medium text-gray-900">{tenant.agreementEnd}</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Payment History</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Jan 2025</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Paid</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Dec 2024</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Paid</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Nov 2024</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Paid</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <IndianRupee className="h-4 w-4" />
              <span>Record Payment</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <MessageSquare className="h-4 w-4" />
              <span>Send Message</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
              <FileText className="h-4 w-4" />
              <span>Generate Agreement</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              <Edit className="h-4 w-4" />
              <span>Edit Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tenant Detail Modal */}
      {showTenantModal && selectedTenant && (
        <TenantDetailModal 
          tenant={selectedTenant} 
          onClose={() => {
            setShowTenantModal(false);
            setSelectedTenant(null);
          }} 
        />
      )}

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Tenants</p>
              <p className="text-2xl font-bold text-gray-900">{tenants.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Paid This Month</p>
              <p className="text-2xl font-bold text-green-600">{tenants.filter(t => t.status === 'paid').length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Payments</p>
              <p className="text-2xl font-bold text-yellow-600">{tenants.filter(t => t.status === 'pending').length}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{tenants.filter(t => t.status === 'overdue').length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tenants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Filter by payment status"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
            
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </button>
          </div>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            <span>Add New Tenant</span>
          </button>
        </div>
      </div>

      {/* Tenant List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            All Tenants ({filteredTenants.length})
          </h3>
          
          <div className="space-y-4">
            {filteredTenants.map((tenant) => (
              <div key={tenant.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{tenant.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{tenant.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Home className="h-3 w-3" />
                          <span>Room {tenant.room}</span>
                        </span>
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
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">₹{tenant.rent.toLocaleString()}/month</p>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(tenant.status)}`}>
                          {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                        </span>
                        <span className="text-xs text-gray-500">Due: {tenant.dueDate}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedTenant(tenant);
                          setShowTenantModal(true);
                        }}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                        title="Record payment"
                      >
                        <IndianRupee className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100"
                        title="Send message"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantManagement;
