import { useEffect, useState, useCallback } from "react";
import {
  getWinnerPaginate,
  getWinners,
  type WinnerItem,
} from "@/services/ParticipantAPI";
import type { PaginatedParams, PaginatedResponse } from "@/services/genericApi";

export function useWinners(
  eventId: string,
  initialPage = 1,
  search?: string,
  showAll = false
) {
  const [data, setData] = useState<WinnerItem[]>([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const fetchData = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      if (showAll) {
        // without pagination
        const res = await getWinners(eventId);
        setData(res);
        setTotal(res.length);
        setLastPage(1);
      } else {
        // with pagination
        const params: PaginatedParams = {
          page,
          per_page: perPage,
          search,
        };
        const res: PaginatedResponse<WinnerItem> = await getWinnerPaginate(
          eventId,
          params
        );
        setData(res.data);
        setTotal(res.total);
        setLastPage(res.last_page);
        setPerPage(res.per_page);
      }
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [eventId, page, perPage, search, showAll]);

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
