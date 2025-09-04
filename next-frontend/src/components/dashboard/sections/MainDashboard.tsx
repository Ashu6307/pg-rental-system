'use client';

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building2, 
  IndianRupee, 
  AlertTriangle,
  Plus,
  FileText,
  MessageSquare,
  Calendar
} from 'lucide-react';

const MainDashboard = () => {
  // Sample data - will be replaced with real API calls
  const stats = {
    monthlyRevenue: { amount: 125000, growth: 12.5, isPositive: true },
    totalRooms: { count: 24, occupied: 21, available: 3 },
    currentOccupants: { count: 42, total: 48, rate: 87.5 },
    pendingBills: { amount: 15500, count: 7 },
    pendingActions: { count: 8 }
  };

  const recentActivities = [
    { type: 'checkin', tenant: 'Ram Kumar', room: '205', time: '2 hours ago' },
    { type: 'bill', room: '103', amount: 1200, time: '1 day ago' },
    { type: 'checkout', tenant: 'Shyam Singh', room: '108', time: '3 days ago' },
    { type: 'maintenance', room: '301', issue: 'AC repair', time: '1 week ago' }
  ];

  const quickActions = [
    { id: 'add-tenant', label: 'Add New Tenant', icon: Plus, color: 'bg-blue-500', action: () => {} },
    { id: 'generate-bills', label: 'Generate Bills', icon: FileText, color: 'bg-green-500', action: () => {} },
    { id: 'send-reminders', label: 'Send Payment Reminders', icon: MessageSquare, color: 'bg-yellow-500', action: () => {} },
    { id: 'schedule-maintenance', label: 'Schedule Maintenance', icon: Calendar, color: 'bg-purple-500', action: () => {} }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Monthly Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{(stats.monthlyRevenue.amount / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <IndianRupee className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {stats.monthlyRevenue.isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              stats.monthlyRevenue.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.monthlyRevenue.growth}% from last month
            </span>
          </div>
        </div>

        {/* Total Rooms */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Rooms</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRooms.count}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Occupied: {stats.totalRooms.occupied}</span>
              <span className="text-gray-500">Available: {stats.totalRooms.available}</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(stats.totalRooms.occupied / stats.totalRooms.count) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Current Occupants */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Current Occupants</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.currentOccupants.count}/{stats.currentOccupants.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">
              Occupancy Rate: {stats.currentOccupants.rate}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${stats.currentOccupants.rate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Pending Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Actions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingActions.count}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-red-600 font-medium">Requires attention</p>
            <p className="text-xs text-gray-500 mt-1">
              Including ₹{(stats.pendingBills.amount / 1000).toFixed(1)}K pending bills
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={action.action}
                className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300"
              >
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-gray-700">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500" title="Select time period">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
              <option>This year</option>
            </select>
          </div>
          <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-2" />
              <p className="text-gray-500">Revenue Chart</p>
              <p className="text-sm text-gray-400">Chart implementation coming soon</p>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => {
              let icon, color, text;
              
              switch (activity.type) {
                case 'checkin':
                  icon = Users;
                  color = 'text-green-600 bg-green-100';
                  text = `${activity.tenant} checked-in Room ${activity.room}`;
                  break;
                case 'checkout':
                  icon = Users;
                  color = 'text-red-600 bg-red-100';
                  text = `${activity.tenant} checked-out Room ${activity.room}`;
                  break;
                case 'bill':
                  icon = FileText;
                  color = 'text-blue-600 bg-blue-100';
                  text = `Electricity bill generated Room ${activity.room} - ₹${activity.amount}`;
                  break;
                case 'maintenance':
                  icon = AlertTriangle;
                  color = 'text-yellow-600 bg-yellow-100';
                  text = `${activity.issue} - Room ${activity.room}`;
                  break;
                default:
                  icon = Calendar;
                  color = 'text-gray-600 bg-gray-100';
                  text = 'Unknown activity';
              }
              
              const Icon = icon;
              
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{text}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="w-full mt-4 text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All Activities
          </button>
        </div>
      </div>

      {/* Pending Tasks Summary */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">Pending Tasks</h3>
              <p className="text-sm text-yellow-700">Items requiring your attention</p>
            </div>
          </div>
          <span className="text-2xl font-bold text-yellow-800">{stats.pendingActions.count}</span>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-3">
            <p className="text-sm font-medium text-gray-900">Meter Readings</p>
            <p className="text-lg font-bold text-blue-600">5 rooms</p>
            <p className="text-xs text-gray-500">Due for reading</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-sm font-medium text-gray-900">Payment Follow-ups</p>
            <p className="text-lg font-bold text-red-600">7 tenants</p>
            <p className="text-xs text-gray-500">₹15.5K pending</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-sm font-medium text-gray-900">Maintenance</p>
            <p className="text-lg font-bold text-yellow-600">3 requests</p>
            <p className="text-xs text-gray-500">Pending resolution</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
