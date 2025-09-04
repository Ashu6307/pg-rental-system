import { useState, useEffect, useCallback } from 'react';
import { ownerDashboardService, DashboardOverview, AnalyticsData } from '../services/ownerDashboardService';

// Hook for dashboard overview
export const useDashboardOverview = () => {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const overview = await ownerDashboardService.getDashboardOverview();
      setData(overview);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard overview');
      console.error('Dashboard overview error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for analytics
export const useAnalytics = (params?: {
  period?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const analytics = await ownerDashboardService.getAnalytics(params);
      setData(analytics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for room stats
export const useRoomStats = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const roomStats = await ownerDashboardService.getRoomStats();
      setData(roomStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch room stats');
      console.error('Room stats error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for tenant stats
export const useTenantStats = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const tenantStats = await ownerDashboardService.getTenantStats();
      setData(tenantStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tenant stats');
      console.error('Tenant stats error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for financial stats
export const useFinancialStats = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const financialStats = await ownerDashboardService.getFinancialStats();
      setData(financialStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch financial stats');
      console.error('Financial stats error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for maintenance stats
export const useMaintenanceStats = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const maintenanceStats = await ownerDashboardService.getMaintenanceStats();
      setData(maintenanceStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch maintenance stats');
      console.error('Maintenance stats error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for utility stats
export const useUtilityStats = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const utilityStats = await ownerDashboardService.getUtilityStats();
      setData(utilityStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch utility stats');
      console.error('Utility stats error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for recent activities
export const useRecentActivities = (params?: {
  limit?: number;
  type?: string;
  days?: number;
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const activities = await ownerDashboardService.getRecentActivities(params);
      setData(activities);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recent activities');
      console.error('Recent activities error:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for real-time updates (placeholder for future WebSocket implementation)
export const useRealTimeUpdates = (callback: (update: any) => void) => {
  useEffect(() => {
    const unsubscribe = ownerDashboardService.subscribeToUpdates(callback);
    return unsubscribe;
  }, [callback]);
};

// Custom hook for handling data export
export const useDataExport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportData = useCallback(async (
    format: 'pdf' | 'excel' | 'csv',
    params?: any
  ) => {
    try {
      setLoading(true);
      setError(null);

      const blob = await ownerDashboardService.exportAnalyticsReport(format, params);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-report-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data');
      console.error('Export error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { exportData, loading, error };
};
