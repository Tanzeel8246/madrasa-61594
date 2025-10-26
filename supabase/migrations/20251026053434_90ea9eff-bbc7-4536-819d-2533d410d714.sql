-- Fix Security Issue 1: Restrict profiles table access to authenticated users only
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles in their madrasa"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  madrasa_name = (
    SELECT madrasa_name 
    FROM public.profiles 
    WHERE id = auth.uid()
  )
);

-- Fix Security Issue 2: Restrict teachers table access to same madrasa only
DROP POLICY IF EXISTS "Users can view teachers in their madrasa" ON public.teachers;

CREATE POLICY "Users can view teachers in their madrasa only"
ON public.teachers
FOR SELECT
TO authenticated
USING (
  madrasa_name = (
    SELECT madrasa_name 
    FROM public.profiles 
    WHERE id = auth.uid()
  )
);