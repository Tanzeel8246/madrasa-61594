-- Add mobile column to pending_user_roles table
ALTER TABLE public.pending_user_roles
ADD COLUMN mobile TEXT;