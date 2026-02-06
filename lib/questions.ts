import { supabase } from './supabase';
import { Question } from '../types/database';

export async function getTodayQuestion(): Promise<Question | null> {
  const today = new Date().toISOString().split('T')[0]; // UTC date YYYY-MM-DD

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('scheduled_date', today)
    .eq('is_active', true)
    .single();

  if (error) {
    // PGRST116 = no rows found (not an error, just no question today)
    if (error.code === 'PGRST116') return null;
    console.error('Error fetching question:', error.message);
    return null;
  }

  return data as Question;
}
