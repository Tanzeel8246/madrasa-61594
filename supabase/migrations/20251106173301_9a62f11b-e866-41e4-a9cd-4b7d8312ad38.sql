-- Create security definer function to get user's madrasa name
CREATE OR REPLACE FUNCTION public.get_user_madrasa(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT madrasa_name
  FROM public.profiles
  WHERE id = _user_id
$$;

-- Update teachers RLS policies
DROP POLICY IF EXISTS "Admins can manage teachers in their madrasa" ON public.teachers;
DROP POLICY IF EXISTS "Users can view teachers in their madrasa only" ON public.teachers;

CREATE POLICY "Admins can manage teachers in their madrasa"
ON public.teachers
FOR ALL
USING (
  madrasa_name = public.get_user_madrasa(auth.uid())
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users can view teachers in their madrasa only"
ON public.teachers
FOR SELECT
USING (madrasa_name = public.get_user_madrasa(auth.uid()));

-- Update students RLS policies
DROP POLICY IF EXISTS "Admins and teachers can manage students in their madrasa" ON public.students;
DROP POLICY IF EXISTS "Users can view students in their madrasa" ON public.students;

CREATE POLICY "Admins and teachers can manage students in their madrasa"
ON public.students
FOR ALL
USING (
  madrasa_name = public.get_user_madrasa(auth.uid())
  AND (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'teacher'::app_role))
);

CREATE POLICY "Users can view students in their madrasa"
ON public.students
FOR SELECT
USING (madrasa_name = public.get_user_madrasa(auth.uid()));

-- Update classes RLS policies
DROP POLICY IF EXISTS "Admins and teachers can manage classes in their madrasa" ON public.classes;
DROP POLICY IF EXISTS "Users can view classes in their madrasa" ON public.classes;

CREATE POLICY "Admins and teachers can manage classes in their madrasa"
ON public.classes
FOR ALL
USING (
  madrasa_name = public.get_user_madrasa(auth.uid())
  AND (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'teacher'::app_role))
);

CREATE POLICY "Users can view classes in their madrasa"
ON public.classes
FOR SELECT
USING (madrasa_name = public.get_user_madrasa(auth.uid()));

-- Update courses RLS policies
DROP POLICY IF EXISTS "Admins can manage courses in their madrasa" ON public.courses;
DROP POLICY IF EXISTS "Users can view courses in their madrasa" ON public.courses;

CREATE POLICY "Admins can manage courses in their madrasa"
ON public.courses
FOR ALL
USING (
  madrasa_name = public.get_user_madrasa(auth.uid())
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users can view courses in their madrasa"
ON public.courses
FOR SELECT
USING (madrasa_name = public.get_user_madrasa(auth.uid()));

-- Update attendance RLS policies
DROP POLICY IF EXISTS "Admins and teachers can manage attendance in their madrasa" ON public.attendance;
DROP POLICY IF EXISTS "Users can view attendance in their madrasa" ON public.attendance;

CREATE POLICY "Admins and teachers can manage attendance in their madrasa"
ON public.attendance
FOR ALL
USING (
  madrasa_name = public.get_user_madrasa(auth.uid())
  AND (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'teacher'::app_role))
);

CREATE POLICY "Users can view attendance in their madrasa"
ON public.attendance
FOR SELECT
USING (madrasa_name = public.get_user_madrasa(auth.uid()));

-- Update fees RLS policies
DROP POLICY IF EXISTS "Admins and teachers can manage fees in their madrasa" ON public.fees;
DROP POLICY IF EXISTS "Users can view fees in their madrasa" ON public.fees;

CREATE POLICY "Admins and teachers can manage fees in their madrasa"
ON public.fees
FOR ALL
USING (
  madrasa_name = public.get_user_madrasa(auth.uid())
  AND (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'teacher'::app_role))
);

CREATE POLICY "Users can view fees in their madrasa"
ON public.fees
FOR SELECT
USING (madrasa_name = public.get_user_madrasa(auth.uid()));

-- Update education_reports RLS policies
DROP POLICY IF EXISTS "Admins and teachers can manage education reports in their madra" ON public.education_reports;
DROP POLICY IF EXISTS "Users can view education reports in their madrasa" ON public.education_reports;

CREATE POLICY "Admins and teachers can manage education reports in their madrasa"
ON public.education_reports
FOR ALL
USING (
  madrasa_name = public.get_user_madrasa(auth.uid())
  AND (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'teacher'::app_role))
);

CREATE POLICY "Users can view education reports in their madrasa"
ON public.education_reports
FOR SELECT
USING (madrasa_name = public.get_user_madrasa(auth.uid()));

-- Update pending_user_roles RLS policies
DROP POLICY IF EXISTS "Admins can manage pending roles in their madrasa" ON public.pending_user_roles;

CREATE POLICY "Admins can manage pending roles in their madrasa"
ON public.pending_user_roles
FOR ALL
USING (
  madrasa_name = public.get_user_madrasa(auth.uid())
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

-- Update profiles RLS policies for viewing other profiles in same madrasa
DROP POLICY IF EXISTS "Users can view profiles in same madrasa" ON public.profiles;

CREATE POLICY "Users can view profiles in same madrasa"
ON public.profiles
FOR SELECT
USING (
  madrasa_name = public.get_user_madrasa(auth.uid())
);