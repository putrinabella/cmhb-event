import { memo } from "react";
import { CalendarCheck } from "lucide-react";
import type { EventItem } from "@/services/eventAPI";
import { capitalizeEachWord } from "@/utils/stringUtils";

interface CalendarCellProps {
  day: number;
  date: Date;
  isToday: boolean;
  hasEvents: boolean;
  eventsCount: number;
  events: EventItem[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  showTooltip: boolean;
}

export const CalendarCell = memo((props: CalendarCellProps) => {
  const {
    day,
    date,
    isToday,
    hasEvents,
    events,
    onMouseEnter,
    onMouseLeave,
    showTooltip,
  } = props;

  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={`aspect-square border-1 rounded-xl p-2 flex flex-col justify-start relative transition-all cursor-pointer overflow-hidden ${
          isToday
            ? "bg-gradient-to-br from-primary to-secondary border-primary text-primary-content font-bold shadow-lg scale-105"
            : hasEvents
            ? "bg-base-200 border-primary/30 hover:shadow-md hover:scale-105"
            : "bg-base-100/50 border-base-300 hover:bg-base-200"
        }`}
      >
        {/* Tanggal */}
        <span
          className={`text-sm font-semibold mb-1 ${
            isToday ? "text-primary-content" : "text-base-content"
          }`}
        >
          {day}
        </span>

        {/* Event list seperti blok kalender */}
        {hasEvents && (
          <div className="flex flex-col gap-1 w-full">
            {events.slice(0, 2).map((event, i) => (
              <div
                key={i}
                className={`text-[10px] font-medium truncate rounded-md px-1 py-0.5 ${
                  isToday ? "bg-primary-content/20" : "bg-primary/10"
                }`}
                title={capitalizeEachWord(event.name)}
              >
                {capitalizeEachWord(event.name)}
              </div>
            ))}

            {events.length > 2 && (
              <p className="text-[10px] text-primary font-semibold">
                +{events.length - 2} lainnya
              </p>
            )}
          </div>
        )}
      </div>
      {/* Tooltip jika ingin tetap tampil detail */}
      {showTooltip && hasEvents && (
        <div className="absolute z-50 bg-white border border-primary/40 rounded-xl shadow-2xl p-4 min-w-[220px] left-1/2 -translate-x-1/2 top-full mt-3 transition-all duration-150">
          {/* Segitiga penunjuk */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-primary/40 rotate-45" />

          {/* Header tanggal */}
          <p className="font-semibold text-sm text-primary mb-3 text-center">
            {date.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
            })}
          </p>

          {/* Daftar event */}
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
            {events.map((event, i) => (
              <div
                key={i}
                className="p-2 rounded-lg border border-primary/10 bg-primary/5 hover:bg-primary/10 transition-colors duration-150 flex items-start gap-2"
              >
                <CalendarCheck className="w-4 h-4 text-primary shrink-0 mt-[2px]" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-base-content leading-snug">
                    {event.name}
                  </p>

                  {/* Kalau ada waktu event */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

CalendarCell.displayName = "CalendarCell";
