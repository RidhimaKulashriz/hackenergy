import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "./use-toast";

export interface TeamMessage {
  id: string;
  team_id: string;
  user_id: string;
  message: string;
  created_at: string;
}

export function useTeamChat(teamId: string | undefined) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<TeamMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId || !user) {
      setMessages([]);
      setLoading(false);
      return;
    }

    // Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('team_messages')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(data);
      }
      setLoading(false);
    };

    fetchMessages();

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`team-messages-${teamId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'team_messages',
          filter: `team_id=eq.${teamId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as TeamMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamId, user]);

  const sendMessage = async (message: string) => {
    if (!user || !teamId || !message.trim()) return;

    const { error } = await supabase
      .from('team_messages')
      .insert({
        team_id: teamId,
        user_id: user.id,
        message: message.trim(),
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  return {
    messages,
    loading,
    sendMessage,
  };
}
