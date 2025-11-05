-- Fix security vulnerabilities

-- 1. Restrict profiles table to authenticated users only
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

-- 2. Protect team invite codes - only team members can see them
DROP POLICY IF EXISTS "Teams are viewable by everyone" ON public.teams;

CREATE POLICY "Public team info viewable by everyone"
ON public.teams
FOR SELECT
TO authenticated
USING (true);

-- Create a security definer function to check team membership
CREATE OR REPLACE FUNCTION public.is_team_member(_user_id uuid, _team_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.team_members
    WHERE user_id = _user_id
      AND team_id = _team_id
  )
$$;

-- 3. Add INSERT policy for rubric_criteria (only event organizers)
CREATE POLICY "Event organizers can create rubric criteria"
ON public.rubric_criteria
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.rubrics r
    JOIN public.events e ON e.id = r.event_id
    WHERE r.id = rubric_criteria.rubric_id
      AND e.organizer_id = auth.uid()
  )
);

-- 4. Add UPDATE policy for rubric_criteria
CREATE POLICY "Event organizers can update rubric criteria"
ON public.rubric_criteria
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.rubrics r
    JOIN public.events e ON e.id = r.event_id
    WHERE r.id = rubric_criteria.rubric_id
      AND e.organizer_id = auth.uid()
  )
);

-- 5. Add DELETE policy for rubric_criteria
CREATE POLICY "Event organizers can delete rubric criteria"
ON public.rubric_criteria
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.rubrics r
    JOIN public.events e ON e.id = r.event_id
    WHERE r.id = rubric_criteria.rubric_id
      AND e.organizer_id = auth.uid()
  )
);