import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const adminApi = axios.create({
  baseURL: `${API_URL}/admin`,
  withCredentials: true,
});

// Set auth token for requests
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminService = {
  // Dashboard Stats
  getDashboardStats: async () => {
    const response = await adminApi.get('/dashboard/stats');
    return response.data;
  },

  // Events
  getEvents: async () => {
    const response = await adminApi.get('/events');
    return response.data;
  },

  // Messages
  sendBroadcast: async (message: string) => {
    const response = await adminApi.post('/messages/broadcast', { message });
    return response.data;
  },

  sendTeamMessage: async (teamId: string, message: string) => {
    const response = await adminApi.post(`/messages/team/${teamId}`, { message });
    return response.data;
  },

  // Judges
  getJudges: async () => {
    const response = await adminApi.get('/judges');
    return response.data;
  },

  assignJudge: async (judgeId: string, submissionId: string) => {
    const response = await adminApi.post(`/judges/${judgeId}/assign`, { submissionId });
    return response.data;
  },

  // Teams
  getTeams: async () => {
    const response = await adminApi.get('/teams');
    return response.data;
  },

  // Analytics
  getAnalytics: async () => {
    const response = await adminApi.get('/analytics');
    return response.data;
  },
};

export default adminService;
