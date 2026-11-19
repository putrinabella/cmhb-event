import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showSwal } from "@/lib/SwalHelper";
import {
  createCard,
  updateCard,
  getCardDetail,
  type CardItem,
} from "@/services/cardAPI";
import { handleApiError } from "@/lib/ErrorHandler";

interface EventCardFormPayload {
  title: string;
  type: string;
  settings: {
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
  };
}

export function useCardForm(eventId?: string, cardId?: string) {
  const isEdit = Boolean(cardId);
  const navigate = useNavigate();

  const [card, setCard] = useState<EventCardFormPayload>({
    title: "",
    type: "",
    settings: {},
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // --- Fetch data jika edit mode
  useEffect(() => {
    if (!isEdit || !cardId) return;

    const fetchCard = async () => {
      try {
        setLoading(true);
        const data: CardItem = await getCardDetail(cardId);

        setCard({
          title: data.title,
          type: data.type,
          settings: data.settings || {},
        });
      } catch (err) {
        await handleApiError(err, "Tidak dapat mengambil data card");
        navigate(`/events/detail/${eventId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [isEdit, cardId, eventId, navigate]);

  // --- Submit handler
  const handleSubmit = async () => {
    if (!card.title || !card.type) {
      await showSwal({
        title: "Perhatian",
        text: "Judul dan tipe card wajib diisi.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      setSaving(true);
      if (!eventId) throw new Error("Event ID tidak ditemukan");

      // siapkan payload tanpa event_id
      const payload = {
        title: card.title,
        type: card.type,
        settings: card.settings,
      };

      if (isEdit) {
        await updateCard(eventId, cardId!, payload);
      } else {
        await createCard(eventId, payload);
      }

      await showSwal({
        title: "Berhasil",
        text: isEdit
          ? "Card berhasil diperbarui!"
          : "Card baru berhasil dibuat!",
        icon: "success",
        confirmButtonText: "OK",
      });

      navigate(`/events/detail/${eventId}`);
    } catch (err) {
      await handleApiError(
        err,
        isEdit
          ? "Terjadi kesalahan saat memperbarui card."
          : "Terjadi kesalahan saat membuat card."
      );
    } finally {
      setSaving(false);
    }
  };

  return {
    card,
    setCard,
    loading,
    saving,
    isEdit,
    handleSubmit,
  };
}
