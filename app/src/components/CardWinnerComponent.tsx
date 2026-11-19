import { RefreshCcw, User, Briefcase } from "lucide-react";

interface CardWinnerProps {
  id: string;
  index?: number;
  name: string;
  division?: string;
  onRedraw: (id: string) => void;
}

export function CardWinnerComponent({
  id,
  index,
  name,
  division,
  onRedraw,
}: CardWinnerProps) {
  return (
    <div className="group relative w-full bg-gradient-to-br from-white via-pink-50 to-purple-50 border-2 border-pink-200 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 hover:border-pink-400 hover:-translate-y-2 flex flex-col justify-between min-h-[280px]">
      {/* Badge Index - Lebih Besar */}
      {index !== undefined && (
        <div className="absolute -left-4 -top-4 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content font-bold shadow-2xl grid place-items-center text-center leading-none text-xl border-4 border-white">
          {index + 1}
        </div>
      )}

      {/* Icon Trophy di pojok kanan */}
      {/* <div className="absolute -right-2 -top-2 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 grid place-items-center shadow-lg opacity-90 group-hover:opacity-100 transition-opacity">
        <Award className="w-6 h-6 text-primary-content" />
      </div> */}

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col items-start justify-center gap-6 mt-4">
        {/* Nama Pemenang */}
        <div className="w-full">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-xl shrink-0 shadow-md">
              <User size={24} className="text-primary-content" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 font-medium mb-1">Pemenang</p>
              <p className="text-2xl font-bold text-gray-800 break-words leading-tight">
                {name}
              </p>
            </div>
          </div>
        </div>

        {/* Divisi/Unit */}
        {division && (
          <div className="w-full">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-secondary to-primary p-3 rounded-xl shrink-0 shadow-md">
                <Briefcase size={24} className="text-primary-content" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium mb-1">Unit</p>
                <p className="text-xl font-semibold text-gray-700 break-words">
                  {division}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tombol Redraw */}
      <div className="pt-6 border-t-2 border-pink-200 mt-6">
        <button
          onClick={() => onRedraw(id)}
          className="w-full bg-gradient-to-r from-primary  to-secondary text-primary-content py-4 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-xl hover:scale-105 shadow-lg active:scale-95 font-semibold text-lg group-hover:from-secondary group-hover:to-primary"
        >
          <RefreshCcw
            size={20}
            className="group-hover:rotate-180 transition-transform duration-500"
          />
          <span>Redraw Pemenang</span>
        </button>
      </div>
    </div>
  );
}
