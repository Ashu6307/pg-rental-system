import { apiService } from '../config/api';

export interface DashboardOverview {
  stats: {
    monthlyRevenue: {
      amount: number;
      growth: number;
      isPositive: boolean;
      count: number;
    };
    totalRooms: {
      count: number;
      occupied: number;
      available: number;
      occupancyRate: number;
    };
    currentTenants: {
      count: number;
      newThisMonth: number;
      retentionRate: number;
    };
    pendingBills: {
      amount: number;
      count: number;
    };
    pendingActions: {
      count: number;
      maintenance: number;
      documents: number;
      utilities: number;
    };
    satisfaction: {
      score: number;
      reviewCount: number;
    };
    properties: {
      total: number;
    };
  };
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    tenant: string;
    room: string;
    timestamp: string;
    severity: string;
  }>;
  quickActions: Array<{
    id: string;
  }>;
}

// Enhanced interfaces for new tenant tracking system
export interface EnhancedDashboardOverview {
  properties: {
    pgs?: { total: number; occupied: number; available: number };
    rooms?: { total: number; occupied: number; available: number };
    flats?: { total: number; occupied: number; available: number };
  };
  tenants: {
    total: number;
    newThisMonth: number;
    checkInsToday: number;
    checkOutsThisWeek: number;
    enhanced?: {
      totalTracked: number;
      active: number;
      totalRevenue: number;
      totalDues: number;
      averageStayDays: number;
      overdueCount: number;
    };
  };
  financial: {
    currentMonthRevenue: number;
    lastMonthRevenue: number;
    revenueGrowth: number;
    pendingPayments: number;
    pendingElectricityBills: number;
    pendingElectricityAmount: number;
    totalOutstanding: number;
  };
  overview: {
    totalProperties: number;
    totalTenants: number;
    monthlyRevenue: number;
    revenueGrowth: number;
    occupancyRate: number;
    pendingActions: number;
  };
}

export interface TenantAnalytics {
  occupancyStats: Array<{
    _id: string;
    total: number;
    active: number;
  }>;
  monthlyTrends: Array<{
    _id: { year: number; month: number };
    checkIns: number;
    totalRevenue: number;
  }>;
  paymentStatus: Array<{
    totalDues: number;
    totalCollected: number;
    overdueCount: number;
  }>;
}

export interface OccupancyStatus {
  pg: Array<{
    _id: string;
    name: string;
    totalBeds: number;
    occupiedBeds: number;
    availableBeds: number;
    occupancyRate: number;
  }>;
  rooms: Array<{
    _id: string;
    name: string;
    isOccupied: boolean;
    currentTenant?: any;
  }>;
  flats: Array<{
    _id: string;
    name: string;
    maxOccupancy: number;
    currentOccupancy: number;
    isAvailable: boolean;
  }>;
  summary: {
    totalProperties: number;
    totalOccupied: number;
    totalCapacity: number;
  };
}

export interface TenantActivity {
  tenantName: string;
  tenantPhone: string;
  propertyType: string;
  propertyName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate?: string;
  isActive: boolean;
  totalStayDays: number;
  lastUpdated: string;
}

export interface PaymentOverview {
  overview: {
    totalExpectedRevenue: number;
    totalDues: number;
    totalAdvance: number;
    overdueTenantsCount: number;
    activeTenants: number;
  };
  recentPayments: Array<{
    tenantName: string;
    tenantPhone: string;
    amount: number;
    type: string;
    date: string;
    propertyType: string;
    propertyName: string;
    roomNumber: string;
  }>;
}

export interface QuickAction {
  id: string;
  label: string;
  count: number;
  enabled?: boolean;
  urgent?: boolean;
}

export interface AnalyticsData {
  overview: {
    totalRevenue: number;
    monthlyGrowth: number;
    occupancyRate: number;
    totalProperties: number;
    totalRooms: number;
    occupiedRooms: number;
    availableRooms: number;
    activeTenants: number;
    totalTenants: number;
    newTenantsThisMonth: number;
    averageStayDuration: number;
    tenantRetentionRate: number;
    paymentDelayRate: number;
    averageRent: number;
    satisfactionScore: number;
  };
  revenue: {
    monthlyTrend: Array<{
      _id: { year: number; month: number };
      revenue: number;
      count: number;
    }>;
    breakdown: Array<{
      _id: string;
      amount: number;
      count: number;
    }>;
    totalPayments: number;
    avgPaymentAmount: number;
  };
  properties: {
    pgProperties: Array<{
      id: string;
      name: string;
      roomCount: number;
      occupancyRate: string;
    }>;
  };
  maintenance: Array<{
    _id: string;
    count: number;
    totalCost: number;
  }>;
  utilities: Array<{
    _id: string;
    totalUnits: number;
    totalAmount: number;
    count: number;
  }>;
  reviews: {
    avgRating: number;
    totalReviews: number;
    ratingsDistribution?: number[];
  };
  bookings: Array<{
    _id: string;
    count: number;
    totalAmount: number;
  }>;
  trends: {
    occupancyTrend: any[];
    revenueTrend: any[];
    tenantTrend: any[];
  };
}

export interface RoomStats {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  maintenanceRooms: number;
  avgRent: number;
  roomDetails: Array<{
    id: string;
    roomNumber: string;
    type: string;
    rent: number;
    status: string;
    tenant: any;
    pg: any;
    amenities: string[];
    lastUpdated: string;
  }>;
}

export interface TenantStats {
  totalTenants: number;
  activeTenants: number;
  newThisMonth: number;
  avgStayDuration: number;
  tenantDetails: Array<{
    id: string;
    name: string;
    phone: string;
    email: string;
    status: string;
    checkinDate: string;
    checkoutDate?: string;
    room: any;
    pg: any;
    rent: number;
    documents: any[];
    emergencyContact: any;
  }>;
}

class OwnerDashboardService {
  // Dashboard Overview
  async getDashboardOverview(): Promise<DashboardOverview> {
    try {
      const response = await apiService.get('/api/owner/dashboard/overview');
      return response;
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      throw error;
    }
  }

  // Analytics
  async getAnalytics(params?: {
    period?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<AnalyticsData> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.period) queryParams.append('period', params.period);
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);
      
      const endpoint = `/api/owner/analytics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  async getAnalyticsByPeriod(period: string, year: number, month: number): Promise<any> {
    try {
      const response = await apiService.get(`/api/owner/analytics/period/${period}/${year}/${month}`);
      return response;
    } catch (error) {
      console.error('Error fetching period analytics:', error);
      throw error;
    }
  }

  // Room Management
  async getRoomStats(): Promise<RoomStats> {
    try {
      const response = await apiService.get('/api/owner/dashboard/rooms');
      return response;
    } catch (error) {
      console.error('Error fetching room stats:', error);
      throw error;
    }
  }

  // Tenant Management
  async getTenantStats(): Promise<TenantStats> {
    try {
      const response = await apiService.get('/api/owner/dashboard/tenants');
      return response;
    } catch (error) {
      console.error('Error fetching tenant stats:', error);
      throw error;
    }
  }

  // Financial Management
  async getFinancialStats(): Promise<any> {
    try {
      const response = await apiService.get('/api/owner/dashboard/financial');
      return response;
    } catch (error) {
      console.error('Error fetching financial stats:', error);
      throw error;
    }
  }

  // Maintenance Management
  async getMaintenanceStats(): Promise<any> {
    try {
      const response = await apiService.get('/api/owner/dashboard/maintenance');
      return response;
    } catch (error) {
      console.error('Error fetching maintenance stats:', error);
      throw error;
    }
  }

  // Utility Management
  async getUtilityStats(): Promise<any> {
    try {
      const response = await apiService.get('/api/owner/dashboard/utilities');
      return response;
    } catch (error) {
      console.error('Error fetching utility stats:', error);
      throw error;
    }
  }

  // Recent Activities
  async getRecentActivities(params?: {
    limit?: number;
    type?: string;
    days?: number;
  }): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.type) queryParams.append('type', params.type);
      if (params?.days) queryParams.append('days', params.days.toString());
      
      const endpoint = `/api/owner/dashboard/activities${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  }

  // Export functionality
  async exportAnalyticsReport(format: 'pdf' | 'excel' | 'csv', params?: any): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams(params);
      const endpoint = `/api/owner/analytics/export/${format}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      // Note: This would need special handling for blob responses in the apiService
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${typeof window !== 'undefined' ? sessionStorage.getItem('token') || localStorage.getItem('token') : ''}`
        }
      });
      
      if (!response.ok) throw new Error('Export failed');
      return await response.blob();
    } catch (error) {
      console.error('Error exporting analytics report:', error);
      throw error;
    }
  }

  // Real-time updates (for future WebSocket implementation)
  subscribeToUpdates(callback: (update: any) => void): () => void {
    // Placeholder for WebSocket implementation
    console.log('Real-time updates subscription - to be implemented with WebSocket');
    return () => {
      console.log('Unsubscribed from real-time updates');
    };
  }

  // Enhanced Dashboard Methods
  async getEnhancedDashboardOverview(): Promise<EnhancedDashboardOverview> {
    try {
      const response = await apiService.get('/api/owner/dashboard/overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching enhanced dashboard overview:', error);
      throw error;
    }
  }

  async getTenantAnalytics(): Promise<TenantAnalytics> {
    try {
      const response = await apiService.get('/api/owner/dashboard/analytics/tenants');
      return response.data;
    } catch (error) {
      console.error('Error fetching tenant analytics:', error);
      throw error;
    }
  }

  async getOccupancyStatus(): Promise<OccupancyStatus> {
    try {
      const response = await apiService.get('/api/owner/dashboard/occupancy/status');
      return response.data;
    } catch (error) {
      console.error('Error fetching occupancy status:', error);
      throw error;
    }
  }

  async getRecentTenantActivities(limit?: number): Promise<TenantActivity[]> {
    try {
      const queryParams = limit ? `?limit=${limit}` : '';
      const response = await apiService.get(`/api/owner/dashboard/activities/tenants${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent tenant activities:', error);
      throw error;
    }
  }

  async getPaymentOverview(): Promise<PaymentOverview> {
    try {
      const response = await apiService.get('/api/owner/dashboard/payments/overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching payment overview:', error);
      throw error;
    }
  }

  // Tenant Management Methods
  async addNewTenant(tenantData: any): Promise<any> {
    try {
      const response = await apiService.post('/api/tenant-management/add', tenantData);
      return response.data;
    } catch (error) {
      console.error('Error adding new tenant:', error);
      throw error;
    }
  }

  async checkOutTenant(tenantId: string): Promise<any> {
    try {
      const response = await apiService.post(`/api/tenant-management/checkout/${tenantId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking out tenant:', error);
      throw error;
    }
  }

  async getTenantDetails(tenantId: string): Promise<any> {
    try {
      const response = await apiService.get(`/api/tenant-management/details/${tenantId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tenant details:', error);
      throw error;
    }
  }

  async updateTenantPayment(tenantId: string, paymentData: any): Promise<any> {
    try {
      const response = await apiService.post(`/api/tenant-management/payment/${tenantId}`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Error updating tenant payment:', error);
      throw error;
    }
  }
}

export const ownerDashboardService = new OwnerDashboardService();
