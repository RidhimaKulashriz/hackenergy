import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "./use-toast";

export interface Team {
  id: string;
  event_id: string;
  name: string;
  tagline: string | null;
  track: string;
  repo_link: string | null;
  invite_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

export function useTeams(eventId?: string) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, [eventId]);

  const fetchTeams = async () => {
    try {
      let query = supabase.from('teams').select('*');
      
      if (eventId) {
        query = query.eq('event_id', eventId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTeams(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load teams",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { teams, loading, refetch: fetchTeams };
}

export function useMyTeams() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<(Team & { event?: any; memberCount?: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTeams([]);
      setLoading(false);
      return;
    }

    fetchMyTeams();
  }, [user]);

  const fetchMyTeams = async () => {
    if (!user) return;

    try {
      const { data: memberData, error: memberError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id);

      if (memberError) throw memberError;

      const teamIds = memberData.map((m) => m.team_id);

      if (teamIds.length === 0) {
        setTeams([]);
        setLoading(false);
        return;
      }

      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*, events(*)')
        .in('id', teamIds);

      if (teamsError) throw teamsError;

      // Get member counts for each team
      const teamsWithCounts = await Promise.all(
        (teamsData || []).map(async (team) => {
          const { count } = await supabase
            .from('team_members')
            .select('*', { count: 'exact', head: true })
            .eq('team_id', team.id);

          return {
            ...team,
            event: team.events,
            memberCount: count || 0,
          };
        })
      );

      setTeams(teamsWithCounts);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load your teams",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { teams, loading, refetch: fetchMyTeams };
}

export function useTeam(teamId: string | undefined) {
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId) {
      setLoading(false);
      return;
    }

    fetchTeam();
    fetchMembers();
  }, [teamId]);

  const fetchTeam = async () => {
    if (!teamId) return;

    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();

      if (error) throw error;
      setTeam(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load team",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    if (!teamId) return;

    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId);

      if (error) throw error;
      setMembers(data || []);
    } catch (error: any) {
      console.error('Failed to load members:', error);
    }
  };

  return { team, members, loading, refetch: fetchTeam };
}
