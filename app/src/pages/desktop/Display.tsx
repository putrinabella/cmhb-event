import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Gift,
  Presentation,
  Volume2,
  Image,
  Maximize2,
  Minimize2,
  Trophy,
  Package,
  VolumeX,
} from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCards, getCardDetail, type CardItem } from "@/services/cardAPI";
import { motion } from "framer-motion";
import { GachaMachine } from "@/components/gacha-machine/GachaDrawMachine";
import FloatingBalloons from "@/components/gacha-machine/FloatingBalloons";
import { getEventDetail, type EventItem } from "@/services/eventAPI";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { capitalizeEachWord } from "@/utils/stringUtils";
import { CardWinnerComponent } from "@/components/CardWinnerComponent";
import { handleApiError } from "@/lib/ErrorHandler";

export default function CardPresentationPage() {
  const { eventId, cardId } = useParams<{ eventId: string; cardId: string }>();
  const [card, setCards] = useState<CardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isZoomed, setIsZoomed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [, setEvent] = useState<EventItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [redrawTarget, setRedrawTarget] = useState<{
    index: number;
    participantId: string;
    previousWinnerName?: string;
  } | null>(null);

  const currentCard = card[currentIndex];
  const navigate = useNavigate();
  useEffect(() => {
    if (!eventId || !currentCard) return;

    const currentUrlCardId = cardId;
    if (currentCard.id !== currentUrlCardId) {
      navigate(`/events/${eventId}/card/${currentCard.id}/presentation`, {
        replace: true,
      });
    }
  }, [currentCard, eventId]);
  // Fetch data awal
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

  // Pagination logic
  const paginate = (newIndex: number, dir: "left" | "right") => {
    if (newIndex < 0 || newIndex >= card.length || isAnimating) return;
    setIsAnimating(true);
    setDirection(dir);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setTimeout(() => setIsAnimating(false), 100);
    }, 300);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") paginate(currentIndex - 1, "left");
      else if (e.key === "ArrowRight") paginate(currentIndex + 1, "right");
      else if (e.key === "f" || e.key === "F") setIsZoomed((p) => !p);
      else if (e.key === "Escape") setIsZoomed(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, card.length, isAnimating]);

  // Refresh ulang card setelah undian
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
  // Handler untuk menutup redraw dan refresh data
  const handleFinishRedraw = async () => {
    await refreshCardData();
    setRedrawTarget(null);
  };

  // Helper tampilan
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play size={48} />;
      case "idle":
        return <Image size={48} />;
      case "slideshow":
        return <Presentation size={48} />;
      case "lucky_draw":
        return <Gift size={48} />;
      default:
        return <Presentation size={48} />;
    }
  };

  const getTypeColor = (type: string) => {
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

  const getTypeName = (type: string) => {
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
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Hentikan musik jika card berubah
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const current = card[currentIndex];
    const sound_url = current?.settings?.sound_url;

    if (sound_url && current?.type === "idle") {
      const audio = new Audio(sound_url);
      audio.loop = true;
      audio.volume = isMuted ? 0 : 1;
      audioRef.current = audio;
      audio
        .play()
        .catch(() => console.warn("Autoplay diblokir, tunggu interaksi user."));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentIndex, isMuted]);

  // Render isi card
  const renderContent = () => {
    if (!currentCard) return null;

    switch (currentCard.type) {
      case "video": {
        const url = currentCard.settings.url || currentCard.settings.video_url;

        if (!url) {
          return (
            <div className="w-full h-[90vh] flex justify-center items-center">
              <p className="text-red-500 font-medium">
                Video tidak dapat ditampilkan — URL kosong
              </p>
            </div>
          );
        }

        const isYouTube =
          url.includes("youtube.com") || url.includes("youtu.be");

        const videoIdMatch = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
        const videoId = videoIdMatch ? videoIdMatch[1] : null;
        const embedUrl =
          isYouTube && videoId
            ? `https://www.youtube.com/embed/${videoId}`
            : url;

        return (
          <div className="w-full h-[90vh] flex justify-center items-center">
            {isYouTube && videoId ? (
              // 🎬 YouTube player
              <iframe
                src={embedUrl}
                title="YouTube Video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : url.endsWith(".mp4") ? (
              <video
                controls
                autoPlay
                className="w-full h-full object-contain"
                src={url}
              >
                Browser Anda tidak mendukung tag video.
              </video>
            ) : (
              <p className="text-red-500 font-medium">
                Video tidak dapat ditampilkan — URL tidak valid
              </p>
            )}
          </div>
        );
      }

      case "idle":
        return (
          <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center overflow-hidden bg-black">
            {currentCard.settings.video_url ? (
              <video
                src={currentCard.settings.video_url}
                autoPlay
                loop
                muted={isMuted}
                className="min-w-full min-h-full w-auto h-auto object-cover"
              />
            ) : currentCard.settings.picture_url ? (
              <img
                src={currentCard.settings.picture_url}
                alt="Idle Screen"
                className="min-w-full min-h-full w-auto h-auto object-cover"
              />
            ) : (
              <div className="text-white text-lg">Tidak ada media</div>
            )}
            {currentCard.settings.sound_url && (
              <button
                onClick={() => setIsMuted((p) => !p)}
                className="absolute bottom-6 right-6 bg-white/20 hover:bg-white/40 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 text-white transition"
              >
                {isMuted ? (
                  <>
                    <VolumeX size={18} />
                    <span className="text-sm">Unmute</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={18} />
                    <span className="text-sm">Mute</span>
                  </>
                )}
              </button>
            )}
          </div>
        );

      case "slideshow":
        return (
          <div className="relative w-full h-screen overflow-hidden">
            <iframe
              loading="lazy"
              src={currentCard.settings.slideshow_url}
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full border-0"
            ></iframe>
          </div>
        );

      case "lucky_draw":
        const totalPrize =
          currentCard.settings?.prize_quantity ??
          currentCard.prize_quantity_slot ??
          0;
        const totalWinners = currentCard.winners?.length ?? 0;

        const showDrawMachine =
          totalPrize > 0 && totalWinners < totalPrize && !redrawTarget;
        const showWinners = totalWinners > 0 && !redrawTarget;

        return (
          <div className="relative w-full h-full items-center justify-center gap-2 p-8">
            <div className="items-center justify-center gap-2">
              <div className="absolute inset-0 z-[9999] pointer-events-none">
                <FloatingBalloons />
              </div>
              {/* Mesin Undian */}
              {showDrawMachine && (
                <GachaMachine
                  eventId={eventId!}
                  cardId={cardId!}
                  card={currentCard}
                  spinDuration={1000}
                  onFinishRedraw={refreshCardData}
                />
              )}
              {/* Mode Redraw */}
              {redrawTarget && (
                <GachaMachine
                  eventId={eventId!}
                  cardId={cardId!}
                  card={currentCard}
                  spinDuration={1000}
                  redrawTarget={redrawTarget}
                  onFinishRedraw={handleFinishRedraw}
                />
              )}

              {/* Daftar Pemenang */}
              {showWinners && (
                <div className="">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl shadow-2xl p-8 mb-10 relative ">
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
                      </div>

                      <div className="relative z-10">
                        {/* Title dengan Icon */}
                        <div className="flex items-center justify-center gap-4 mb-6">
                          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                            <Trophy className="w-10 h-10 text-white" />
                          </div>
                          <h1 className="text-4xl md:text-5xl font-bold text-white">
                            Daftar Pemenang
                          </h1>
                        </div>

                        {/* Info Cards dalam satu baris */}
                        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
                          {/* Prize Name */}
                          <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3 min-w-[280px]">
                            <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-xl">
                              <Gift className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left">
                              <p className="text-xs text-gray-500 font-medium mb-1">
                                Hadiah
                              </p>
                              <p className="text-xl font-bold text-gray-800">
                                {capitalizeEachWord(
                                  currentCard.settings?.prize_name || ""
                                ) || "-"}
                              </p>
                            </div>
                          </div>

                          {/* Prize Quantity */}
                          <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3 min-w-[200px]">
                            <div className="bg-gradient-to-br from-secondary to-primary p-3 rounded-xl">
                              <Package className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left">
                              <p className="text-xs text-gray-500 font-medium mb-1">
                                Total Hadiah
                              </p>
                              <p className="text-xl font-bold text-gray-800">
                                {currentCard.settings?.prize_quantity ?? 0} Unit
                              </p>
                            </div>
                          </div>

                          {/* Winners Count */}
                        </div>
                      </div>
                    </div>
                    {currentCard.winners?.length ? (
                      <div
                        className={`grid gap-6 ${
                          currentCard.winners.length === 1
                            ? "grid-cols-1"
                            : currentCard.winners.length === 2
                            ? "grid-cols-2"
                            : currentCard.winners.length === 3
                            ? "grid-cols-3"
                            : currentCard.winners.length === 4
                            ? "grid-cols-4"
                            : "grid-cols-5"
                        } justify-items-center`}
                      >
                        {currentCard.winners.map((winner, i) => (
                          <CardWinnerComponent
                            key={winner.id}
                            id={winner.id}
                            index={i}
                            name={
                              winner.event_participant?.name ??
                              "Tidak diketahui"
                            }
                            division={winner.event_participant?.unit ?? ""}
                            onRedraw={() =>
                              setRedrawTarget({
                                index: i,
                                participantId: winner.event_participant.id,
                                previousWinnerName:
                                  winner.event_participant?.name,
                              })
                            }
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500">
                        Belum ada pemenang.
                      </p>
                    )}
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return <p className="text-gray-500">Tipe tidak dikenali</p>;
    }
  };

  if (loading) return <LoadingIndicator />;
  if (error) return <div className="p-8 text-center text-error">{error}</div>;

  // Fullscreen mode
  if (isZoomed)
    return (
      <div className="fixed inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center z-50 ">
        {/* <div className="w-full h-full items-center justify-center"> */}
        <div className="flex items-center w-full justify-center">
          {renderContent()}
        </div>
        <button
          onClick={() => setIsZoomed(false)}
          className="fixed top-4 right-4 bg-white/10 p-3 rounded-full hover:bg-white/20 transition"
        >
          <Minimize2 className="text-white" size={24} />
        </button>
      </div>
    );

  // Normal mode
  return (
    <div className="relative flex flex-col h-screen bg-gray-50">
      {/* HEADER */}
      <div
        className={`flex-none h-20 bg-gradient-to-r ${getTypeColor(
          currentCard.type
        )} flex items-center justify-between px-6 z-20 text-primary-content`}
      >
        <div className="flex items-center gap-3">
          <div className="tooltip tooltip-right" data-tip="Kembali ke Event">
            <Link
              to={`/events/detail/${eventId}`}
              className="bg-white/20 backdrop-blur-md p-2 rounded-2xl hover:bg-white/30 transition flex items-center justify-center"
            >
              {getTypeIcon(currentCard.type)}
            </Link>
          </div>
          <div>
            <p className="text-xs uppercase opacity-90 font-semibold">
              {getTypeName(currentCard.type)}
            </p>
            <h2 className="text-2xl font-bold">{currentCard.title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/20 px-4 py-2 rounded-full">
            {currentIndex + 1} / {card.length}
          </div>
          <button
            onClick={() => setIsZoomed(true)}
            className="bg-white/20 p-2 rounded-full hover:bg-white/30"
          >
            <Maximize2 size={20} />
          </button>
        </div>
      </div>

      {/* MAIN CONTENT (scrollable) */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div
          key={currentCard?.id}
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
          {renderContent()}
        </div>
      </div>

      {/* FOOTER (fixed di bawah) */}
      <div className="flex-none backdrop-blur-md py-4 px-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => paginate(currentIndex - 1, "left")}
            disabled={currentIndex === 0 || isAnimating}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-full border hover:bg-gray-50 disabled:opacity-40 transition"
          >
            <ArrowLeft size={20} />
            <span>Previous</span>
          </button>

          <div className="flex gap-2">
            {card.map((c, idx) => (
              <button
                key={c.id}
                onClick={() =>
                  paginate(idx, idx > currentIndex ? "right" : "left")
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
            onClick={() => paginate(currentIndex + 1, "right")}
            disabled={currentIndex === card.length - 1 || isAnimating}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-full border hover:bg-gray-50 disabled:opacity-40 transition"
          >
            <span>Next</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
