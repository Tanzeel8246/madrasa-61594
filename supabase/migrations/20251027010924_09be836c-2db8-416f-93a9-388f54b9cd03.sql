-- Update handle_new_user function to ensure admin is the default role
-- for all new independent signups (new madrasa creators)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  pending_role app_role;
  pending_madrasa TEXT;
BEGIN
  -- Check if there's a pending role for this email
  SELECT role, madrasa_name INTO pending_role, pending_madrasa
  FROM public.pending_user_roles
  WHERE email = NEW.email;
  
  IF pending_madrasa IS NOT NULL THEN
    -- User is joining an existing madrasa via invitation
    INSERT INTO public.profiles (id, full_name, madrasa_name)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      pending_madrasa
    );
    
    -- Assign the invited role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, pending_role);
    
    -- Delete the pending role record
    DELETE FROM public.pending_user_roles WHERE email = NEW.email;
  ELSE
    -- New independent signup - creating their own madrasa
    INSERT INTO public.profiles (id, full_name, madrasa_name)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      NEW.raw_user_meta_data->>'madrasa_name'
    );
    
    -- DEFAULT: Assign admin role to new madrasa creator
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role);
  END IF;
  
  RETURN NEW;
END;
$function$;