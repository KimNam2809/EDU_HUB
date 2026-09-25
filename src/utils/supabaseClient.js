import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    !supabaseUrl.includes('your-project-id') &&
    !supabaseAnonKey.includes('your-supabase-anon-key')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Fetch classes from Supabase (falls back to local storage if unavailable)
 */
export async function loadClassesWithCloudFallback(defaultClasses) {
  if (!supabase) {
    try {
      const saved = localStorage.getItem('khtn_hub_classes');
      return saved ? JSON.parse(saved) : defaultClasses;
    } catch (e) {
      return defaultClasses;
    }
  }

  try {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('name');

    if (error || !data || data.length === 0) {
      // Fallback to local storage if remote table is not yet populated
      const saved = localStorage.getItem('khtn_hub_classes');
      return saved ? JSON.parse(saved) : defaultClasses;
    }

    return data;
  } catch (err) {
    console.warn('EduHub Supabase fallback to local storage:', err);
    const saved = localStorage.getItem('khtn_hub_classes');
    return saved ? JSON.parse(saved) : defaultClasses;
  }
}

/**
 * Sync classes to Supabase and LocalStorage
 */
export async function syncClasses(classes) {
  try {
    localStorage.setItem('khtn_hub_classes', JSON.stringify(classes));
  } catch (e) {}

  if (supabase) {
    try {
      // Upsert classes to Supabase
      await supabase
        .from('classes')
        .upsert(
          classes.map(c => ({
            id: c.id,
            name: c.name,
            grade: c.grade,
            academic_year: c.academicYear,
            students: c.students,
            updated_at: new Date().toISOString()
          }))
        );
    } catch (err) {
      console.warn('EduHub cloud sync note:', err);
    }
  }
}
