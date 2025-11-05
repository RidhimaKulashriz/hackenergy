import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'sonner';

type ApiResponse<T> = {
  data: T;
  message?: string;
  success: boolean;
};

class AdminApiService {
  private instance: AxiosInstance;
  private static _instance: AdminApiService;

  private constructor() {
    this.instance = axios.create({
      baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        if (response.data?.message) {
          toast.success(response.data.message);
        }
        return response;
      },
      (error) => {
        const errorMessage = error.response?.data?.message || 'An error occurred';
        
        if (error.response?.status === 401) {
          // Handle unauthorized
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        } else if (error.response?.status === 403) {
          // Handle forbidden (no permission)
          toast.error('You do not have permission to perform this action');
        } else if (error.response?.status >= 500) {
          // Handle server errors
          toast.error('Server error. Please try again later.');
        } else {
          // Handle other errors
          toast.error(errorMessage);
        }
        
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): AdminApiService {
    if (!AdminApiService._instance) {
      AdminApiService._instance = new AdminApiService();
    }
    return AdminApiService._instance;
  }

  // Auth
  public async login(credentials: { email: string; password: string }): Promise<{ 
    token: string; 
    user: {
      id: string;
      email: string;
      name: string;
      role: 'admin' | 'judge' | 'user';
      createdAt: string;
    } 
  }> {
    const response = await this.instance.post('/auth/login', credentials);
    return response.data;
  }

  // Users
  public async getUsers(params?: Record<string, string | number | boolean>): Promise<ApiResponse<Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }>>> {
    const response = await this.instance.get('/users', { params });
    return response.data;
  }

  // Events
  public async getEvents(params?: {
    status?: 'upcoming' | 'ongoing' | 'completed';
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Array<{
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    participants: number;
  }>>> {
    const response = await this.instance.get('/events', { params });
    return response.data;
  }

  // Submissions
  public async getSubmissions(eventId?: string): Promise<ApiResponse<Array<{
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'under_review' | 'accepted' | 'rejected';
    eventId: string;
    teamId: string;
    submittedAt: string;
  }>>> {
    const url = eventId ? `/submissions?eventId=${eventId}` : '/submissions';
    const response = await this.instance.get(url);
    return response.data;
  }

  // Analytics
  public async getDashboardStats(): Promise<ApiResponse<{
    totalEvents: number;
    activeEvents: number;
    totalParticipants: number;
    submissions: {
      total: number;
      pending: number;
      reviewed: number;
    };
    recentActivity: Array<{
      id: string;
      type: string;
      description: string;
      timestamp: string;
    }>;
  }>> {
    const response = await this.instance.get('/analytics/dashboard');
    return response.data;
  }

  // Messages
  public async sendBroadcast(message: string): Promise<ApiResponse<{ id: string }>> {
    const response = await this.instance.post('/messages/broadcast', { message });
    return response.data;
  }

  // Generic request method for flexibility
  // HTTP method shorthands
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.get<ApiResponse<T>>(url, config);
  }

  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.post<ApiResponse<T>>(url, data, config);
  }

  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.put<ApiResponse<T>>(url, data, config);
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.delete<ApiResponse<T>>(url, config);
  }

  public async request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.request<ApiResponse<T>>(config);
  }
}

export const adminApi = AdminApiService.getInstance();
