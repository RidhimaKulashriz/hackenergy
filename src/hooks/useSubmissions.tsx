import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "./use-toast";

export interface Submission {
  id: string;
  team_id: string;
  event_id: string;
  title: string;
  description: string;
  repo_link: string | null;
  demo_link: string | null;
  video_link: string | null;
  accessibility_score: number | null;
  submitted_at: string;
  updated_at: string;
}

export function useSubmissions(eventId?: string) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, [eventId]);

  const fetchSubmissions = async () => {
    try {
      let query = supabase.from('submissions').select('*');
      
      if (eventId) {
        query = query.eq('event_id', eventId);
      }

      const { data, error } = await query.order('submitted_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load submissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { submissions, loading, refetch: fetchSubmissions };
}

export function useTeamSubmission(teamId: string | undefined) {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId) {
      setLoading(false);
      return;
    }

    fetchSubmission();
  }, [teamId]);

  const fetchSubmission = async () => {
    if (!teamId) return;

    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('team_id', teamId)
        .maybeSingle();

      if (error) throw error;
      setSubmission(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load submission",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { submission, loading, refetch: fetchSubmission };
}
