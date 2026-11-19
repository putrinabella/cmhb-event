import { getDateIndonesianFormat } from "@/utils/dateUtils";
import {
  Eye,
  Pencil,
  Trash2,
  Settings,
  NotepadText,
  CalendarDays,
  User,
  Clock,
  Briefcase,
  RefreshCcw,
  Gift,
  Award,
  GripVertical,
  Link2,
} from "lucide-react";
import { Link } from "react-router-dom";

interface CardComponentProps {
  id: string;
  index?: number;
  info?: string;
  title?: string;
  description?: string;
  event_date?: string;
  created_by?: string;
  created_at?: string;
  type?: string;
  division?: string;
  gift?: string;
  quantity?: number;
  participant?: number;
  name?: string;
  link?: string;
  detailPath?: string;
  editPath?: string;
  onDelete?: (id: string) => void;
  onRedraw?: (id: string) => void;
  isDraggable?: boolean;
}

export function CardComponent({
  id,
  index,
  info,
  title,
  description,
  event_date,
  created_by,
  created_at,
  division,
  gift,
  quantity,
  type,
  participant,
  name,
  link,
  detailPath,
  editPath,
  onDelete,
  onRedraw,
  isDraggable = false,
}: CardComponentProps) {
  return (
    <div className="group relative  w-full bg-gradient-to-t from-white to-pink-50 border-2 border-pink-100 rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:border-pink-300 flex flex-col justify-between h-full">
      {/* Drag Handle - hanya muncul jika isDraggable true */}
      {isDraggable && (
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10">
          <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg shadow-lg">
            <GripVertical size={20} className="text-white" />
          </div>
        </div>
      )}

      {/* Index / Info Badge */}
      {(info || index !== undefined) && (
        <div className="absolute -left-3 -top-3 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content font-bold shadow-lg grid place-items-center text-center leading-none text-sm z-20">
          {info ?? (index !== undefined ? index + 1 : null)}
        </div>
      )}

      {/* Konten Utama */}
      <div className="flex-1 ml-4">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <div className="flex flex-col gap-4 text-base">
          {description && (
            <div className="flex items-start gap-2 text-base">
              <div className="bg-pink-100 p-2 rounded-lg mt-[2px] shrink-0">
                <NotepadText size={18} className="text-pink-600" />
              </div>
              <div>
                <p className="text-base break-words leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          )}

          {event_date && (
            <div className="flex items-center gap-2 text-base">
              <div className="bg-pink-100 p-2 rounded-lg shrink-0">
                <CalendarDays size={18} className="text-pink-600" />
              </div>
              <div>
                <p>{getDateIndonesianFormat(event_date)}</p>
              </div>
            </div>
          )}

          {name && (
            <div className="flex items-center gap-2 text-base">
              <div className="bg-pink-100 p-2 rounded-lg shrink-0">
                <User size={18} className="text-pink-600" />
              </div>
              <div>
                <p>{name}</p>
              </div>
            </div>
          )}

          {created_by && (
            <div className="flex items-center gap-2 text-base">
              <div className="bg-pink-100 p-2 rounded-lg shrink-0">
                <User size={18} className="text-pink-600" />
              </div>
              <div>
                <p>{created_by}</p>
              </div>
            </div>
          )}

          {created_at && (
            <div className="flex items-center gap-2 text-base">
              <div className="bg-pink-100 p-2 rounded-lg shrink-0">
                <Clock size={18} className="text-pink-600" />
              </div>
              <div>
                <p>{created_at}</p>
              </div>
            </div>
          )}

          {type && (
            <div className="flex items-center gap-2 text-base">
              <div className="bg-pink-100 p-2 rounded-lg shrink-0">
                <Settings size={18} className="text-pink-600" />
              </div>
              <div>
                <p>{type}</p>
              </div>
            </div>
          )}

          {division && (
            <div className="flex items-center gap-2 text-base">
              <div className="bg-pink-100 p-2 rounded-lg shrink-0">
                <Briefcase size={18} className="text-pink-600" />
              </div>
              <div>
                <p>{division}</p>
              </div>
            </div>
          )}

          {gift && (
            <div className="flex items-center gap-2 text-base">
              <div className="bg-pink-100 p-2 rounded-lg shrink-0">
                <Gift size={18} className="text-pink-600" />
              </div>
              <div>
                <p>{gift}</p>
              </div>
            </div>
          )}

          {quantity && (
            <div className="flex items-center gap-2 text-base">
              <div className="bg-pink-100 p-2 rounded-lg shrink-0">
                <Award size={18} className="text-pink-600" />
              </div>
              <div>
                <p>
                  {quantity} {" Pemenang"}
                </p>
              </div>
            </div>
          )}
          {link && (
            <div className="flex items-center gap-2 text-base">
              <div className="bg-pink-100 p-2 rounded-lg shrink-0">
                <Link2 size={18} className="text-pink-600" />
              </div>
              <div>
                <p>{link}</p>
              </div>
            </div>
          )}

          {participant !== undefined && (
            <div className="flex items-center gap-2 text-base">
              <div className="bg-pink-100 p-2 rounded-lg shrink-0">
                <User size={18} className="text-pink-600" />
              </div>
              <div>
                <p>
                  {participant > 0
                    ? `${participant} Orang`
                    : "Belum ada partisipan"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tombol Aksi (selalu di bawah) */}
      {(detailPath || editPath || onDelete || onRedraw) && (
        <div className="flex gap-2 pt-2 border-t border-pink-200 mt-4">
          {detailPath && (
            <Link
              to={detailPath}
              className="flex-1 bg-blue-100 hover:bg-blue-200 py-2 px-2 rounded-lg flex items-center justify-center gap-1 transition-all hover:scale-105"
            >
              <Eye size={15} />
            </Link>
          )}

          {editPath && (
            <Link
              to={editPath}
              className="flex-1 bg-amber-100 hover:bg-amber-200 py-2 px-2 rounded-lg flex items-center justify-center gap-1 transition-all hover:scale-105"
            >
              <Pencil size={15} />
            </Link>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="flex-1 bg-red-200 hover:bg-red-300 py-2 px-2 rounded-lg flex items-center justify-center gap-1 transition-all hover:scale-105"
            >
              <Trash2 size={15} />
            </button>
          )}

          {onRedraw && (
            <button
              onClick={() => onRedraw(id)}
              className="flex-1 bg-gradient-to-br from-primary/80 to-secondary/80 text-primary-content py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:brightness-110 hover:scale-[1.03] shadow-md active:scale-95"
            >
              <RefreshCcw size={16} className="animate-spin-slow" />
              <span className="font-medium">Redraw</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
