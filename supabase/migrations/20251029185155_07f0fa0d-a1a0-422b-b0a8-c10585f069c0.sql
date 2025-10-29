-- Check if triggers exist and create them if missing

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS set_madrasa_name_trigger ON public.students;
DROP TRIGGER IF EXISTS set_madrasa_name_trigger ON public.teachers;
DROP TRIGGER IF EXISTS set_madrasa_name_trigger ON public.attendance;
DROP TRIGGER IF EXISTS set_madrasa_name_trigger ON public.education_reports;
DROP TRIGGER IF EXISTS set_madrasa_name_trigger ON public.classes;
DROP TRIGGER IF EXISTS set_madrasa_name_trigger ON public.courses;
DROP TRIGGER IF EXISTS set_madrasa_name_trigger ON public.fees;

-- Create triggers for all tables that need madrasa_name
CREATE TRIGGER set_madrasa_name_trigger
  BEFORE INSERT ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.set_madrasa_name();

CREATE TRIGGER set_madrasa_name_trigger
  BEFORE INSERT ON public.teachers
  FOR EACH ROW
  EXECUTE FUNCTION public.set_madrasa_name();

CREATE TRIGGER set_madrasa_name_trigger
  BEFORE INSERT ON public.attendance
  FOR EACH ROW
  EXECUTE FUNCTION public.set_madrasa_name();

CREATE TRIGGER set_madrasa_name_trigger
  BEFORE INSERT ON public.education_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.set_madrasa_name();

CREATE TRIGGER set_madrasa_name_trigger
  BEFORE INSERT ON public.classes
  FOR EACH ROW
  EXECUTE FUNCTION public.set_madrasa_name();

CREATE TRIGGER set_madrasa_name_trigger
  BEFORE INSERT ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.set_madrasa_name();

CREATE TRIGGER set_madrasa_name_trigger
  BEFORE INSERT ON public.fees
  FOR EACH ROW
  EXECUTE FUNCTION public.set_madrasa_name();