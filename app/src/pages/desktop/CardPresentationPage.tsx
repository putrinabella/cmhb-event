import { useState } from "react";
import { useParams } from "react-router-dom";
import { LoadingIndicator } from "@/components/LoadingIndicator";

import {
  useCardData,
  useCardPagination,
  useKeyboardNavigation,
  useCardUrlSync,
  useRedrawState,
} from "@/hooks/use-card-presentation";

import {
  CardPresentationHeader,
  CardNavigationFooter,
  FullscreenMode,
  CardContentWrapper,
} from "@/components/CardPresentationComponents";

import { CardContentRenderer } from "@/components/CardContentRenderer";
export default function CardPresentationPage() {
  const { eventId, cardId } = useParams<{ eventId: string; cardId: string }>();
  const [isZoomed, setIsZoomed] = useState(false);

  const {
    cards,
    setCurrentIndex: setDataIndex,
    loading,
    error,
    refreshCardData,
  } = useCardData(eventId, cardId);

  const { currentIndex, isAnimating, direction, paginate } = useCardPagination(
    cards.length,
    setDataIndex
  );

  const { redrawTarget, setRedrawTarget } = useRedrawState();

  const currentCard = cards[currentIndex];

  // Sync URL dengan current card
  useCardUrlSync(eventId, cardId, currentCard);

  // Keyboard navigation
  useKeyboardNavigation(currentIndex, cards.length, isAnimating, paginate, () =>
    setIsZoomed((prev) => !prev)
  );

  // Loading & Error states
  if (loading) return <LoadingIndicator />;
  if (error) return <div className="p-8 text-center text-error">{error}</div>;
  if (!currentCard)
    return <div className="p-8 text-center">Card tidak ditemukan</div>;

  // Fullscreen mode
  if (isZoomed) {
    return (
      <FullscreenMode onClose={() => setIsZoomed(false)}>
        <CardContentRenderer
          card={currentCard}
          eventId={eventId!}
          cardId={cardId!}
          redrawTarget={redrawTarget}
          onSetRedrawTarget={setRedrawTarget}
          onRefreshCard={refreshCardData}
        />
      </FullscreenMode>
    );
  }

  // Normal mode
  return (
    <div className="relative flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <CardPresentationHeader
        card={currentCard}
        eventId={eventId!}
        currentIndex={currentIndex}
        totalCards={cards.length}
        onToggleZoom={() => setIsZoomed(true)}
      />

      {/* Main Content (scrollable) */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <CardContentWrapper
          cardId={currentCard.id}
          isAnimating={isAnimating}
          direction={direction}
        >
          <CardContentRenderer
            card={currentCard}
            eventId={eventId!}
            cardId={cardId!}
            redrawTarget={redrawTarget}
            onSetRedrawTarget={setRedrawTarget}
            onRefreshCard={refreshCardData}
          />
        </CardContentWrapper>
      </div>

      {/* Footer Navigation */}
      <CardNavigationFooter
        cards={cards}
        currentIndex={currentIndex}
        isAnimating={isAnimating}
        onPaginate={paginate}
      />
    </div>
  );
}
