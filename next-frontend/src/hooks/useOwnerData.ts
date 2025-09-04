'use client';

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import apiService from '@/services/api';

interface OwnerStats {
  totalProperties: number;
  totalTenants: number;
  occupancyRate: number;
  monthlyRevenue: number;
  pendingPayments: number;
  maintenanceRequests: number;
  totalRooms: number;
  availableRooms: number;
}

interface OwnerProperty {
  id: string;
  name: string;
  address: string;
  totalRooms: number;
  occupiedRooms: number;
  monthlyRevenue: number;
  type: string;
}

interface OwnerNotification {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'maintenance' | 'system';
  time: string;
  isRead: boolean;
}

interface OwnerData {
  stats: OwnerStats;
  properties: OwnerProperty[];
  notifications: OwnerNotification[];
  recentActivities: any[];
}

export const useOwnerData = () => {
  const { user, token, isAuthenticated } = useContext(AuthContext) || {};
  const [ownerData, setOwnerData] = useState<OwnerData>({
    stats: {
      totalProperties: 0,
      totalTenants: 0,
      occupancyRate: 0,
      monthlyRevenue: 0,
      pendingPayments: 0,
      maintenanceRequests: 0,
      totalRooms: 0,
      availableRooms: 0
    },
    properties: [],
    notifications: [],
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default data for development/fallback
  const defaultData: OwnerData = {
    stats: {
      totalProperties: 3,
      totalTenants: 28,
      occupancyRate: 87.5,
      monthlyRevenue: 125000,
      pendingPayments: 5,
      maintenanceRequests: 3,
      totalRooms: 32,
      availableRooms: 4
    },
    properties: [
      {
        id: '1',
        name: 'Green Valley PG',
        address: 'Sector 21, Noida',
        totalRooms: 15,
        occupiedRooms: 13,
        monthlyRevenue: 65000,
        type: 'PG'
      },
      {
        id: '2',
        name: 'Sunrise Hostel',
        address: 'Karol Bagh, Delhi',
        totalRooms: 12,
        occupiedRooms: 10,
        monthlyRevenue: 45000,
        type: 'Hostel'
      },
      {
        id: '3',
        name: 'City View Apartments',
        address: 'Cyber City, Gurgaon',
        totalRooms: 5,
        occupiedRooms: 5,
        monthlyRevenue: 15000,
        type: 'Flat'
      }
    ],
    notifications: [
      {
        id: '1',
        title: 'New Booking Request',
        message: 'Room 101 - A new booking request from John Doe',
        type: 'booking',
        time: '2 min ago',
        isRead: false
      },
      {
        id: '2',
        title: 'Payment Received',
        message: 'Monthly rent payment of ₹8,000 from Room 205',
        type: 'payment',
        time: '1 hour ago',
        isRead: false
      },
      {
        id: '3',
        title: 'Maintenance Request',
        message: 'AC repair needed in Room 304',
        type: 'maintenance',
        time: '3 hours ago',
        isRead: true
      }
    ],
    recentActivities: [
      { id: '1', activity: 'New tenant checked in - Room 102', time: '1 hour ago' },
      { id: '2', activity: 'Payment received from Room 205', time: '2 hours ago' },
      { id: '3', activity: 'Maintenance completed - Room 301', time: '4 hours ago' }
    ]
  };

  const fetchOwnerData = async () => {
    if (!isAuthenticated || !token) {
      setOwnerData(defaultData);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard overview data
      const response = await apiService.get('/api/owner/dashboard/overview', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data) {
        const apiData = response.data;
        
        // Transform API data to match our interface
        const transformedData: OwnerData = {
          stats: {
            totalProperties: apiData.totalProperties || defaultData.stats.totalProperties,
            totalTenants: apiData.totalTenants || defaultData.stats.totalTenants,
            occupancyRate: apiData.occupancyRate || defaultData.stats.occupancyRate,
            monthlyRevenue: apiData.monthlyRevenue || defaultData.stats.monthlyRevenue,
            pendingPayments: apiData.pendingPayments || defaultData.stats.pendingPayments,
            maintenanceRequests: apiData.maintenanceRequests || defaultData.stats.maintenanceRequests,
            totalRooms: apiData.totalRooms || defaultData.stats.totalRooms,
            availableRooms: apiData.availableRooms || defaultData.stats.availableRooms
          },
          properties: apiData.properties || defaultData.properties,
          notifications: apiData.notifications || defaultData.notifications,
          recentActivities: apiData.recentActivities || defaultData.recentActivities
        };

        setOwnerData(transformedData);
      } else {
        setOwnerData(defaultData);
      }
    } catch (error) {
      console.error('Error fetching owner data:', error);
      setError('Failed to fetch owner data');
      // Use default data as fallback
      setOwnerData(defaultData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerData();
  }, [isAuthenticated, token]);

  // Helper functions
  const getOwnerName = () => {
    return user?.businessName || user?.ownerName || user?.name || 'Rita Tiwari';
  };

  const getPrimaryPropertyName = () => {
    if (ownerData.properties.length > 0) {
      return ownerData.properties[0].name;
    }
    return 'Green Valley PG';
  };

  const getUnreadNotificationsCount = () => {
    return ownerData.notifications.filter(n => !n.isRead).length;
  };

  const markNotificationAsRead = (notificationId: string) => {
    setOwnerData(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    }));
  };

  const refreshData = () => {
    fetchOwnerData();
  };

  return {
    ownerData,
    loading,
    error,
    ownerName: getOwnerName(),
    primaryPropertyName: getPrimaryPropertyName(),
    unreadNotificationsCount: getUnreadNotificationsCount(),
    markNotificationAsRead,
    refreshData
  };
};
