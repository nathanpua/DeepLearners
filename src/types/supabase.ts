export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string
          created_at: string
          title: string
          content: string
          source: string | null
          author: string | null
          date: string | null
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          content: string
          source?: string | null
          author?: string | null
          date?: string | null
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          content?: string
          source?: string | null
          author?: string | null
          date?: string | null
          user_id?: string
        }
      }
      analysis_results: {
        Row: {
          id: string
          created_at: string
          article_id: string
          overall_bias_score: number
          overall_factual_score: number
          summary: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          article_id: string
          overall_bias_score: number
          overall_factual_score: number
          summary: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          article_id?: string
          overall_bias_score?: number
          overall_factual_score?: number
          summary?: string
          user_id?: string
        }
      }
      biases: {
        Row: {
          id: string
          created_at: string
          analysis_id: string
          category: string
          score: number
          explanation: string
        }
        Insert: {
          id?: string
          created_at?: string
          analysis_id: string
          category: string
          score: number
          explanation: string
        }
        Update: {
          id?: string
          created_at?: string
          analysis_id?: string
          category?: string
          score?: number
          explanation?: string
        }
      }
      fact_checks: {
        Row: {
          id: string
          created_at: string
          analysis_id: string
          is_factual: boolean
          confidence: number
          explanation: string
        }
        Insert: {
          id?: string
          created_at?: string
          analysis_id: string
          is_factual: boolean
          confidence: number
          explanation: string
        }
        Update: {
          id?: string
          created_at?: string
          analysis_id?: string
          is_factual?: boolean
          confidence?: number
          explanation?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string | null
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          name?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}