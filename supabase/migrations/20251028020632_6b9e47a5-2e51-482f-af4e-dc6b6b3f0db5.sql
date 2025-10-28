-- Add role change requests table
CREATE TABLE IF NOT EXISTS public.role_change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_role app_role NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  request_message TEXT,
  admin_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on role_change_requests
ALTER TABLE public.role_change_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own role change requests
CREATE POLICY "Users can view own role change requests"
ON public.role_change_requests
FOR SELECT
USING (user_id = auth.uid());

-- Users can create their own role change requests
CREATE POLICY "Users can create own role change requests"
ON public.role_change_requests
FOR INSERT
WITH CHECK (user_id = auth.uid() AND status = 'pending');

-- Admins can view all role change requests in their madrasa
CREATE POLICY "Admins can view all role change requests in madrasa"
ON public.role_change_requests
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) AND
  user_id IN (
    SELECT id FROM public.profiles
    WHERE madrasa_name = (
      SELECT madrasa_name FROM public.profiles WHERE id = auth.uid()
    )
  )
);

-- Admins can update role change requests in their madrasa
CREATE POLICY "Admins can update role change requests in madrasa"
ON public.role_change_requests
FOR UPDATE
USING (
  has_role(auth.uid(), 'admin'::app_role) AND
  user_id IN (
    SELECT id FROM public.profiles
    WHERE madrasa_name = (
      SELECT madrasa_name FROM public.profiles WHERE id = auth.uid()
    )
  )
);

-- Add trigger to update updated_at
CREATE TRIGGER update_role_change_requests_updated_at
BEFORE UPDATE ON public.role_change_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_role_change_requests_user_id ON public.role_change_requests(user_id);
CREATE INDEX idx_role_change_requests_status ON public.role_change_requests(status);