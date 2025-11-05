import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "./use-toast";

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  tagline: string | null;
  cover_image: string | null;
  start_at: string;
  end_at: string;
  registration_deadline: string;
  tracks: string[];
  capacity: number;
  team_size_min: number;
  team_size_max: number;
  status: string;
  prize_pool: string | null;
  location: string | null;
  is_virtual: boolean;
  organizer_id: string;
  created_at: string;
  updated_at: string;
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
        },
        () => {
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { events, loading, refetch: fetchEvents };
}

export function useEvent(slug: string | undefined) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    fetchEvent();
  }, [slug]);

  const fetchEvent = async () => {
    if (!slug) return;

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load event",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { event, loading, refetch: fetchEvent };
}
