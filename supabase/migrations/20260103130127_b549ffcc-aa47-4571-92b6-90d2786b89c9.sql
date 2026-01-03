-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'hsl(199 89% 48%)',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on subjects
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- Subjects policies
CREATE POLICY "Users can view their own subjects" 
ON public.subjects FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subjects" 
ON public.subjects FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subjects" 
ON public.subjects FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subjects" 
ON public.subjects FOR DELETE 
USING (auth.uid() = user_id);

-- Create attendance_records table
CREATE TABLE public.attendance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, subject_id, date)
);

-- Enable RLS on attendance_records
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- Attendance policies
CREATE POLICY "Users can view their own attendance" 
ON public.attendance_records FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own attendance" 
ON public.attendance_records FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own attendance" 
ON public.attendance_records FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own attendance" 
ON public.attendance_records FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at
  BEFORE UPDATE ON public.subjects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();