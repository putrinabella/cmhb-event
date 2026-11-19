// CardPresentationComponents.tsx
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Gift,
  Presentation,
  Maximize2,
  Minimize2,
  Loader,
} from "lucide-react";
import type { CardItem } from "@/services/cardAPI";

// Card Type Utilities
export const getTypeIcon = (type: string) => {
  switch (type) {
    case "video":
      return <Play size={48} />;
    case "idle":
      return <Loader size={48} />;
    case "slideshow":
      return <Presentation size={48} />;
    case "lucky_draw":
      return <Gift size={48} />;
    default:
      return <Presentation size={48} />;
  }
};

export const getTypeColor = (type: string) => {
  switch (type) {
    case "video":
      return "from-primary via-primary/80 to-secondary/70";
    case "idle":
      return "from-primary/60 via-primary/40 to-secondary/40";
    case "slideshow":
      return "from-primary/70 via-secondary/80 to-primary/60";
    case "lucky_draw":
      return "from-secondary via-primary to-secondary/90";
    default:
      return "from-base-300 via-base-200 to-base-100";
  }
};

export const getTypeName = (type: string) => {
  switch (type) {
    case "video":
      return "Video";
    case "idle":
      return "Idle Screen";
    case "slideshow":
      return "Slideshow";
    case "lucky_draw":
      return "Lucky Draw";
    default:
      return "Unknown";
  }
};

// Card Presentation Header Component
interface CardPresentationHeaderProps {
  card: CardItem;
  eventId: string;
  currentIndex: number;
  totalCards: number;
  onToggleZoom: () => void;
}

export const CardPresentationHeader = ({
  card,
  eventId,
  currentIndex,
  totalCards,
  onToggleZoom,
}: CardPresentationHeaderProps) => {
  return (
    <div
      className={`flex-none h-20 bg-gradient-to-r ${getTypeColor(
        card.type
      )} flex items-center justify-between px-6 z-20 text-primary-content`}
    >
      <div className="flex items-center gap-3">
        <div className="tooltip tooltip-right" data-tip="Kembali ke Event">
          <Link
            to={`/events/detail/${eventId}`}
            className="bg-white/20 backdrop-blur-md p-2 rounded-2xl hover:bg-white/30 transition flex items-center justify-center"
          >
            {getTypeIcon(card.type)}
          </Link>
        </div>
        <div>
          <p className="text-xs uppercase opacity-90 font-semibold">
            {getTypeName(card.type)}
          </p>
          <h2 className="text-2xl font-bold">{card.title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-white/20 px-4 py-2 rounded-full">
          {currentIndex + 1} / {totalCards}
        </div>
        <button
          onClick={onToggleZoom}
          className="bg-white/20 p-2 rounded-full hover:bg-white/30"
        >
          <Maximize2 size={20} />
        </button>
      </div>
    </div>
  );
};

// Card Navigation Footer Component
interface CardNavigationFooterProps {
  cards: CardItem[];
  currentIndex: number;
  isAnimating: boolean;
  onPaginate: (newIndex: number, direction: "left" | "right") => void;
}

export const CardNavigationFooter = ({
  cards,
  currentIndex,
  isAnimating,
  onPaginate,
}: CardNavigationFooterProps) => {
  return (
    <div className="flex-none backdrop-blur-md py-4 px-6">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => onPaginate(currentIndex - 1, "left")}
          disabled={currentIndex === 0 || isAnimating}
          className="flex items-center gap-2 px-6 py-3 bg-white rounded-full border hover:bg-gray-50 disabled:opacity-40 transition"
        >
          <ArrowLeft size={20} />
          <span>Previous</span>
        </button>

        <div className="flex gap-2">
          {cards.map((c, idx) => (
            <button
              key={c.id}
              onClick={() =>
                onPaginate(idx, idx > currentIndex ? "right" : "left")
              }
              className={`rounded-full transition-all ${
                idx === currentIndex
                  ? "bg-gray-800 w-10 h-3"
                  : "bg-gray-300 hover:bg-gray-400 w-3 h-3"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => onPaginate(currentIndex + 1, "right")}
          disabled={currentIndex === cards.length - 1 || isAnimating}
          className="flex items-center gap-2 px-6 py-3 bg-white rounded-full border hover:bg-gray-50 disabled:opacity-40 transition"
        >
          <span>Next</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

// Fullscreen Mode Component
interface FullscreenModeProps {
  children: React.ReactNode;
  onClose: () => void;
}

export const FullscreenMode = ({ children, onClose }: FullscreenModeProps) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 z-50 overflow-y-auto">
      {/* Konten scrollable */}
      <div className="h-screen flex flex-col items-center justify-start py-8 px-4">
        {children}
      </div>

      {/* Tombol close tetap fixed di pojok */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 bg-white/10 p-3 rounded-full hover:bg-white/20 transition"
      >
        <Minimize2 className="text-white" size={24} />
      </button>
    </div>
  );
};

// Card Content Wrapper Component
interface CardContentWrapperProps {
  children: React.ReactNode;
  cardId: string;
  isAnimating: boolean;
  direction: "left" | "right";
}

export const CardContentWrapper = ({
  children,
  cardId,
  isAnimating,
  direction,
}: CardContentWrapperProps) => {
  return (
    <div
      key={cardId}
      className="w-full transition-all duration-500 ease-out flex flex-col items-center justify-center"
      style={{
        transform: isAnimating
          ? `translateX(${
              direction === "left" ? "100px" : "-100px"
            }) scale(0.95)`
          : "translateX(0) scale(1)",
        opacity: isAnimating ? 0 : 1,
      }}
    >
      {children}
    </div>
  );
};
