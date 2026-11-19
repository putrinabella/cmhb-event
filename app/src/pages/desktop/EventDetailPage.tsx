import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  BadgeQuestionMark,
  Calendar,
  CalendarDays,
  List,
  ListOrdered,
  Plus,
  Projector,
  User,
} from "lucide-react";
import { usePageHeader } from "@/context/PageHeaderContext";
import { getEventDetail, type EventItem } from "@/services/eventAPI";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { getDateIndonesianFormat, getEventStatus } from "@/utils/dateUtils";
import { useCards } from "@/hooks/use-card";
import { CardComponent } from "@/components/CardComponent";
import { capitalizeEachWord } from "@/utils/stringUtils";
import { useDeleteCard } from "@/hooks/use-card-delete";
import { useParticipants } from "@/hooks/use-participants";
import { useDeleteParticipant } from "@/hooks/use-participant-delete";
import Pagination from "@/components/Pagination";
import ImportParticipantModal from "@/components/ImportParticipantButton";
import { GradientButton } from "@/components/GradientButton";
import { useReorderCards } from "@/hooks/use-reorder-cards";
import { useWinners } from "@/hooks/use-winners";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { setHeader } = usePageHeader();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    data: eventCards,
    loading: loadingCards,
    error: errorCards,
    refetch,
  } = useCards(id!);

  const {
    localCards,
    isReordering,
    draggedIndex,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
  } = useReorderCards({
    eventId: event?.id!,
    cards: eventCards,
    onRefetch: refetch,
  });
  const [showAll, setShowAll] = useState(false);

  const {
    data: participants,
    loading: loadingParticipants,
    error: errorParticipants,
    total: totalParticipants,
    page,
    setPage,
    lastPage,
    refetch: refetchParticipants,
  } = useParticipants(id!, 1, undefined, showAll);

  const eventDate = useMemo(
    () => getDateIndonesianFormat(event?.event_date),
    [event?.event_date]
  );

  const eventStatus = useMemo(
    () => (event?.event_date ? getEventStatus(event.event_date) : null),
    [event?.event_date]
  );

  useEffect(() => {
    setLoading(true);
    getEventDetail(id!)
      .then((data) => setEvent(data))
      .catch(() => setError("Gagal memuat data event"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!event) return;

    setHeader({
      breadcrumb: [
        { label: "Dashboard", path: "/" },
        { label: "Event", path: "/events" },
        { label: "Detail Event", path: "" },
      ],
      icon: CalendarDays,
      title: event.name ? capitalizeEachWord(event.name) : "Detail Event",
      description: "Informasi lengkap tentang event",
      actionLink:
        eventCards && eventCards.length > 0
          ? `/events/${event.id}/card/${eventCards[0].id}/presentation`
          : undefined,
      actionLabel: eventCards && eventCards.length > 0 ? "Present" : undefined,
      actionIcon: eventCards && eventCards.length > 0 ? Projector : undefined,
      stats: [
        { label: "Deskripsi", value: `${event.description}` },
        { label: "Tanggal", value: `${eventDate}` },
        { label: "Status", value: `${eventStatus?.statusLabel}` },
      ],
    });
  }, [setHeader, event, eventCards, eventDate, eventStatus]);

  const { handleDelete } = useDeleteCard(async () => {
    await refetch();
  });

  const { handleDeleteParticipant } = useDeleteParticipant(async () => {
    await refetchParticipants();
  });

  const [showAllWinners, setShowAllWinners] = useState(false);

  const {
    data: winners,
    loading: loadingWinners,
    error: errorWinners,
    total: totalWinners,
    page: winnersPage,
    setPage: setWinnersPage,
    lastPage: winnersLastPage,
  } = useWinners(id!, 1, undefined, showAllWinners);

  if (loading) return <LoadingIndicator />;

  if (error || !event)
    return (
      <div className="p-8 text-center text-error">
        {error || "Event tidak ditemukan"}
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      {/* Card Event */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Event Cards</h2>
            <p className="text-gray-500 mt-1">
              {localCards.length === 0
                ? "Belum ada card untuk event ini."
                : `${localCards.length} susunan acara`}
            </p>
          </div>
          <Link to={`/events/${id}/card/create`}>
            <GradientButton icon={<Plus size={20} />} label="Tambah Card" />
          </Link>
        </div>

        {/* Loading Reorder Indicator */}
        {isReordering && (
          <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span>Menyimpan perubahan urutan...</span>
          </div>
        )}

        {loadingCards ? (
          <LoadingIndicator />
        ) : errorCards ? (
          <div className="text-error">Gagal memuat card event</div>
        ) : localCards.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl">
            <div className="text-pink-300 mb-4">
              <Calendar size={64} className="mx-auto" />
            </div>
            <p className="text-gray-500 italic">
              Belum ada card untuk event ini.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-5 gap-6">
              {localCards.map((card, index) => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  className={`transition-all duration-200 ${
                    draggedIndex === index ? "opacity-50 scale-95 rotate-2" : ""
                  }`}
                  style={{ cursor: "grab" }}
                >
                  <CardComponent
                    id={card.id}
                    index={index}
                    title={card.title}
                    type={capitalizeEachWord(card.type)}
                    gift={capitalizeEachWord(card.settings?.prize_name || "")}
                    quantity={card.settings?.prize_quantity}
                    detailPath={`/events/${event.id}/card/detail/${card.id}`}
                    editPath={`/events/${event.id}/card/edit/${card.id}`}
                    onDelete={() => handleDelete(card.id, event.id)}
                    isDraggable={true}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Participant */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Peserta</h2>
            <p className="text-gray-500 mt-1">
              {participants.length === 0
                ? "Belum ada peserta untuk event ini."
                : `${participants.length} peserta`}
            </p>
          </div>
          <div className="flex flex-row gap-4">
            <ImportParticipantModal
              eventId={id!}
              onSuccess={() => refetchParticipants()}
            />
            <Link to={`/events/${id}/participant/create`}>
              <GradientButton
                icon={<Plus size={20} />}
                label="   Tambah Peserta"
              />
            </Link>
            <GradientButton
              icon={showAll ? <ListOrdered size={18} /> : <List size={18} />}
              label={showAll ? "Gunakan Pagination" : "Tampilkan Semua"}
              onClick={() => setShowAll(!showAll)}
            />
          </div>
        </div>

        {loadingParticipants ? (
          <LoadingIndicator />
        ) : errorParticipants ? (
          <div className="text-error">Gagal memuat data peserta</div>
        ) : participants.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl">
            <div className="text-pink-300 mb-4">
              <User size={64} className="mx-auto" />
            </div>
            <p className="text-gray-500 italic">
              Belum ada peserta untuk event ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-5 gap-6">
            {participants.map((participant, i) => (
              <CardComponent
                key={participant.id}
                id={participant.id}
                index={i}
                name={participant.name}
                division={participant.unit}
                // detailPath={`/events/${event.id}/participant/detail/${participant.id}`}
                editPath={`/events/${event.id}/participant/edit/${participant.id}`}
                onDelete={() =>
                  handleDeleteParticipant(participant.id, event.id)
                }
              />
            ))}
          </div>
        )}
        {!showAll && lastPage > 1 && (
          <div className="border-t border-base-200 bg-base-50 mt-6">
            <Pagination
              page={page}
              lastPage={lastPage}
              onPageChange={(newPage) => setPage(newPage)}
              total={totalParticipants}
            />
          </div>
        )}
      </div>

      {/* Winners */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pemenang</h2>
            <p className="text-gray-500 mt-1">
              {winners.length === 0
                ? "Belum ada pemenang untuk event ini."
                : `${winners.length} pemenang`}
            </p>
          </div>
          <GradientButton
            icon={
              showAllWinners ? <ListOrdered size={18} /> : <List size={18} />
            }
            label={showAllWinners ? "Gunakan Pagination" : "Tampilkan Semua"}
            onClick={() => setShowAllWinners(!showAllWinners)}
          />
        </div>

        {loadingWinners ? (
          <LoadingIndicator />
        ) : errorWinners ? (
          <div className="text-error">Gagal memuat data pemenang</div>
        ) : winners.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl">
            <div className="text-pink-300 mb-4">
              <BadgeQuestionMark size={64} className="mx-auto" />
            </div>
            <p className="text-gray-500 italic">
              Belum ada pemenang untuk event ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-5 gap-6">
            {winners.map((winner, i) => (
              <CardComponent
                key={winner.id}
                id={winner.id}
                index={i}
                title={winner.event_participant?.name ?? "Tidak diketahui"}
                division={winner.event_participant?.unit ?? ""}
                gift={winner.prize_name}
              />
            ))}
          </div>
        )}

        {!showAllWinners && winnersLastPage > 1 && (
          <div className="border-t border-base-200 bg-base-50 mt-6">
            <Pagination
              page={winnersPage}
              lastPage={winnersLastPage}
              onPageChange={(newPage) => setWinnersPage(newPage)}
              total={totalWinners}
            />
          </div>
        )}
      </div>
    </div>
  );
}
