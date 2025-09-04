'use client';

import React, { useState } from 'react';
import { 
  Home, 
  Building2, 
  Users, 
  IndianRupee, 
  Zap, 
  Wrench, 
  MessageSquare, 
  FileText, 
  Settings,
  Menu,
  X,
  TrendingUp,
  Calendar,
  Bell,
  BarChart3
} from 'lucide-react';

// Import dashboard sections
import MainDashboard from './sections/MainDashboard';
import RoomManagement from './sections/RoomManagement';
import TenantManagement from './sections/TenantManagement';
import FinancialManagement from './sections/FinancialManagement';
import UtilityManagement from './sections/UtilityManagement';
import MaintenanceManagement from './sections/MaintenanceManagement';
import CommunicationCenter from './sections/CommunicationCenter';
import DocumentManagement from './sections/DocumentManagement';
import SettingsPanel from './sections/SettingsPanel';
import AnalyticsReports from './sections/AnalyticsReports';

const OwnerDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
    { id: 'rooms', label: 'Room Management', icon: Building2, badge: null },
    { id: 'tenants', label: 'Tenant Management', icon: Users, badge: '42' },
    { id: 'financial', label: 'Financial', icon: IndianRupee, badge: '₹15K' },
    { id: 'utilities', label: 'Utilities', icon: Zap, badge: '3' },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench, badge: '5' },
    { id: 'communication', label: 'Messages', icon: MessageSquare, badge: '8' },
    { id: 'documents', label: 'Documents', icon: FileText, badge: null },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <MainDashboard />;
      case 'rooms':
        return <RoomManagement />;
      case 'tenants':
        return <TenantManagement />;
      case 'financial':
        return <FinancialManagement />;
      case 'utilities':
        return <UtilityManagement />;
      case 'maintenance':
        return <MaintenanceManagement />;
      case 'communication':
        return <CommunicationCenter />;
      case 'documents':
        return <DocumentManagement />;
      case 'analytics':
        return <AnalyticsReports />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <MainDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Green Valley PG</h1>
              <p className="text-sm text-gray-500">Owner Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            title="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-3 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-xs font-medium">Occupancy</p>
                  <p className="text-xl font-bold">87.5%</p>
                </div>
                <TrendingUp className="h-6 w-6 text-green-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-xs font-medium">Revenue</p>
                  <p className="text-xl font-bold">₹1.2L</p>
                </div>
                <IndianRupee className="h-6 w-6 text-blue-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-6">
          <div className="px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`
                      px-2 py-1 text-xs font-bold rounded-full
                      ${isActive 
                        ? 'bg-white text-blue-600' 
                        : 'bg-red-500 text-white'
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">AS</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Ashutosh Singh</p>
              <p className="text-sm text-gray-500">Owner Account</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                title="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 capitalize">
                  {activeSection === 'dashboard' ? 'Dashboard Overview' : activeSection.replace(/([A-Z])/g, ' $1')}
                </h2>
                <p className="text-gray-500 text-sm">
                  {new Date().toLocaleDateString('en-IN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Quick Actions */}
              <button className="p-2 rounded-lg hover:bg-gray-100 relative" title="Notifications">
                <Bell className="h-6 w-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              
              <button className="p-2 rounded-lg hover:bg-gray-100" title="Calendar">
                <Calendar className="h-6 w-6 text-gray-600" />
              </button>

              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">AS</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default OwnerDashboard;
