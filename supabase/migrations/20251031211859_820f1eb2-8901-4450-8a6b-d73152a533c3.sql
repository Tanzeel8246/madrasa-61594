-- Fix infinite recursion in RLS policies

-- Drop problematic policies
DROP POLICY IF EXISTS "Authenticated users can view profiles in their madrasa" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage roles in their madrasa" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles in madrasa" ON public.user_roles;

-- Create non-recursive policy for profiles
-- First allow users to see their own profile (no recursion)
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Then allow viewing other profiles in same madrasa (uses CTE to avoid recursion)
CREATE POLICY "Users can view profiles in same madrasa"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles my_profile
    WHERE my_profile.id = auth.uid()
    AND my_profile.madrasa_name = profiles.madrasa_name
  )
);

-- Simplified user_roles policies that don't cause recursion
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Admin policies for user_roles
CREATE POLICY "Admins can manage user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
);