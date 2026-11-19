import { useRef, useState, useEffect } from "react";
import { reorderCard } from "@/services/cardAPI";
import { handleApiError } from "@/lib/ErrorHandler";

interface UseReorderCardsProps<T> {
  eventId: string;
  cards: T[];
  onRefetch: () => void | Promise<void>;
}

export function useReorderCards<
  T extends { id: string; position_order?: number }
>({ eventId, cards, onRefetch }: UseReorderCardsProps<T>) {
  const [localCards, setLocalCards] = useState<T[]>(cards);
  const [isReordering, setIsReordering] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Sync data dari props (API)
  useEffect(() => {
    setLocalCards(cards);
  }, [cards]);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
    setDraggedIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (dragItem.current === null || dragItem.current === index) return;

    dragOverItem.current = index;

    const newCards = [...localCards];
    const draggedCard = newCards[dragItem.current];

    // Pindahkan posisi
    newCards.splice(dragItem.current, 1);
    newCards.splice(index, 0, draggedCard);

    dragItem.current = index;
    setLocalCards(newCards);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (dragItem.current === null) return;

    const updatedCards = localCards.map((card, index) => ({
      ...card,
      position_order: index + 1,
    }));

    setLocalCards(updatedCards);
    setIsReordering(true);

    try {
      const reorderPromises = updatedCards.map((card) => {
        const originalCard = cards.find((c) => c.id === card.id);
        if (
          originalCard &&
          originalCard.position_order !== card.position_order
        ) {
          return reorderCard(eventId, card.id, card.position_order!);
        }
        return Promise.resolve();
      });

      await Promise.all(reorderPromises);
      await onRefetch();

      //   await showSwal({
      //     title: "Berhasil!",
      //     text: "Urutan card berhasil diperbarui.",
      //     icon: "success",
      //     confirmButtonText: "OK",
      //   });
    } catch (err) {
      setLocalCards(cards);
      await handleApiError(
        err,
        "Terjadi kesalahan saat mengubah urutan card. Silakan coba lagi"
      );
    } finally {
      setIsReordering(false);
      setDraggedIndex(null);
      dragItem.current = null;
      dragOverItem.current = null;
    }
  };

  return {
    localCards,
    isReordering,
    draggedIndex,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
  };
}
