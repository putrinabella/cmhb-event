import { useEffect, useState, useCallback } from "react";
import {
  getAllEvent,
  getEventPaginate,
  type EventItem,
} from "@/services/eventAPI";
import type { PaginatedParams, PaginatedResponse } from "@/services/genericApi";

export function useEvents(initialPage = 1, search?: string) {
  const [data, setData] = useState<EventItem[]>([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: PaginatedParams = {
        page,
        per_page: perPage,
        search,
      };

      const res: PaginatedResponse<EventItem> = await getEventPaginate(params);
      setData(res.data);
      setTotal(res.total);
      setLastPage(res.last_page);
      setPerPage(res.per_page);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    page,
    setPage,
    total,
    lastPage,
    perPage,
    refetch,
  };
}

export function useAllEvent() {
  const [data, setData] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllEvent();
      setData(res);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const refetch = useCallback(() => {
    fetchCards();
  }, [fetchCards]);

  return { data, loading, error, refetch };
}
