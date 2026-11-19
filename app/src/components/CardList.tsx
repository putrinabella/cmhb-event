import { Link } from "react-router-dom";
import { Calendar, Users } from "lucide-react";
import { getDateIndonesianFormat } from "@/utils/dateUtils";

interface CardListProps {
  name: string;
  description?: string;
  date: string | Date;
  participant_total?: number;
  isPast?: boolean;
  isToday?: boolean;
  detailPath?: string;
}

export default function CardList({
  name,
  description,
  date,
  participant_total = 0,
  isPast = false,
  isToday = false,
  detailPath,
}: CardListProps) {
  const eventDate = new Date(date);

  const CardContent = (
    <div
      className={`block p-4 rounded-xl border border-base-200 bg-base-100 transition-all duration-200 shadow-sm
        ${
          detailPath
            ? "hover:bg-primary/5 hover:border-primary/50 hover:shadow-md cursor-pointer active:scale-[0.98]"
            : "cursor-default"
        }
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <p className="font-bold text-base-content leading-snug">{name}</p>
        <span
          className={`px-2 py-1 rounded-full text-xs font-bold shrink-0 ${
            isPast
              ? "bg-base-300"
              : isToday
              ? "bg-gradient-to-r from-primary to-secondary"
              : "bg-success/20"
          }`}
        >
          {isPast ? "Selesai" : isToday ? "Hari Ini" : "Akan Datang"}
        </span>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-base-content/70 mb-3 whitespace-pre-line break-words">
          {description}
        </p>
      )}

      {/* Footer info */}
      <div className="flex items-center justify-between text-sm text-base-content/80">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4 text-primary" />
          {getDateIndonesianFormat(eventDate)}
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4 text-secondary" />
          {participant_total}
        </div>
      </div>
    </div>
  );

  return detailPath ? <Link to={detailPath}>{CardContent}</Link> : CardContent;
}
