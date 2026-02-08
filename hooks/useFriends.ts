import { useState, useEffect, useCallback } from 'react';
import { Friend, getFriendsList, addFriendByCode, removeFriend, AddFriendError } from '../lib/friends';

export function useFriends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const list = await getFriendsList();
      setFriends(list);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addFriend = useCallback(async (
    code: string,
    isPremium: boolean
  ): Promise<{ success: boolean; error?: AddFriendError }> => {
    const result = await addFriendByCode(code, isPremium);
    if (result.success) {
      await load(); // Refresh list
    }
    return result;
  }, [load]);

  const removeFriendById = useCallback(async (friendId: string) => {
    const success = await removeFriend(friendId);
    if (success) {
      setFriends((prev) => prev.filter((f) => f.friend_id !== friendId));
    }
    return success;
  }, []);

  return {
    friends,
    loading,
    addFriend,
    removeFriend: removeFriendById,
    refetch: load,
  };
}
