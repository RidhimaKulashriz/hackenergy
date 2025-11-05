-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  skills TEXT[],
  github_url TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT,
  description TEXT NOT NULL,
  cover_image TEXT,
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'active', 'past')),
  is_virtual BOOLEAN NOT NULL DEFAULT true,
  location TEXT,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  registration_deadline TIMESTAMPTZ NOT NULL,
  capacity INTEGER NOT NULL,
  team_size_min INTEGER NOT NULL DEFAULT 1,
  team_size_max INTEGER NOT NULL DEFAULT 6,
  prize_pool TEXT,
  tracks TEXT[] NOT NULL DEFAULT '{}',
  organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create teams table
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tagline TEXT,
  track TEXT NOT NULL,
  invite_code TEXT NOT NULL UNIQUE,
  repo_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create team_members table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('leader', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Create submissions table
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  repo_link TEXT,
  demo_link TEXT,
  video_link TEXT,
  accessibility_score INTEGER CHECK (accessibility_score >= 0 AND accessibility_score <= 100),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create judges table
CREATE TABLE public.judges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Create rubrics table
CREATE TABLE public.rubrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create rubric_criteria table
CREATE TABLE public.rubric_criteria (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rubric_id UUID NOT NULL REFERENCES public.rubrics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  max_score INTEGER NOT NULL DEFAULT 10,
  weight DECIMAL NOT NULL DEFAULT 1.0,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  judge_id UUID NOT NULL REFERENCES public.judges(id) ON DELETE CASCADE,
  feedback TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(submission_id, judge_id)
);

-- Create review_scores table
CREATE TABLE public.review_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  criterion_id UUID NOT NULL REFERENCES public.rubric_criteria(id) ON DELETE CASCADE,
  score DECIMAL NOT NULL,
  UNIQUE(review_id, criterion_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.judges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rubrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rubric_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_scores ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Events policies
CREATE POLICY "Events are viewable by everyone" ON public.events FOR SELECT USING (true);
CREATE POLICY "Organizers can create events" ON public.events FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Organizers can update their events" ON public.events FOR UPDATE USING (auth.uid() = organizer_id);
CREATE POLICY "Organizers can delete their events" ON public.events FOR DELETE USING (auth.uid() = organizer_id);

-- Teams policies
CREATE POLICY "Teams are viewable by everyone" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create teams" ON public.teams FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Team leaders can update their teams" ON public.teams FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.team_id = teams.id
    AND team_members.user_id = auth.uid()
    AND team_members.role = 'leader'
  )
);

-- Team members policies
CREATE POLICY "Team members are viewable by everyone" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Team leaders can add members" ON public.team_members FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.team_members AS tm
    WHERE tm.team_id = team_members.team_id
    AND tm.user_id = auth.uid()
    AND tm.role = 'leader'
  ) OR auth.uid() = user_id
);
CREATE POLICY "Team leaders can remove members" ON public.team_members FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.team_members AS tm
    WHERE tm.team_id = team_members.team_id
    AND tm.user_id = auth.uid()
    AND tm.role = 'leader'
  )
);

-- Submissions policies
CREATE POLICY "Submissions are viewable by everyone" ON public.submissions FOR SELECT USING (true);
CREATE POLICY "Team members can create submissions" ON public.submissions FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.team_id = submissions.team_id
    AND team_members.user_id = auth.uid()
  )
);
CREATE POLICY "Team members can update their submissions" ON public.submissions FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.team_id = submissions.team_id
    AND team_members.user_id = auth.uid()
  )
);

-- Judges policies
CREATE POLICY "Judges can view their assignments" ON public.judges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Event organizers can assign judges" ON public.judges FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.events
    WHERE events.id = judges.event_id
    AND events.organizer_id = auth.uid()
  )
);

-- Rubrics policies
CREATE POLICY "Rubrics are viewable by everyone" ON public.rubrics FOR SELECT USING (true);
CREATE POLICY "Event organizers can create rubrics" ON public.rubrics FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.events
    WHERE events.id = rubrics.event_id
    AND events.organizer_id = auth.uid()
  )
);

-- Rubric criteria policies
CREATE POLICY "Criteria are viewable by everyone" ON public.rubric_criteria FOR SELECT USING (true);

-- Reviews policies
CREATE POLICY "Reviews are viewable by submission team and judges" ON public.reviews FOR SELECT USING (
  auth.uid() IN (
    SELECT user_id FROM public.team_members WHERE team_id IN (
      SELECT team_id FROM public.submissions WHERE id = reviews.submission_id
    )
  ) OR auth.uid() IN (
    SELECT user_id FROM public.judges WHERE id = reviews.judge_id
  )
);
CREATE POLICY "Judges can create reviews" ON public.reviews FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.judges
    WHERE judges.id = reviews.judge_id
    AND judges.user_id = auth.uid()
  )
);
CREATE POLICY "Judges can update their reviews" ON public.reviews FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.judges
    WHERE judges.id = reviews.judge_id
    AND judges.user_id = auth.uid()
  )
);

-- Review scores policies
CREATE POLICY "Scores are viewable with reviews" ON public.review_scores FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.reviews
    WHERE reviews.id = review_scores.review_id
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON public.submissions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();