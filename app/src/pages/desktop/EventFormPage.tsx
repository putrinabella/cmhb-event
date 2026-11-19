import {
  CalendarDays,
  X,
  Save,
  Plus,
  Edit,
  PartyPopper,
  NotebookPen,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { usePageHeader } from "@/context/PageHeaderContext";
import { useEventForm } from "@/hooks/use-events-form";
import { useEffect } from "react";
import { LoadingIndicator } from "@/components/LoadingIndicator";

export default function EventFormPage() {
  const { id } = useParams();
  const { setHeader } = usePageHeader();

  const { event, setEvent, loading, saving, isEdit, handleSubmit } =
    useEventForm(id);

  useEffect(() => {
    setHeader({
      breadcrumb: [
        { label: "Dashboard", path: "/" },
        { label: "Event", path: "/events" },
        { label: isEdit ? "Edit Event" : "Buat Event", path: "" },
      ],
      icon: isEdit ? Edit : Plus,
      title: isEdit ? "Edit Event" : "Buat Event",
      description: isEdit ? "Ubah detail event" : "Buat event baru",
    });
  }, [setHeader, isEdit]);

  if (loading) return <LoadingIndicator />;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-base-200  overflow-hidden space-y-6">
      {/* Event Name */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-base font-semibold text-base-content">
          <PartyPopper className="w-5 h-5 text-primary" />
          <span>Nama Event</span>
          <span className="text-error">*</span>
        </label>
        <input
          type="text"
          value={event.name}
          onChange={(e) => setEvent({ ...event, name: e.target.value })}
          className="w-full px-4 py-3 bg-base-50 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-base-content"
          placeholder="Masukkan nama event"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-base font-semibold text-base-content">
          <NotebookPen className="w-5 h-5 text-primary" />
          <span>Deskripsi</span>
        </label>
        <textarea
          rows={4}
          value={event.description}
          onChange={(e) => setEvent({ ...event, description: e.target.value })}
          className="w-full px-4 py-3 bg-base-50 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-base-content resize-none"
          placeholder="Masukkan deskripsi event (opsional)"
        />
      </div>

      {/* Event Date */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-base font-semibold text-base-content">
          <CalendarDays className="w-5 h-5 text-primary" />
          <span>Tanggal Event</span>
          <span className="text-error">*</span>
        </label>
        <input
          type="date"
          value={event.event_date}
          onChange={(e) => setEvent({ ...event, event_date: e.target.value })}
          className="w-full px-4 py-3 bg-base-50 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-base-content"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end mt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-primary-content px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
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
