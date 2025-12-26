-- Create participants table
CREATE TABLE public.participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trips table
CREATE TABLE public.trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trip_participants junction table
CREATE TABLE public.trip_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(trip_id, participant_id)
);

-- Create expenses table
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  description TEXT,
  total_amount DECIMAL(15, 2) NOT NULL,
  paid_by_id UUID NOT NULL REFERENCES public.participants(id),
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create expense_shares table for individual participant amounts
CREATE TABLE public.expense_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  expense_id UUID NOT NULL REFERENCES public.expenses(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES public.participants(id),
  amount DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(expense_id, participant_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_shares ENABLE ROW LEVEL SECURITY;

-- Create public access policies (for now, without authentication)
-- Participants policies
CREATE POLICY "Anyone can view participants" ON public.participants FOR SELECT USING (true);
CREATE POLICY "Anyone can insert participants" ON public.participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update participants" ON public.participants FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete participants" ON public.participants FOR DELETE USING (true);

-- Trips policies
CREATE POLICY "Anyone can view trips" ON public.trips FOR SELECT USING (true);
CREATE POLICY "Anyone can insert trips" ON public.trips FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update trips" ON public.trips FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete trips" ON public.trips FOR DELETE USING (true);

-- Trip participants policies
CREATE POLICY "Anyone can view trip_participants" ON public.trip_participants FOR SELECT USING (true);
CREATE POLICY "Anyone can insert trip_participants" ON public.trip_participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete trip_participants" ON public.trip_participants FOR DELETE USING (true);

-- Expenses policies
CREATE POLICY "Anyone can view expenses" ON public.expenses FOR SELECT USING (true);
CREATE POLICY "Anyone can insert expenses" ON public.expenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update expenses" ON public.expenses FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete expenses" ON public.expenses FOR DELETE USING (true);

-- Expense shares policies
CREATE POLICY "Anyone can view expense_shares" ON public.expense_shares FOR SELECT USING (true);
CREATE POLICY "Anyone can insert expense_shares" ON public.expense_shares FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update expense_shares" ON public.expense_shares FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete expense_shares" ON public.expense_shares FOR DELETE USING (true);