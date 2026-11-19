import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteParticipant } from "@/services/ParticipantAPI";
import { showSwal } from "@/lib/SwalHelper";
import { handleApiError } from "@/lib/ErrorHandler";

export function useDeleteParticipant(onSuccess?: () => void | Promise<void>) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDeleteParticipant = async (
    participantId: string,
    eventId?: string
  ) => {
    const result = await showSwal({
      title: "Hapus Partisipan?",
      text: "Data partisipan akan dihapus secara permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return false;

    try {
      setLoading(true);
      await deleteParticipant(participantId);

      if (onSuccess) await onSuccess();

      await showSwal({
        title: "Berhasil!",
        text: "Partisipan berhasil dihapus.",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Jika tidak ada onSuccess, arahkan ke detail event (opsional)
      if (!onSuccess && eventId) {
        navigate(`/events/detail/${eventId}`);
      }

      return true;
    } catch (err) {
      await handleApiError(err, "Terjadi kesalahan saat menghapus partisipan.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleDeleteParticipant, loading };
}
