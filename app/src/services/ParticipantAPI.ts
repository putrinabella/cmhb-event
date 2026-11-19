import { apiRequest } from "./apiClient";
import {
  getPaginatedResource,
  type PaginatedParams,
  type ApiResponse,
  type PaginatedResponse,
  getResource,
} from "./genericApi";

export interface ParticipantItem {
  id: string;
  name: string;
  unit: string;
}

export interface WinnerItem {
  id: string;
  prize_name: string;
  drawn_at: string;
  event_participant: ParticipantItem;
}

export const getParticipantsPaginate = async (
  eventId: string,
  params: PaginatedParams
): Promise<PaginatedResponse<ParticipantItem>> => {
  const res: ApiResponse<PaginatedResponse<ParticipantItem>> =
    await getPaginatedResource<ParticipantItem>(
      `/events/${eventId}/event_participants`,
      params
    );
  return res.data;
};

export const getParticipants = async (
  eventId: string,
  params?: PaginatedParams
): Promise<ParticipantItem[]> => {
  const res = await getResource<ParticipantItem>(
    `/events/${eventId}/event_participants`,
    params
  );
  return res;
};

export const getParticipantDetail = async (
  participantId: string
): Promise<ParticipantItem> => {
  const res = await apiRequest<ApiResponse<ParticipantItem>>(
    "GET",
    `/event-participants/${participantId}`
  );
  return res.data;
};

export const createParticipant = async (
  eventId: string,
  payload: Partial<ParticipantItem>
): Promise<ParticipantItem> => {
  const res = await apiRequest<ApiResponse<ParticipantItem>>(
    "POST",
    `/events/${eventId}/event_participants`,
    payload
  );
  return res.data;
};

export const updateParticipant = async (
  eventId: string,
  participantId: string,
  payload: Partial<ParticipantItem>
): Promise<ParticipantItem> => {
  const res = await apiRequest<ApiResponse<ParticipantItem>>(
    "PUT",
    `/events/${eventId}/event_participants/${participantId}`,
    payload
  );
  return res.data;
};

export const deleteParticipant = async (
  participantId: string
): Promise<void> => {
  await apiRequest<void>("DELETE", `/event-participants/${participantId}`);
};

export const importParticipants = (file: File, eventId: string) => {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest<ApiResponse<any>>(
    "POST",
    `/events/${eventId}/event_participants/import`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};

export const getWinnerPaginate = async (
  eventId: string,
  params?: PaginatedParams
): Promise<PaginatedResponse<WinnerItem>> => {
  const res: ApiResponse<PaginatedResponse<WinnerItem>> =
    await getPaginatedResource<WinnerItem>(
      `/events/${eventId}/winners`,
      params
    );
  return res.data;
};

export const getWinners = async (eventId: string): Promise<WinnerItem[]> => {
  const res = await getResource<WinnerItem>(`/events/${eventId}/winners`);
  return res;
};
