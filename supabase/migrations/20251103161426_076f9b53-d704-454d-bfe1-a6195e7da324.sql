-- Make invite_code nullable and auto-generated
ALTER TABLE public.teams ALTER COLUMN invite_code DROP NOT NULL;
ALTER TABLE public.teams ALTER COLUMN invite_code SET DEFAULT '';