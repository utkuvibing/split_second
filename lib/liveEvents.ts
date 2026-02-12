import { supabase } from './supabase';

export type EventStatus = 'active' | 'upcoming';

export interface LiveEvent {
  has_event: boolean;
  status?: EventStatus;
  id?: string;
  option_a?: string;
  option_b?: string;
  starts_at?: string;
  ends_at?: string;
  coin_reward?: number;
  mystery_box_guaranteed?: boolean;
  count_a?: number;
  count_b?: number;
  user_choice?: string | null;
}

export interface LiveVoteResult {
  success: boolean;
  count_a?: number;
  count_b?: number;
  coins_earned?: number;
  error?: string;
}

export async function getLiveEvent(): Promise<LiveEvent> {
  const { data, error } = await supabase.rpc('get_live_event');
  if (error) return { has_event: false };
  return data as LiveEvent;
}

export async function submitLiveVote(
  eventId: string,
  choice: 'a' | 'b'
): Promise<LiveVoteResult> {
  const { data, error } = await supabase.rpc('submit_live_event_vote', {
    p_event_id: eventId,
    p_choice: choice,
  });
  if (error) return { success: false, error: 'vote_failed' };
  return data as LiveVoteResult;
}

/** Subscribe to real-time vote inserts for a live event */
export function subscribeLiveVotes(
  eventId: string,
  onVote: (choice: string) => void
) {
  const channel = supabase
    .channel(`live_event_${eventId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'live_event_votes',
        filter: `event_id=eq.${eventId}`,
      },
      (payload) => {
        onVote(payload.new.choice);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
