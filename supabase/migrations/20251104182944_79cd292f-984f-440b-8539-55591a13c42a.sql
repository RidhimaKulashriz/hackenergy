-- Create team_messages table for team chat
CREATE TABLE IF NOT EXISTS public.team_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_messages ENABLE ROW LEVEL SECURITY;

-- Team members can view messages in their team
CREATE POLICY "Team members can view their team messages"
ON public.team_messages
FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM public.team_members WHERE team_id = team_messages.team_id
  )
);

-- Team members can send messages to their team
CREATE POLICY "Team members can send messages"
ON public.team_messages
FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  auth.uid() IN (
    SELECT user_id FROM public.team_members WHERE team_id = team_messages.team_id
  )
);

-- Enable realtime for team messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_messages;

-- Create admin_messages table for admin broadcasts and direct messages
CREATE TABLE IF NOT EXISTS public.admin_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_broadcast BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_messages ENABLE ROW LEVEL SECURITY;

-- Only admins (event organizers) can create messages
CREATE POLICY "Event organizers can send admin messages"
ON public.admin_messages
FOR INSERT
WITH CHECK (
  auth.uid() IN (SELECT organizer_id FROM public.events)
);

-- Team members can view messages sent to their team or broadcasts
CREATE POLICY "Users can view messages for their team"
ON public.admin_messages
FOR SELECT
USING (
  is_broadcast = true OR
  team_id IN (
    SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
  )
);

-- Admins can view all messages
CREATE POLICY "Admins can view all messages"
ON public.admin_messages
FOR SELECT
USING (
  auth.uid() IN (SELECT organizer_id FROM public.events)
);

-- Enable realtime for admin messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_messages;

-- Create function to send notification when admin message is created
CREATE OR REPLACE FUNCTION public.notify_admin_message()
RETURNS TRIGGER AS $$
BEGIN
  -- If it's a broadcast, notify all users in all teams for the events this admin organizes
  IF NEW.is_broadcast THEN
    INSERT INTO public.notifications (user_id, type, title, message, link)
    SELECT DISTINCT tm.user_id, 'admin_broadcast', 'Admin Announcement', NEW.message, '/dashboard'
    FROM public.team_members tm
    JOIN public.teams t ON tm.team_id = t.id
    JOIN public.events e ON t.event_id = e.id
    WHERE e.organizer_id = NEW.admin_id;
  -- If it's a direct message, notify only team members
  ELSIF NEW.team_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, type, title, message, link)
    SELECT tm.user_id, 'admin_message', 'Admin Message', NEW.message, '/team/' || NEW.team_id
    FROM public.team_members tm
    WHERE tm.team_id = NEW.team_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for admin message notifications
CREATE TRIGGER on_admin_message_created
  AFTER INSERT ON public.admin_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_message();