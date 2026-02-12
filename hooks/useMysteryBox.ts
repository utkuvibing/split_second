import { useState, useCallback } from 'react';
import {
  MysteryBox,
  BoxDropResult,
  BoxOpenResult,
  checkMysteryBoxDrop,
  openMysteryBox,
  getUnopenedBoxes,
} from '../lib/mysteryBox';

export function useMysteryBox() {
  const [inventory, setInventory] = useState<MysteryBox[]>([]);
  const [lastDrop, setLastDrop] = useState<BoxDropResult | null>(null);
  const [lastOpen, setLastOpen] = useState<BoxOpenResult | null>(null);
  const [loading, setLoading] = useState(false);

  const checkDrop = useCallback(async (): Promise<BoxDropResult> => {
    const result = await checkMysteryBoxDrop();
    if (result.dropped) {
      setLastDrop(result);
    }
    return result;
  }, []);

  const openBox = useCallback(async (boxId: string): Promise<BoxOpenResult> => {
    setLoading(true);
    const result = await openMysteryBox(boxId);
    setLastOpen(result);
    if (result.success) {
      setInventory((prev) => prev.filter((b) => b.id !== boxId));
    }
    setLoading(false);
    return result;
  }, []);

  const fetchInventory = useCallback(async () => {
    const boxes = await getUnopenedBoxes();
    setInventory(boxes);
  }, []);

  const clearDrop = useCallback(() => setLastDrop(null), []);
  const clearOpen = useCallback(() => setLastOpen(null), []);

  return {
    inventory,
    lastDrop,
    lastOpen,
    loading,
    checkDrop,
    openBox,
    fetchInventory,
    clearDrop,
    clearOpen,
  };
}
