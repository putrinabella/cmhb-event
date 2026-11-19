// useCardPresentation.ts
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCards, getCardDetail, type CardItem } from "@/services/cardAPI";
import { getEventDetail, type EventItem } from "@/services/eventAPI";
import { handleApiError } from "@/lib/ErrorHandler";

// Hook untuk fetch dan manage card data
export const useCardData = (eventId?: string, cardId?: string) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<EventItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId || !cardId) return;

    setLoading(true);

    Promise.all([getEventDetail(eventId), getCards(eventId)])
      .then(async ([eventData, baseCards]) => {
        setEvent(eventData);

        const sorted = baseCards.sort(
          (a, b) => a.position_order - b.position_order
        );

        const detailed = await Promise.all(
          sorted.map(async (c) => {
            try {
              const detail = await getCardDetail(c.id);
              return { ...c, ...detail };
            } catch {
              return c;
            }
          })
        );

        setCards(detailed);

        const foundIndex = detailed.findIndex((c) => c.id === cardId);
        if (foundIndex >= 0) setCurrentIndex(foundIndex);
      })
      .catch(() => setError("Gagal memuat data"))
      .finally(() => setLoading(false));
  }, [eventId, cardId]);

  const refreshCardData = async () => {
    if (!eventId || !cardId) return;
    try {
      const updatedDetail = await getCardDetail(cardId);
      setCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, ...updatedDetail } : c))
      );
    } catch (err) {
      await handleApiError(err, "Terjadi kesalahan dari sistem");
    }
  };

  return {
    cards,
    currentIndex,
    setCurrentIndex,
    loading,
    event,
    error,
    refreshCardData,
  };
};

// Hook untuk pagination logic
export const useCardPagination = (
  totalCards: number,
  onIndexChange?: (index: number) => void
) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const paginate = (newIndex: number, dir: "left" | "right") => {
    if (newIndex < 0 || newIndex >= totalCards || isAnimating) return;

    setIsAnimating(true);
    setDirection(dir);

    setTimeout(() => {
      setCurrentIndex(newIndex);
      onIndexChange?.(newIndex);
      setTimeout(() => setIsAnimating(false), 100);
    }, 300);
  };

  return {
    currentIndex,
    setCurrentIndex,
    isAnimating,
    direction,
    paginate,
  };
};

// Hook untuk keyboard navigation
export const useKeyboardNavigation = (
  currentIndex: number,
  totalCards: number,
  isAnimating: boolean,
  onPaginate: (index: number, direction: "left" | "right") => void,
  onToggleZoom: () => void
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        onPaginate(currentIndex - 1, "left");
      } else if (e.key === "ArrowRight") {
        onPaginate(currentIndex + 1, "right");
      } else if (e.key === "f" || e.key === "F") {
        onToggleZoom();
      } else if (e.key === "Escape") {
        onToggleZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, totalCards, isAnimating, onPaginate, onToggleZoom]);
};

// Hook untuk URL sync
export const useCardUrlSync = (
  eventId?: string,
  cardId?: string,
  currentCard?: CardItem
) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!eventId || !currentCard) return;

    const currentUrlCardId = cardId;
    if (currentCard.id !== currentUrlCardId) {
      navigate(`/events/${eventId}/card/${currentCard.id}/presentation`, {
        replace: true,
      });
    }
  }, [currentCard, eventId, cardId, navigate]);
};

// Hook untuk redraw state management
export const useRedrawState = () => {
  const [redrawTarget, setRedrawTarget] = useState<{
    index: number;
    participantId: string;
    previousWinnerName?: string;
  } | null>(null);

  return {
    redrawTarget,
    setRedrawTarget,
  };
};
