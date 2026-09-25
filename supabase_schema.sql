-- =========================================================
-- EduHub - Supabase PostgreSQL Database Schema
-- Run this script in: Supabase Dashboard -> SQL Editor -> New Query
-- =========================================================

-- 1. Create table for Classes and Students
CREATE TABLE IF NOT EXISTS public.classes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  grade INTEGER NOT NULL DEFAULT 8,
  academic_year TEXT DEFAULT '2024 - 2025',
  students JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create table for Q&A Forum
CREATE TABLE IF NOT EXISTS public.qa_questions (
  id TEXT PRIMARY KEY,
  grade INTEGER NOT NULL,
  subject TEXT NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  real_name TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  time TEXT,
  teacher_answer TEXT,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qa_questions ENABLE ROW LEVEL SECURITY;

-- 4. Policies for EduHub (Allow anon read and write for classroom usage)
CREATE POLICY "Allow public read access to classes" 
  ON public.classes FOR SELECT USING (true);

CREATE POLICY "Allow public insert/update to classes" 
  ON public.classes FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access to qa_questions" 
  ON public.qa_questions FOR SELECT USING (true);

CREATE POLICY "Allow public insert/update to qa_questions" 
  ON public.qa_questions FOR ALL USING (true) WITH CHECK (true);

-- 5. Create table for Security Audit & Attack Detection Logs
CREATE TABLE IF NOT EXISTS public.security_incident_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT,
  threat_type TEXT NOT NULL,
  threat_level TEXT NOT NULL DEFAULT 'HIGH',
  endpoint TEXT NOT NULL,
  payload TEXT,
  user_agent TEXT,
  action_taken TEXT DEFAULT 'BLOCKED_403',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.security_incident_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert to security_incident_logs"
  ON public.security_incident_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to security_incident_logs"
  ON public.security_incident_logs FOR SELECT USING (true);
