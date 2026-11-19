import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCard } from "@/services/cardAPI";
import { showSwal } from "@/lib/SwalHelper";
import { handleApiError } from "@/lib/ErrorHandler";

export function useDeleteCard(onSuccess?: () => void | Promise<void>) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async (cardId: string, eventId?: string) => {
    const result = await showSwal({
      title: "Hapus Card?",
      text: "Data card akan dihapus secara permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return false;

    try {
      setLoading(true);
      await deleteCard(cardId);

      if (onSuccess) await onSuccess();

      await showSwal({
        title: "Berhasil!",
        text: "Card berhasil dihapus.",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Jika tidak ada onSuccess, arahkan ke detail event (opsional)
      if (!onSuccess && eventId) {
        navigate(`/events/detail/${eventId}`);
      }

      return true;
    } catch (err) {
      await handleApiError(err, "Terjadi kesalahan saat menghapus card");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleDelete, loading };
}
