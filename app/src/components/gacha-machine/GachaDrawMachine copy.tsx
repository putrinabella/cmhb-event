import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { GachaHeaderCard } from "@/components/gacha-machine/GachaHeaderCard";
import { GachaCard } from "@/components/gacha-machine/GachaCard";
import DrawButton from "@/components/gacha-machine/DrawButton";
import { CardComponent } from "../CardComponent";
import { useGachaDraw } from "@/hooks/use-gacha-draw";
import { useEffect, useState } from "react";

interface GachaMachineProps {
  eventId: string;
  cardId: string;
  card: {
    prize_quantity_slot: number;
    settings?: {
      prize_name?: string;
      prize_quantity?: number;
    };
  };
  spinDuration?: number;
  redrawTarget?: {
    index: number;
    participantId: string;
    previousWinnerName?: string;
  } | null;
  onFinishRedraw?: () => void;
}

export const GachaMachine = ({
  eventId,
  cardId,
  card,
  spinDuration = 1000,
  redrawTarget,
}: GachaMachineProps) => {
  const winnerCount = card?.prize_quantity_slot ?? 1;
  const isRedrawMode = !!redrawTarget;

  const {
    isDrawing,
    currentMachineIndex,
    displayValues,
    winners,
    performDraw,
    performRedraw,
  } = useGachaDraw({
    eventId,
    cardId,
    winnerCount: isRedrawMode ? 1 : winnerCount,
    spinDuration,
  });

  const [redrawExecuted, setRedrawExecuted] = useState(false);

  useEffect(() => {
    if (redrawTarget && !redrawExecuted) {
      setRedrawExecuted(true);
      performRedraw(0, redrawTarget.participantId).then(() => {
        setRedrawExecuted(false);
      });
    }
  }, [redrawTarget, redrawExecuted, performRedraw]);

  useEffect(() => {
    if (!redrawTarget) {
      setRedrawExecuted(false);
    }
  }, [redrawTarget]);

  return (
    <div>
      {/* Header */}
      <div className="mb-10 mx-8">
        {isRedrawMode && redrawTarget?.previousWinnerName ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4"
          >
            <p className="text-lg text-gray-600 mb-2">
              Undian Ulang untuk Pemenang Sebelumnya:
            </p>
            <p className="text-2xl font-bold text-primary">
              {redrawTarget.previousWinnerName}
            </p>
          </motion.div>
        ) : null}
        <GachaHeaderCard
          prize={card.settings?.prize_name}
          winnerCount={isRedrawMode ? 1 : winnerCount}
        />
      </div>

      {/* Gacha Machines */}
      <div className="flex flex-wrap justify-center gap-6 mb-12">
        {displayValues.map((value, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <GachaCard
              displayValue={value}
              highlight={currentMachineIndex === index && isDrawing}
              showStars={
                !isDrawing && value !== "?" && currentMachineIndex === -1
              }
            />
          </motion.div>
        ))}
      </div>

      {/* Tombol Draw - hanya tampil jika bukan mode redraw */}
      {!isRedrawMode && (
        <div className="flex justify-center mb-12">
          {!isDrawing && winners.length === 0 && (
            <DrawButton
              text="Mulai Undian!"
              onClick={performDraw}
              disabled={isDrawing}
            />
          )}
          {isDrawing && (
            <DrawButton text="Sedang Mengundi..." onClick={() => {}} disabled />
          )}
        </div>
      )}

      {/* Status redraw */}
      {isRedrawMode && isDrawing && (
        <div className="flex justify-center mb-12">
          <DrawButton
            text="Sedang Mengundi Ulang..."
            onClick={() => {}}
            disabled
          />
        </div>
      )}

      {!isDrawing && winners.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="flex items-center justify-center gap-3 text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            <Trophy className="w-8 h-8 text-primary" />
            Daftar Pemenang
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-5 gap-6">
            {winners.map((winner, i) => (
              <CardComponent
                key={winner?.id ?? i}
                id={winner?.id}
                index={i}
                title={winner?.name ?? "Tidak diketahui"}
                division={winner?.unit ?? ""}
                onRedraw={(id) => performRedraw(i, id)}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
