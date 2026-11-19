// File: services/gachaAPI.ts
import { apiRequest } from "./apiClient";
import { type ApiResponse } from "./genericApi";

export interface Participant {
  id: string;
  name: string;
  unit: string;
  is_winner: boolean;
  created_at: string;
}

export interface Winner {
  id: string;
  name: string;
  unit: string;
  is_winner?: boolean;
  created_at?: string;
}

export interface CardDetail {
  id: string;
  event_id: string;
  title: string;
  type: string;
  position_order: number;
  settings: {
    prize_name: string;
    prize_quantity: string;
  };
  is_active: boolean;
  created_at: string;
  winners: Winner[];
  prize_quantity_slot: number;
}

export interface DrawResponse {
  rolled_participants: Participant[];
  winner: Winner;
}

export const drawCard = async (
  eventId: string,
  cardId: string
): Promise<DrawResponse> => {
  const res = await apiRequest<ApiResponse<DrawResponse>>(
    "POST",
    `/events/${eventId}/event-cards/${cardId}/draw`
  );
  return res.data;
};
