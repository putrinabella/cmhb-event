import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
  CalendarCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePageHeader } from "@/context/PageHeaderContext";
import { useAllEvent } from "@/hooks/use-events";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import {
  useCalendarData,
  useDashboardStats,
  useEventMap,
  useMonthName,
} from "@/hooks/use-dashboard";
import { CalendarCell } from "@/components/CalendarCell";
import CardList from "@/components/CardList";

export default function DashboardPage() {
  const today = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const { data: events = [], loading, error } = useAllEvent();
  const { setHeader } = usePageHeader();

  const eventsByDate = useEventMap(events);
  const stats = useDashboardStats(events, today);
  const calendar = useCalendarData(currentDate);
  const monthName = useMonthName(currentDate);

  useEffect(() => {
    setHeader({
      breadcrumb: [],
      icon: Calendar,
      title: "Dashboard",
      description: "Kelola dan pantau semua event dalam satu tempat",
      stats: [
        { label: "Event Selesai", value: stats.pastEvents.length },
        { label: "Event Mendatang", value: stats.futureEvents.length },
        { label: "Total Event", value: stats.totalEvents },
      ],
    });
  }, [setHeader, stats]);

  if (loading) return <LoadingIndicator />;

  if (error) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="bg-error/5 border-2 border-error/20 rounded-2xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
          <h2 className="text-xl font-bold text-error mb-2">
            Terjadi Kesalahan
          </h2>
          <p className="text-base-content/70">
            Gagal memuat data event. Silakan coba lagi.
          </p>
        </div>
      </div>
    );
  }

  const { daysInMonth, startingDayOfWeek } = calendar;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Kalender Event (2/3) */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            Kalender Event
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() - 1,
                    1
                  )
                )
              }
              className="p-2 hover:bg-base-200 rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-lg font-semibold text-base-content min-w-[200px] text-center">
              {monthName}
            </span>
            <button
              onClick={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1,
                    1
                  )
                )
              }
              className="p-2 hover:bg-base-200 rounded-lg transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-base-content/70 py-3 text-sm"
            >
              {day}
            </div>
          ))}

          {[...Array(startingDayOfWeek)].map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}

          {[...Array(daysInMonth)].map((_, index) => {
            const day = index + 1;
            const date = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              day
            );
            const dateKey = date.toDateString();
            const dayEvents = eventsByDate.get(dateKey) || [];
            const isToday = date.toDateString() === today.toDateString();
            const hasEvents = dayEvents.length > 0;

            return (
              <CalendarCell
                key={day}
                day={day}
                date={date}
                isToday={isToday}
                hasEvents={hasEvents}
                eventsCount={dayEvents.length}
                events={dayEvents}
                onMouseEnter={() => setHoveredDate(dateKey)}
                onMouseLeave={() => setHoveredDate(null)}
                showTooltip={hoveredDate === dateKey}
              />
            );
          })}
        </div>
      </div>

      {/* Sisi Kanan (1/3) */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        {/* Event Minggu Ini */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <h2 className="text-base font-bold text-base-content mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-secondary" />
            Event Terdekat
          </h2>

          {stats.upcomingEvents.length === 0 ? (
            <p className="text-center text-base-content/50 py-8">
              Tidak ada event minggu ini
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {stats.upcomingEvents.map((event) => {
                const eventDate = new Date(event.event_date);
                const isPast = eventDate < today;
                const isToday =
                  eventDate.toDateString() === today.toDateString();

                return (
                  <CardList
                    key={event.id}
                    name={event.name}
                    description={event.description}
                    date={event.event_date}
                    participant_total={event.participant_total}
                    isPast={isPast}
                    isToday={isToday}
                    detailPath={`/events/detail/${event.id}`}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Event Bulan Ini */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <h2 className="text-base font-bold text-base-content mb-4 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-primary" />
            Event Bulan Ini
          </h2>

          {stats.thisMonthEvents.length === 0 ? (
            <p className="text-center text-base-content/50 py-8">
              Tidak ada event bulan ini
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {stats.thisMonthEvents.map((event) => {
                const eventDate = new Date(event.event_date);
                const isPast = eventDate < today;
                const isToday =
                  eventDate.toDateString() === today.toDateString();

                return (
                  <CardList
                    key={event.id}
                    name={event.name}
                    description={event.description}
                    date={event.event_date}
                    participant_total={event.participant_total}
                    isPast={isPast}
                    isToday={isToday}
                    detailPath={`/events/detail/${event.id}`}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
