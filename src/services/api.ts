// API service layer for backend integration
// Replace mock implementations with real API calls when backend is ready

import axios, { AxiosInstance } from "axios";
import type { Event, User, Team, Submission, Score, ApiResponse, PaginatedResponse } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add auth token to requests if available
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle errors globally
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("API Error:", error);
        throw error;
      }
    );
  }

  // Auth endpoints
  async signUp(email: string, password: string, name: string): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const response = await this.client.post("/auth/register", { email, password, name });
      localStorage.setItem("auth_token", response.data.token);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Signup failed. Please try again.');
    }
  }

  async signIn(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const response = await this.client.post("/auth/login", { email, password });
      localStorage.setItem("auth_token", response.data.token);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Invalid email or password');
    }
  }

  async getMe(): Promise<ApiResponse<User>> {
    try {
      const response = await this.client.get("/auth/me");
      return response.data;
    } catch (error: any) {
      // If token is invalid or expired, clear it
      if (error.response?.status === 401) {
        localStorage.removeItem("auth_token");
      }
      throw error;
    }
  }

  // Events endpoints
  async getEvents(filters?: {
    status?: string;
    track?: string;
    search?: string;
  }): Promise<PaginatedResponse<Event>> {
    // TODO: Replace with actual API call
    // const response = await this.client.get("/events", { params: filters });
    // return response.data;
    throw new Error("Backend not connected - implement events list endpoint");
  }

  async getEvent(id: string): Promise<ApiResponse<Event>> {
    // TODO: Replace with actual API call
    // const response = await this.client.get(`/events/${id}`);
    // return response.data;
    throw new Error("Backend not connected - implement event detail endpoint");
  }

  async createEvent(event: Partial<Event>): Promise<ApiResponse<Event>> {
    // TODO: Replace with actual API call (admin only)
    // const response = await this.client.post("/events", event);
    // return response.data;
    throw new Error("Backend not connected - implement create event endpoint");
  }

  // Teams endpoints
  async createTeam(eventId: string, team: { name: string; tagline?: string }): Promise<ApiResponse<Team>> {
    // TODO: Replace with actual API call
    // const response = await this.client.post(`/events/${eventId}/teams`, team);
    // return response.data;
    throw new Error("Backend not connected - implement create team endpoint");
  }

  async getTeam(eventId: string, teamId: string): Promise<ApiResponse<Team>> {
    // TODO: Replace with actual API call
    // const response = await this.client.get(`/events/${eventId}/teams/${teamId}`);
    // return response.data;
    throw new Error("Backend not connected - implement team detail endpoint");
  }

  async joinTeam(eventId: string, teamId: string, inviteCode: string): Promise<ApiResponse<Team>> {
    // TODO: Replace with actual API call
    // const response = await this.client.post(`/events/${eventId}/teams/${teamId}/join`, { inviteCode });
    // return response.data;
    throw new Error("Backend not connected - implement join team endpoint");
  }

  // Submissions endpoints
  async submitProject(
    eventId: string,
    teamId: string,
    submission: Partial<Submission>
  ): Promise<ApiResponse<Submission>> {
    // TODO: Replace with actual API call
    // const response = await this.client.post(`/events/${eventId}/teams/${teamId}/submission`, submission);
    // return response.data;
    throw new Error("Backend not connected - implement submission endpoint");
  }

  async getSubmissions(eventId: string): Promise<PaginatedResponse<Submission>> {
    // TODO: Replace with actual API call
    // const response = await this.client.get(`/events/${eventId}/submissions`);
    // return response.data;
    throw new Error("Backend not connected - implement submissions list endpoint");
  }

  // Scoring endpoints
  async submitScore(submissionId: string, score: Partial<Score>): Promise<ApiResponse<Score>> {
    // TODO: Replace with actual API call (judge only)
    // const response = await this.client.post(`/submissions/${submissionId}/score`, score);
    // return response.data;
    throw new Error("Backend not connected - implement score submission endpoint");
  }

  async getScores(submissionId: string): Promise<ApiResponse<Score[]>> {
    // TODO: Replace with actual API call
    // const response = await this.client.get(`/submissions/${submissionId}/scores`);
    // return response.data;
    throw new Error("Backend not connected - implement scores list endpoint");
  }

  // File upload endpoints
  async getPresignedUrl(fileName: string, fileType: string): Promise<ApiResponse<{ url: string; fields: any }>> {
    // TODO: Replace with actual API call
    // Returns presigned URL for direct S3 upload
    // const response = await this.client.post("/uploads/presign", { fileName, fileType });
    // return response.data;
    throw new Error("Backend not connected - implement presigned upload endpoint");
  }

  async uploadFile(presignedData: any, file: File): Promise<void> {
    // TODO: Implement direct S3 upload using presigned URL
    // const formData = new FormData();
    // Object.keys(presignedData.fields).forEach(key => {
    //   formData.append(key, presignedData.fields[key]);
    // });
    // formData.append('file', file);
    // await axios.post(presignedData.url, formData);
    throw new Error("Backend not connected - implement file upload");
  }
}

export const api = new ApiService();
