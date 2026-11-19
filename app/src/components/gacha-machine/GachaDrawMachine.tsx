import { motion } from "framer-motion";
import { GachaHeaderCard } from "@/components/gacha-machine/GachaHeaderCard";
import { GachaCard } from "@/components/gacha-machine/GachaCard";
import DrawButton from "@/components/gacha-machine/DrawButton";
import { useGachaDraw } from "@/hooks/use-gacha-draw";
import { useEffect, useState } from "react";
import { CardWinnerComponent } from "../CardWinnerComponent";
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
  spinDuration = 1500,
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
      <div className="mb-10">
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
      <div
        className={`grid justify-center gap-6 mb-12 w-full ${
          displayValues.length === 1
            ? "grid-cols-1"
            : displayValues.length === 2
            ? "grid-cols-2"
            : displayValues.length === 3
            ? "grid-cols-3"
            : displayValues.length === 4
            ? "grid-cols-4"
            : "grid-cols-5"
        }`}
      >
        {displayValues.map((value, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="w-full flex justify-center"
          >
            <GachaCard
              displayValue={value}
              highlight={currentMachineIndex === index && isDrawing}
              textSize={isRedrawMode ? "text-7xl" : "text-3xl"}
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
          <div
            className={`grid gap-6 ${
              winners.length === 1
                ? "grid-cols-1"
                : winners.length === 2
                ? "grid-cols-2"
                : winners.length === 3
                ? "grid-cols-3"
                : winners.length === 4
                ? "grid-cols-4"
                : "grid-cols-5"
            } justify-items-center`}
          >
            {winners.map((winner, i) => (
              <CardWinnerComponent
                key={winner?.id ?? i}
                id={winner?.id}
                index={i}
                name={winner?.name ?? "Tidak diketahui"}
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
