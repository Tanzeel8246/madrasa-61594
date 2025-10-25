-- Add logo_url column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Create storage bucket for madrasa logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('madrasa-logos', 'madrasa-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for madrasa logos
CREATE POLICY "Users can view madrasa logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'madrasa-logos');

CREATE POLICY "Admins can upload logos for their madrasa"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'madrasa-logos' 
  AND (storage.foldername(name))[1] = (
    SELECT madrasa_name 
    FROM public.profiles 
    WHERE id = auth.uid()
  )
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update logos for their madrasa"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'madrasa-logos' 
  AND (storage.foldername(name))[1] = (
    SELECT madrasa_name 
    FROM public.profiles 
    WHERE id = auth.uid()
  )
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete logos for their madrasa"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'madrasa-logos' 
  AND (storage.foldername(name))[1] = (
    SELECT madrasa_name 
    FROM public.profiles 
    WHERE id = auth.uid()
  )
  AND has_role(auth.uid(), 'admin'::app_role)
);