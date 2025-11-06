-- Create expenses table for income and expense tracking
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  madrasa_name TEXT,
  title TEXT NOT NULL,
  description TEXT,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT,
  receipt_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage expenses in their madrasa"
ON public.expenses
FOR ALL
USING (
  madrasa_name = public.get_user_madrasa(auth.uid())
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users can view expenses in their madrasa"
ON public.expenses
FOR SELECT
USING (madrasa_name = public.get_user_madrasa(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_expenses_updated_at
BEFORE UPDATE ON public.expenses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to set madrasa_name
CREATE TRIGGER set_expenses_madrasa_name
BEFORE INSERT ON public.expenses
FOR EACH ROW
EXECUTE FUNCTION public.set_madrasa_name();