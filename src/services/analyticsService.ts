import { adminApi } from './adminApi';

export interface AnalyticsData {
  totalEvents: number;
  activeEvents: number;
  totalParticipants: number;
  totalSubmissions: number;
  eventsByStatus: {
    upcoming: number;
    active: number;
    completed: number;
  };
  participantsByEvent: Array<{
    eventId: string;
    eventName: string;
    count: number;
  }>;
  submissionTrends: Array<{
    date: string;
    count: number;
  }>;
}

export const analyticsService = {
  getDashboardStats: async (): Promise<AnalyticsData> => {
    const response = await adminApi.get<AnalyticsData>('/analytics/dashboard');
    return response.data.data;
  },

  getEventAnalytics: async (eventId: string) => {
    const response = await adminApi.get(`/analytics/events/${eventId}`);
    return response.data;
  },

  exportReport: async (type: 'csv' | 'pdf', filters: Record<string, string | number | boolean> = {}) => {
    const response = await adminApi.get('/analytics/export', {
      params: { type, ...filters },
      responseType: 'blob',
    });
    return response.data;
  },

  getRealTimeUpdates: (callback: (data: AnalyticsData) => void) => {
    // This would be connected to WebSocket in a real implementation
    const interval = setInterval(async () => {
      try {
        const data = await analyticsService.getDashboardStats();
        callback(data);
      } catch (error) {
        console.error('Error fetching real-time updates:', error);
      }
    }, 30000); // Update every 30 seconds

    // Return cleanup function
    return () => clearInterval(interval);
  },
};

export default analyticsService;
