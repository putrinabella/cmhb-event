import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateEvent } from "@/services/eventAPI";
import { showSwal } from "@/lib/SwalHelper";
import { handleApiError } from "@/lib/ErrorHandler";

export function useUpdateEvent(eventId: string, onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = async (payload: {
    name: string;
    description?: string;
    event_date?: string;
  }) => {
    const result = await showSwal({
      title: "Perbarui Event?",
      text: "Pastikan data event sudah benar.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Perbarui",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await updateEvent(eventId, payload);

      await showSwal({
        title: "Berhasil!",
        text: "Event berhasil diperbarui.",
        icon: "success",
        confirmButtonText: "OK",
        onClose: () => {
          if (onSuccess) onSuccess();
          else navigate("/events");
        },
      });
    } catch (err) {
      await handleApiError(err, "Terjadi kesalahan saat menyimpan event");
    } finally {
      setLoading(false);
    }
  };

  return { update, loading };
}
