// CardContentRenderer.tsx
import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import type { CardItem } from "@/services/cardAPI";
import { GachaMachine } from "@/components/gacha-machine/GachaDrawMachine";
import FloatingBalloons from "@/components/gacha-machine/FloatingBalloons";
import { capitalizeEachWord } from "@/utils/stringUtils";
import { CardWinnerComponent } from "@/components/CardWinnerComponent";
import { motion } from "framer-motion";
import { Gift, Package, Trophy } from "lucide-react";

interface CardContentRendererProps {
  card: CardItem;
  eventId: string;
  cardId: string;
  redrawTarget: {
    index: number;
    participantId: string;
    previousWinnerName?: string;
  } | null;
  onSetRedrawTarget: (
    target: {
      index: number;
      participantId: string;
      previousWinnerName?: string;
    } | null
  ) => void;
  onRefreshCard: () => Promise<void>;
}

export const CardContentRenderer = ({
  card,
  eventId,
  cardId,
  redrawTarget,
  onSetRedrawTarget,
  onRefreshCard,
}: CardContentRendererProps) => {
  switch (card.type) {
    case "video":
      return <VideoContent card={card} />;
    case "idle":
      return <IdleContent card={card} />;
    case "slideshow":
      return <SlideshowContent card={card} />;
    case "lucky_draw":
      return (
        <LuckyDrawContent
          card={card}
          eventId={eventId}
          cardId={cardId}
          redrawTarget={redrawTarget}
          onSetRedrawTarget={onSetRedrawTarget}
          onRefreshCard={onRefreshCard}
        />
      );
    default:
      return <p className="text-gray-500">Tipe tidak dikenali</p>;
  }
};

// Video Content Component
const VideoContent = ({ card }: { card: CardItem }) => {
  const url = card.settings.url || card.settings.video_url;

  if (!url) {
    return (
      <div className="w-full h-[90vh] flex justify-center items-center">
        <p className="text-red-500 font-medium">
          Video tidak dapat ditampilkan — URL kosong
        </p>
      </div>
    );
  }

  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
  const videoIdMatch = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
  const videoId = videoIdMatch ? videoIdMatch[1] : null;
  const embedUrl =
    isYouTube && videoId ? `https://www.youtube.com/embed/${videoId}` : url;

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      {isYouTube && videoId ? (
        <iframe
          src={embedUrl}
          title="YouTube Video"
          className="absolute inset-0 w-full h-full object-cover"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : url.endsWith(".mp4") ? (
        <video
          controls
          autoPlay
          className="absolute inset-0 w-full h-full object-cover"
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
};

// Idle Content Component
const IdleContent = ({ card }: { card: CardItem }) => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const sound_url = card?.settings?.sound_url;

    if (sound_url) {
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
  }, [card, isMuted]);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      {card.settings.video_url ? (
        <video
          src={card.settings.video_url}
          autoPlay
          loop
          muted={isMuted}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : card.settings.picture_url ? (
        <img
          src={card.settings.picture_url}
          alt="Idle Screen"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="text-white text-lg">Tidak ada media</div>
      )}

      {card.settings.sound_url && (
        <button
          onClick={() => setIsMuted((p) => !p)}
          className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 transition"
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
};

// Slideshow Content Component
const SlideshowContent = ({ card }: { card: CardItem }) => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <iframe
        loading="lazy"
        src={card.settings.slideshow_url}
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full border-0"
      />
    </div>
  );
};

// Lucky Draw Content Component
interface LuckyDrawContentProps {
  card: CardItem;
  eventId: string;
  cardId: string;
  redrawTarget: {
    index: number;
    participantId: string;
    previousWinnerName?: string;
  } | null;
  onSetRedrawTarget: (
    target: {
      index: number;
      participantId: string;
      previousWinnerName?: string;
    } | null
  ) => void;
  onRefreshCard: () => Promise<void>;
}

const LuckyDrawContent = ({
  card,
  eventId,
  cardId,
  redrawTarget,
  onSetRedrawTarget,
  onRefreshCard,
}: LuckyDrawContentProps) => {
  const totalPrize =
    card.settings?.prize_quantity ?? card.prize_quantity_slot ?? 0;
  const totalWinners = card.winners?.length ?? 0;

  const showDrawMachine =
    totalPrize > 0 && totalWinners < totalPrize && !redrawTarget;
  const showWinners = totalWinners > 0 && !redrawTarget;

  const handleFinishRedraw = async () => {
    await onRefreshCard();
    onSetRedrawTarget(null);
  };

  return (
    <div className="relative w-full h-full items-center justify-center gap-2 p-8">
      <div className="items-center justify-center gap-2">
        <div className="absolute inset-0 z-[9999] pointer-events-none">
          <FloatingBalloons />
        </div>

        {/* Mesin Undian */}
        {showDrawMachine && (
          <GachaMachine
            eventId={eventId}
            cardId={cardId}
            card={card}
            onFinishRedraw={onRefreshCard}
          />
        )}

        {/* Mode Redraw */}
        {redrawTarget && (
          <GachaMachine
            eventId={eventId}
            cardId={cardId}
            card={card}
            redrawTarget={redrawTarget}
            onFinishRedraw={handleFinishRedraw}
          />
        )}

        {/* Daftar Pemenang */}
        {showWinners && (
          <WinnersList card={card} onSetRedrawTarget={onSetRedrawTarget} />
        )}
      </div>
    </div>
  );
};

// Winners List Component
interface WinnersListProps {
  card: CardItem;
  onSetRedrawTarget: (target: {
    index: number;
    participantId: string;
    previousWinnerName?: string;
  }) => void;
}

const WinnersList = ({ card, onSetRedrawTarget }: WinnersListProps) => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl shadow-2xl p-8 mb-10 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
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

            {/* Info Cards */}
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
              <PrizeInfoCard
                icon={<Gift className="w-6 h-6 text-white" />}
                label="Hadiah"
                value={
                  capitalizeEachWord(card.settings?.prize_name || "") || "-"
                }
              />
              <PrizeInfoCard
                icon={<Package className="w-6 h-6 text-white" />}
                label="Total Hadiah"
                value={`${card.settings?.prize_quantity ?? 0} Unit`}
              />
            </div>
          </div>
        </div>

        {card.winners?.length ? (
          <div
            className={`grid gap-6 ${
              card.winners.length === 1
                ? "grid-cols-1"
                : card.winners.length === 2
                ? "grid-cols-2"
                : card.winners.length === 3
                ? "grid-cols-3"
                : card.winners.length === 4
                ? "grid-cols-4"
                : "grid-cols-5"
            } justify-items-center`}
          >
            {card.winners.map((winner, i) => (
              <CardWinnerComponent
                key={winner.id}
                id={winner.id}
                index={i}
                name={winner.event_participant?.name ?? "Tidak diketahui"}
                division={winner.event_participant?.unit ?? ""}
                onRedraw={() =>
                  onSetRedrawTarget({
                    index: i,
                    participantId: winner.event_participant.id,
                    previousWinnerName: winner.event_participant?.name,
                  })
                }
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Belum ada pemenang.</p>
        )}
      </motion.div>
    </div>
  );
};

// Prize Info Card Component
interface PrizeInfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const PrizeInfoCard = ({ icon, label, value }: PrizeInfoCardProps) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3 min-w-[280px]">
      <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-xl">
        {icon}
      </div>
      <div className="text-left">
        <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};
