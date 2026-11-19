import { apiRequest } from "./apiClient";
import {
  getPaginatedResource,
  type PaginatedParams,
  type ApiResponse,
  type PaginatedResponse,
  getResource,
} from "./genericApi";

export interface SettingsCard {
  prize_name?: string;
  prize_quantity?: number;
  url?: string;
  file?: File;
  picture_url?: string;
  sound_url?: string;
  video_url?: string;
  picture_file?: File;
  sound_file?: File;
  video_file?: File;

  slideshow_url?: string;
  input_mode?: "none" | "url" | "file";
}

export interface Participants {
  id: string;
  name: string;
  unit: string;
}

export interface Winners {
  id: string;
  event_participant: Participants;
}

export interface CardItem {
  id: string;
  event_id: string;
  title: string;
  type: string;
  position_order: number;
  is_active: boolean;
  created_at: string;
  prize_quantity_slot: number;
  settings: SettingsCard;
  winners?: Winners[];
}

export interface CardPayload {
  title: string;
  type: string;
  settings: Partial<SettingsCard>;
}

export const getCards = async (
  eventId: string,
  params?: PaginatedParams
): Promise<CardItem[]> => {
  const res = await getResource<CardItem>(
    `/events/${eventId}/event-cards`,
    params
  );
  return res;
};

export const getCardDetail = async (cardId: string): Promise<CardItem> => {
  const res = await apiRequest<ApiResponse<CardItem>>(
    "GET",
    `/event-cards/${cardId}`
  );
  return res.data;
};

export const createCard = async (
  eventId: string,
  payload: CardPayload
): Promise<CardItem> => {
  const hasFile =
    payload.settings?.file instanceof File ||
    payload.settings?.picture_file instanceof File ||
    payload.settings?.sound_file instanceof File ||
    payload.settings?.video_file instanceof File;

  if (hasFile) {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("type", payload.type);

    Object.entries(payload.settings || {}).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (value instanceof File) {
        formData.append(`settings[${key}]`, value);
      } else {
        formData.append(`settings[${key}]`, String(value));
      }
    });

    const res = await apiRequest<ApiResponse<CardItem>>(
      "POST",
      `/events/${eventId}/event-cards`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
  }

  const res = await apiRequest<ApiResponse<CardItem>>(
    "POST",
    `/events/${eventId}/event-cards`,
    payload
  );
  return res.data;
};

export const updateCard = async (
  eventId: string,
  cardId: string,
  payload: CardPayload
): Promise<CardItem> => {
  const hasFile =
    payload.settings?.file instanceof File ||
    payload.settings?.picture_file instanceof File ||
    payload.settings?.sound_file instanceof File ||
    payload.settings?.video_file instanceof File;

  if (hasFile) {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("type", payload.type);

    Object.entries(payload.settings || {}).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (value instanceof File) {
        formData.append(`settings[${key}]`, value);
      } else {
        formData.append(`settings[${key}]`, String(value));
      }
    });

    // ✅ Tambahkan ini agar backend paham itu PUT
    formData.append("_method", "PUT");

    const res = await apiRequest<ApiResponse<CardItem>>(
      "POST",
      `/events/${eventId}/event-cards/${cardId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
  }

  const res = await apiRequest<ApiResponse<CardItem>>(
    "PUT",
    `/events/${eventId}/event-cards/${cardId}`,
    payload
  );
  return res.data;
};

// export const createCard = async (
//   eventId: string,
//   payload: CardPayload
// ): Promise<CardItem> => {
//   const res = await apiRequest<ApiResponse<CardItem>>(
//     "POST",
//     `/events/${eventId}/event-cards`,
//     payload
//   );
//   return res.data;
// };

// export const updateCard = async (
//   eventId: string,
//   cardId: string,
//   payload: Partial<CardPayload>
// ): Promise<CardItem> => {
//   const res = await apiRequest<ApiResponse<CardItem>>(
//     "PUT",
//     `/events/${eventId}/event-cards/${cardId}`,
//     payload
//   );
//   return res.data;
// };

export const deleteCard = async (cardId: string): Promise<void> => {
  await apiRequest<void>("DELETE", `/event-cards/${cardId}`);
};

export const drawCard = async (
  eventId: string,
  cardId: string
): Promise<any> => {
  const res = await apiRequest<ApiResponse<any>>(
    "POST",
    `/events/${eventId}/event-cards/${cardId}/draw`
  );
  return res.data;
};

export const redrawCard = async (
  eventId: string,
  cardId: string,
  participantId: string
): Promise<any> => {
  const res = await apiRequest<ApiResponse<any>>(
    "POST",
    `/events/${eventId}/event-cards/${cardId}/redraw/${participantId}`
  );
  return res.data;
};

export const reorderCard = async (
  eventId: string,
  cardId: string,
  positionOrder: number
): Promise<CardItem> => {
  const res = await apiRequest<ApiResponse<CardItem>>(
    "PUT",
    `/events/${eventId}/event-cards/${cardId}/reorder`,
    { position_order: positionOrder }
  );
  return res.data;
};

// GET ALL (paginated)
export const getCardsPaginate = async (
  eventId: string,
  params?: PaginatedParams
): Promise<PaginatedResponse<CardItem>> => {
  const res: ApiResponse<PaginatedResponse<CardItem>> =
    await getPaginatedResource<CardItem>(
      `/events/${eventId}/event-cards`,
      params
    );
  return res.data;
};
