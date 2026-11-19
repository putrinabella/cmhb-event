import { X, Save, Plus, Edit, Users, Building2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { usePageHeader } from "@/context/PageHeaderContext";
import { useParticipantForm } from "@/hooks/use-participant-form";
import { useEffect, useState } from "react";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { getEventDetail, type EventItem } from "@/services/eventAPI";

export default function ParticipantFormPage() {
  const { eventId, participantId } = useParams();
  const { setHeader } = usePageHeader();
  const { participant, setParticipant, loading, saving, isEdit, handleSubmit } =
    useParticipantForm(eventId, participantId);
  const [event, setEvent] = useState<EventItem | null>(null);
  const [, setLoadingEvent] = useState(true);
  const [, setErrorEvent] = useState<string | null>(null);

  // Ambil data event untuk breadcrumb
  useEffect(() => {
    if (!eventId) return;
    getEventDetail(eventId)
      .then((data) => setEvent(data))
      .catch(() => setErrorEvent("Gagal memuat data event"))
      .finally(() => setLoadingEvent(false));
  }, [eventId]);

  // Header halaman
  useEffect(() => {
    setHeader({
      breadcrumb: [
        { label: "Dashboard", path: "/" },
        { label: event?.name || "Event", path: `/events/detail/${eventId}` },
        { label: isEdit ? "Edit Partisipan" : "Buat Partisipan", path: "" },
      ],
      icon: isEdit ? Edit : Plus,
      title: isEdit ? "Edit Partisipan" : "Buat Partisipan",
      description: isEdit
        ? "Ubah detail partisipan event"
        : "Tambahkan partisipan baru ke dalam event",
    });
  }, [setHeader, isEdit, eventId, event]);

  if (loading) return <LoadingIndicator />;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-base-200 space-y-6">
      {/* Nama Partisipan */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-base font-semibold text-base-content">
          <Users className="w-5 h-5 text-primary" />
          <span>Nama Partisipan</span>
          <span className="text-error">*</span>
        </label>
        <input
          type="text"
          value={participant.name}
          onChange={(e) =>
            setParticipant({ ...participant, name: e.target.value })
          }
          className="w-full px-4 py-3 bg-base-50 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-base-content"
          placeholder="Masukkan nama partisipan"
        />
      </div>

      {/* Unit / Asal */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-base font-semibold text-base-content">
          <Building2 className="w-5 h-5 text-primary" />
          <span>Unit / Asal</span>
          <span className="text-error">*</span>
        </label>
        <input
          type="text"
          value={participant.unit}
          onChange={(e) =>
            setParticipant({ ...participant, unit: e.target.value })
          }
          className="w-full px-4 py-3 bg-base-50 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-base-content"
          placeholder="Masukkan unit atau asal partisipan"
        />
      </div>

      {/* Tombol Aksi */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end mt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 px-4 py-2 rounded-xl hover:shadow-md transition-all duration-300 hover:scale-105"
        >
          <X className="w-5 h-5" />
          <span>Batal</span>
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-primary-content px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          {saving ? (
            <span>Menyimpan...</span>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>{isEdit ? "Simpan Perubahan" : "Simpan"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
