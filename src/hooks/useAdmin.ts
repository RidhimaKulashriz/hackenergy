import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';

// Types for our API responses
type DashboardStats = {
  totalEvents: number;
  activeNow: number;
  participants: number;
  prizePool: number;
  engagement: number;
};

type Event = {
  id: string;
  name: string;
  status: 'upcoming' | 'active' | 'past';
  capacity: number;
  participants: number;
};

type Judge = {
  id: string;
  name: string;
  email: string;
  assignedSubmissions: number;
};

type Team = {
  id: string;
  name: string;
  members: string[];
  eventId: string;
};

type Analytics = {
  totalSubmissions: number;
  totalParticipants: number;
  eventsByStatus: {
    upcoming: number;
    active: number;
    completed: number;
  };
};

export const useDashboardStats = (options?: Omit<UseQueryOptions<DashboardStats, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery<DashboardStats, Error>({
    queryKey: ['admin', 'stats'],
    queryFn: adminService.getDashboardStats,
    ...options,
  });
};

export const useEvents = (options?: Omit<UseQueryOptions<Event[], Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery<Event[], Error>({
    queryKey: ['admin', 'events'],
    queryFn: adminService.getEvents,
    ...options,
  });
};

export const useSendBroadcast = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: adminService.sendBroadcast,
    onSuccess: () => {
      toast.success('Broadcast message sent successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'messages'] });
    },
    onError: (error) => {
      toast.error('Failed to send broadcast message');
      console.error('Broadcast error:', error);
    },
  });
};

export const useSendTeamMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, message }: { teamId: string; message: string }) => 
      adminService.sendTeamMessage(teamId, message),
    onSuccess: () => {
      toast.success('Team message sent successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'messages'] });
    },
    onError: (error) => {
      toast.error('Failed to send team message');
      console.error('Team message error:', error);
    },
  });
};

export const useJudges = (options?: Omit<UseQueryOptions<Judge[], Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery<Judge[], Error>({
    queryKey: ['admin', 'judges'],
    queryFn: adminService.getJudges,
    ...options,
  });
};

export const useAssignJudge = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ judgeId, submissionId }: { judgeId: string; submissionId: string }) => 
      adminService.assignJudge(judgeId, submissionId),
    onSuccess: () => {
      toast.success('Judge assigned successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'judges'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'submissions'] });
    },
    onError: (error) => {
      toast.error('Failed to assign judge');
      console.error('Assign judge error:', error);
    },
  });
};

export const useTeams = (options?: Omit<UseQueryOptions<Team[], Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery<Team[], Error>({
    queryKey: ['admin', 'teams'],
    queryFn: adminService.getTeams,
    ...options,
  });
};

export const useAnalytics = (options?: Omit<UseQueryOptions<Analytics, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery<Analytics, Error>({
    queryKey: ['admin', 'analytics'],
    queryFn: adminService.getAnalytics,
    ...options,
  });
};
