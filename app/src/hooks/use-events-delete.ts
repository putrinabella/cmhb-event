import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteEvent } from "@/services/eventAPI";
import { showSwal } from "@/lib/SwalHelper";
import { handleApiError } from "@/lib/ErrorHandler";

export function useDeleteEvent(onSuccess?: () => void | Promise<void>) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async (eventId: string) => {
    const result = await showSwal({
      title: "Hapus Event?",
      text: "Data event akan dihapus secara permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return false;

    try {
      setLoading(true);
      await deleteEvent(eventId);

      if (onSuccess) await onSuccess();

      await showSwal({
        title: "Berhasil!",
        text: "Event berhasil dihapus.",
        icon: "success",
        confirmButtonText: "OK",
      });

      if (!onSuccess) navigate("/events");
      return true;
    } catch (err) {
      await handleApiError(err, "erjadi kesalahan saat menghapus event");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleDelete, loading };
}
