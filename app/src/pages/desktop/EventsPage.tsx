import { Eye, Calendar, Plus } from "lucide-react";
import Pagination from "@/components/Pagination";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { usePageHeader } from "@/context/PageHeaderContext";
import { useEffect } from "react";
import { useDeleteEvent } from "@/hooks/use-events-delete";
import { CardComponent } from "@/components/CardComponent";
import { getEventStatus } from "@/utils/dateUtils";

interface SharedProps {
  user: { role: string; name?: string };
  events: any[];
  loading: boolean;
  error: any;
  page: number;
  lastPage: number;
  total: number;
  onPageChange: (page: number) => void;
  refetch: () => void;
}

export default function EventsPage({
  user,
  events,
  loading,
  error,
  page,
  lastPage,
  total,
  onPageChange,
  refetch,
}: SharedProps) {
  const { setHeader } = usePageHeader();

  useEffect(() => {
    setHeader({
      breadcrumb: [
        { label: "Dashboard", path: "/" },
        { label: "Event", path: "/" },
      ],
      icon: Calendar,
      title: "Event Management",
      description: "Kelola semua event di sini",
      actionLink: "/events/create",
      actionLabel: "Tambah Event",
      actionIcon: Plus,
      stats: [
        { label: "Total Event", value: total },
        { label: "Halaman", value: `${page} / ${lastPage}` },
        { label: "Event Tampil", value: events.length },
      ],
    });
  }, [setHeader, total, page, lastPage, events.length]);

  const { handleDelete } = useDeleteEvent(async () => {
    await refetch();
  });

  if (user.role !== "admin") {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="bg-error/5 border-2 border-error/20 rounded-2xl p-8 w-full text-center">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-error" />
          </div>
          <h2 className="text-xl font-bold text-error mb-2">Akses Ditolak</h2>
          <p className="text-base-content/70">
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {loading ? (
        <LoadingIndicator />
      ) : error ? (
        <div className="text-error">Gagal memuat card event</div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl">
          <div className="text-pink-300 mb-4">
            <Calendar size={64} className="mx-auto" />
          </div>
          <p className="text-gray-500 italic">Belum ada event.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-5 gap-6">
            {events.map((event) => {
              const status = getEventStatus(event.event_date);
              return (
                <CardComponent
                  key={event.id}
                  id={event.id}
                  info={status.statusLabel}
                  title={event.name}
                  description={event.description}
                  event_date={event.event_date}
                  participant={event.participant_total}
                  detailPath={`/events/detail/${event.id}`}
                  editPath={`/events/edit/${event.id}`}
                  onDelete={() => handleDelete(event.id)}
                />
              );
            })}
          </div>

          {lastPage > 1 && (
            <div className="border-t border-base-200 bg-base-50 mt-6">
              <Pagination
                page={page}
                lastPage={lastPage}
                onPageChange={onPageChange}
                total={total}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
