import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// These environment variables will be set after connecting to Supabase
//const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseUrl = "https://ckhusghpstnfdwvrirxl.supabase.co";
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNraHVzZ2hwc3RuZmR3dnJpcnhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NDU1MTYsImV4cCI6MjA1NjMyMTUxNn0.nr_JZFabo7924n0LRPy8qnUuqn26VLXKH8VX_a4Fte8';
//const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a single supabase client for the entire app
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);