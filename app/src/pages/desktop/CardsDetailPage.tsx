import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Gift,
  Loader,
  PartyPopper,
  Play,
  Presentation,
  type LucideIcon,
} from "lucide-react";
import { usePageHeader } from "@/context/PageHeaderContext";
import { getEventDetail, type EventItem } from "@/services/eventAPI";
import { getCardDetail, type CardItem } from "@/services/cardAPI";
import { capitalizeEachWord } from "@/utils/stringUtils";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { showSwal } from "@/lib/SwalHelper";
import { CardContentRenderer } from "@/components/CardContentRenderer";

export default function EventCardDetailPage() {
  const { eventId, cardId } = useParams<{ eventId: string; cardId: string }>();
  const { setHeader } = usePageHeader();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [card, setCard] = useState<CardItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redrawTarget, setRedrawTarget] = useState<{
    index: number;
    participantId: string;
    previousWinnerName?: string;
  } | null>(null);

  // Fungsi refresh data card
  const refreshCardData = async () => {
    if (!cardId) return;
    try {
      const cardData = await getCardDetail(cardId);
      setCard(cardData);
    } catch {
      await showSwal({
        title: "Gagal!",
        text: "Terjadi kesalahan saat memuat ulang data.",
        icon: "error",
      });
    }
  };

  // Ambil data event dan card
  useEffect(() => {
    if (!eventId || !cardId) return;
    setLoading(true);
    Promise.all([getEventDetail(eventId), getCardDetail(cardId)])
      .then(([eventData, cardData]) => {
        setEvent(eventData);
        setCard(cardData);
      })
      .catch(() => setError("Gagal memuat data"))
      .finally(() => setLoading(false));
  }, [eventId, cardId]);

  // Set header dinamis
  useEffect(() => {
    if (!event || !card) return;

    let cardIcon: LucideIcon;

    switch (card.type) {
      case "lucky_draw":
        cardIcon = Gift;
        break;
      case "video":
        cardIcon = Play;
        break;
      case "idle":
        cardIcon = Loader;
        break;
      case "slideshow":
        cardIcon = Presentation;
        break;
      default:
        cardIcon = PartyPopper;
        break;
    }

    const stats =
      card.type === "lucky_draw"
        ? [
            {
              label: "Hadiah",
              value: capitalizeEachWord(card.settings?.prize_name || "") || "-",
            },
            {
              label: "Total Hadiah",
              value: `${card.settings?.prize_quantity ?? 0}`,
            },
            {
              label: "Kuota Hadiah",
              value: `${card.prize_quantity_slot ?? 0}`,
            },
          ]
        : [];

    setHeader({
      breadcrumb: [
        { label: "Dashboard", path: "/" },
        { label: "Event", path: "/events" },
        { label: event.name, path: `/events/detail/${eventId}` },
        { label: card.title, path: "" },
      ],
      icon: cardIcon,
      title: capitalizeEachWord(card.title),
      description: capitalizeEachWord(card.type),
      stats,
    });
  }, [event, card, setHeader, eventId]);

  if (loading) return <LoadingIndicator />;
  if (error) return <div className="p-8 text-center text-error">{error}</div>;
  if (!event || !card)
    return (
      <div className="p-8 text-center text-error">Data tidak ditemukan.</div>
    );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 relative">
      <CardContentRenderer
        card={card}
        eventId={eventId!}
        cardId={cardId!}
        redrawTarget={redrawTarget}
        onSetRedrawTarget={setRedrawTarget}
        onRefreshCard={refreshCardData}
      />
    </div>
  );
}
