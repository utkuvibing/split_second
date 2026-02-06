import { initAuth } from '../auth';

jest.mock('../supabase');
import { supabase } from '../supabase';

describe('initAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns userId when existing session exists', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: {
        session: {
          user: { id: 'existing-user-id' }
        }
      },
      error: null
    });

    const userId = await initAuth();

    expect(userId).toBe('existing-user-id');
    expect(supabase.auth.getSession).toHaveBeenCalledTimes(1);
    expect(supabase.auth.signInAnonymously).not.toHaveBeenCalled();
  });

  it('calls signInAnonymously when no existing session and returns new userId', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: null
    });

    (supabase.auth.signInAnonymously as jest.Mock).mockResolvedValue({
      data: {
        session: {
          user: { id: 'new-anonymous-user-id' }
        }
      },
      error: null
    });

    const userId = await initAuth();

    expect(userId).toBe('new-anonymous-user-id');
    expect(supabase.auth.getSession).toHaveBeenCalledTimes(1);
    expect(supabase.auth.signInAnonymously).toHaveBeenCalledTimes(1);
  });

  it('logs error and returns null when signInAnonymously fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: null
    });

    (supabase.auth.signInAnonymously as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: { message: 'Anonymous auth failed' }
    });

    const userId = await initAuth();

    expect(userId).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Anonymous auth failed:',
      'Anonymous auth failed'
    );

    consoleSpy.mockRestore();
  });

  it('returns null when getSession returns no user and signIn returns null session', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: null
    });

    (supabase.auth.signInAnonymously as jest.Mock).mockResolvedValue({
      data: {
        session: null // session is null
      },
      error: null
    });

    const userId = await initAuth();

    expect(userId).toBeNull();
  });

  it('returns null when getSession has session without user and signIn returns null session', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: {} }, // session without user
      error: null
    });

    (supabase.auth.signInAnonymously as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: null
    });

    const userId = await initAuth();

    expect(userId).toBeNull();
  });
});
