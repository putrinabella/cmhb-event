import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showSwal } from "@/lib/SwalHelper";
import {
  createEvent,
  updateEvent,
  getEventDetail,
  type EventItem,
} from "@/services/eventAPI";
import { handleApiError } from "@/lib/ErrorHandler";

export interface EventPayload {
  name: string;
  description?: string;
  event_date: string;
}

export function useEventForm(eventId?: string) {
  const isEdit = Boolean(eventId);
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventPayload>({
    name: "",
    description: "",
    event_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load data edit
  useEffect(() => {
    if (!isEdit) return;

    const fetchEvent = async () => {
      try {
        setLoading(true);
        const data: EventItem = await getEventDetail(eventId!);
        setEvent({
          name: data.name,
          description: data.description,
          event_date: data.event_date,
        });
      } catch (err) {
        await handleApiError(err, "idak dapat mengambil data event.");
        navigate("/events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, isEdit, navigate]);

  const handleSubmit = async () => {
    if (!event.name || !event.event_date) {
      await showSwal({
        title: "Perhatian",
        text: "Nama dan tanggal event wajib diisi.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      setSaving(true);
      if (isEdit) {
        await updateEvent(eventId!, event);
      } else {
        await createEvent(event);
      }

      await showSwal({
        title: "Berhasil",
        text: isEdit ? "Event berhasil diperbarui!" : "Event berhasil dibuat!",
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate("/events");
    } catch (err: any) {
      await handleApiError(
        err,
        isEdit
          ? "Terjadi kesalahan saat memperbarui event."
          : "Terjadi kesalahan saat membuat event."
      );
    } finally {
      setSaving(false);
    }
  };

  return {
    event,
    setEvent,
    loading,
    saving,
    isEdit,
    handleSubmit,
  };
}
