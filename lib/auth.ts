import { supabase } from './supabase';

export async function initAuth(): Promise<string | null> {
  // Try to restore existing session
  const { data: { session } } = await supabase.auth.getSession();

  if (session?.user) {
    return session.user.id;
  }

  // No session - create anonymous user
  const { data, error } = await supabase.auth.signInAnonymously();

  if (error) {
    console.error('Anonymous auth failed:', error.message);
    return null;
  }

  return data.session?.user.id ?? null;
}
