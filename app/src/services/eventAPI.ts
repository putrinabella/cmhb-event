import { apiRequest } from "./apiClient";
import {
  getPaginatedResource,
  type PaginatedParams,
  type ApiResponse,
  type PaginatedResponse,
  getResource,
} from "./genericApi";

export interface EventItem {
  id: string;
  name: string;
  description: string;
  event_date: string;
  participant_total: number;
  created_by: string;
  created_at: string;
}

export const getEventPaginate = async (
  params: PaginatedParams
): Promise<PaginatedResponse<EventItem>> => {
  const res: ApiResponse<PaginatedResponse<EventItem>> =
    await getPaginatedResource<EventItem>("/events", params);
  return res.data;
};

export const getAllEvent = async (
  params?: PaginatedParams
): Promise<EventItem[]> => {
  const res = await getResource<EventItem>("/events", params);
  return res;
};

export const getEventDetail = async (eventId: string): Promise<EventItem> => {
  const res = await apiRequest<ApiResponse<EventItem>>(
    "GET",
    `/events/${eventId}`
  );
  return res.data;
};

export const createEvent = async (
  payload: Partial<EventItem>
): Promise<EventItem> => {
  const res = await apiRequest<ApiResponse<EventItem>>(
    "POST",
    "/events",
    payload
  );
  return res.data;
};

export const updateEvent = async (
  eventId: string,
  payload: Partial<EventItem>
): Promise<EventItem> => {
  const res = await apiRequest<ApiResponse<EventItem>>(
    "PUT",
    `/events/${eventId}`,
    payload
  );
  return res.data;
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  await apiRequest<void>("DELETE", `/events/${eventId}`);
};
