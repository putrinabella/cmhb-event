import { useEffect, useState, useCallback } from "react";
import { getCards, type CardItem } from "@/services/cardAPI";

export function useCards(eventId: string) {
  const [data, setData] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchCards = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      const res = await getCards(eventId);
      setData(res);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const refetch = useCallback(() => {
    fetchCards();
  }, [fetchCards]);

  return { data, loading, error, refetch };
}
