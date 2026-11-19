import { memo } from "react";
import { Calendar, Users } from "lucide-react";
import type { EventItem } from "@/services/eventAPI";
import { getDateIndonesianFormat } from "@/utils/dateUtils";

interface Props {
  event: EventItem;
  isToday: boolean;
  daysUntil: number;
}

export const UpcomingEventCard = memo(
  ({ event, isToday, daysUntil }: Props) => {
    const eventDate = new Date(event.event_date);

    return (
      <div
        className={`p-4 rounded-xl border-l-4 ${
          isToday
            ? "bg-gradient-to-r from-primary/10 to-secondary/10 border-primary"
            : "bg-base-200 border-secondary"
        } hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer`}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-base-content">{event.name}</h3>
          {isToday && (
            <span className="text-xs bg-gradient-to-r from-primary to-secondary text-primary-content px-2 py-1 rounded-full font-bold">
              Hari Ini
            </span>
          )}
        </div>
        <p className="text-sm text-base-content/70 mb-3 line-clamp-1">
          {event.description}
        </p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-base-content/70">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{getDateIndonesianFormat(eventDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-base-content/70">
            <Users className="w-4 h-4 text-secondary" />
            <span className="font-semibold">
              {event.participant_total || 0}
            </span>
          </div>
        </div>
        {!isToday && (
          <div className="mt-2 text-xs font-semibold text-primary">
            {daysUntil} hari lagi
          </div>
        )}
      </div>
    );
  }
);

UpcomingEventCard.displayName = "UpcomingEventCard";
