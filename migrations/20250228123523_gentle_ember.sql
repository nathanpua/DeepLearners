/*
  # Initial database schema for BiasDetector

  1. New Tables
    - `profiles` - User profile information
    - `articles` - Stores article data for analysis
    - `analysis_results` - Stores overall analysis results
    - `biases` - Stores individual bias detections
    - `fact_checks` - Stores individual fact check results
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Create profiles table to store user data
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  email TEXT NOT NULL,
  name TEXT
);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT,
  author TEXT,
  date TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create analysis_results table
CREATE TABLE IF NOT EXISTS analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  overall_bias_score FLOAT NOT NULL,
  overall_factual_score FLOAT NOT NULL,
  summary TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create biases table
CREATE TABLE IF NOT EXISTS biases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  analysis_id UUID NOT NULL REFERENCES analysis_results(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  score FLOAT NOT NULL,
  explanation TEXT NOT NULL
);

-- Create fact_checks table
CREATE TABLE IF NOT EXISTS fact_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  analysis_id UUID NOT NULL REFERENCES analysis_results(id) ON DELETE CASCADE,
  is_factual BOOLEAN NOT NULL,
  confidence FLOAT NOT NULL,
  explanation TEXT NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE biases ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_checks ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create policies for articles
CREATE POLICY "Users can view their own articles"
  ON articles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own articles"
  ON articles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for analysis_results
CREATE POLICY "Users can view their own analysis results"
  ON analysis_results
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analysis results"
  ON analysis_results
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for biases
CREATE POLICY "Users can view biases for their analyses"
  ON biases
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM analysis_results
      WHERE analysis_results.id = biases.analysis_id
      AND analysis_results.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert biases for their analyses"
  ON biases
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM analysis_results
      WHERE analysis_results.id = biases.analysis_id
      AND analysis_results.user_id = auth.uid()
    )
  );

-- Create policies for fact_checks
CREATE POLICY "Users can view fact checks for their analyses"
  ON fact_checks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM analysis_results
      WHERE analysis_results.id = fact_checks.analysis_id
      AND analysis_results.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert fact checks for their analyses"
  ON fact_checks
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM analysis_results
      WHERE analysis_results.id = fact_checks.analysis_id
      AND analysis_results.user_id = auth.uid()
    )
  );

-- Create a trigger to create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();