import { Gift, Sparkles } from "lucide-react";

interface DrawButtonProps {
  text?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function DrawButton({
  text = "Mulai Undian!",
  onClick = () => {},
  disabled = false,
}: DrawButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative bg-gradient-to-r from-primary to-secondary text-primary-content font-black text-2xl md:text-3xl px-12 py-6 rounded-full shadow-2xl transform transition-all flex items-center gap-4 ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:scale-110 animate-bounce"
      }`}
      style={{ animationDuration: "2s" }}
    >
      <Gift className="w-10 h-10" />
      <span>{text}</span>

      {!disabled && (
        <>
          {/* Glow background */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 blur-2xl opacity-60 group-hover:opacity-100 -z-10 animate-pulse"></div>

          {/* Sparkles kanan atas */}
          <div className="absolute -top-3 -right-3 text-4xl animate-bounce">
            <Sparkles className="w-10 h-10" />
          </div>

          {/* Sparkles kiri bawah */}
          <div
            className="absolute -bottom-3 -left-3 text-4xl animate-bounce"
            style={{ animationDelay: "0.5s" }}
          >
            <Sparkles className="w-10 h-10" />
          </div>
        </>
      )}
    </button>
  );
}
