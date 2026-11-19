import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showSwal } from "@/lib/SwalHelper";
import {
  createParticipant,
  updateParticipant,
  getParticipantDetail,
  type ParticipantItem,
} from "@/services/ParticipantAPI";
import { handleApiError } from "@/lib/ErrorHandler";

interface ParticipantPayload {
  name: string;
  unit: string;
}

export function useParticipantForm(eventId?: string, participantId?: string) {
  const isEdit = Boolean(participantId);
  const navigate = useNavigate();

  const [participant, setParticipant] = useState<ParticipantPayload>({
    name: "",
    unit: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // --- Fetch data jika edit mode
  useEffect(() => {
    if (!isEdit || !participantId) return;

    const fetchParticipant = async () => {
      try {
        setLoading(true);
        const data: ParticipantItem = await getParticipantDetail(participantId);

        setParticipant({
          name: data.name,
          unit: data.unit,
        });
      } catch (err) {
        await handleApiError(err, "Tidak dapat mengambil data partisipan");
        navigate(`/events/detail/${eventId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipant();
  }, [isEdit, participantId, eventId, navigate]);

  // --- Submit handler
  const handleSubmit = async () => {
    if (!participant.name || !participant.unit) {
      await showSwal({
        title: "Perhatian",
        text: "Nama dan unit partisipan wajib diisi.",
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
        name: participant.name,
        unit: participant.unit,
      };

      if (isEdit) {
        await updateParticipant(eventId, participantId!, payload);
      } else {
        await createParticipant(eventId, payload);
      }

      await showSwal({
        title: "Berhasil",
        text: isEdit
          ? "Participant berhasil diperbarui!"
          : "Participant baru berhasil dibuat!",
        icon: "success",
        confirmButtonText: "OK",
      });

      navigate(`/events/detail/${eventId}`);
    } catch (err) {
      await showSwal({
        title: "Gagal",
        text: isEdit
          ? "Terjadi kesalahan saat memperbarui partisipan."
          : "Terjadi kesalahan saat membuat partisipan.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    participant,
    setParticipant,
    loading,
    saving,
    isEdit,
    handleSubmit,
  };
}
