import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { drawCard } from "@/services/cardAPI";
import { GachaHeaderCard } from "@/components/gacha-machine/GachaHeaderCard";
import { GachaCard } from "@/components/gacha-machine/GachaCard";
import DrawButton from "@/components/gacha-machine/DrawButton";
import { Trophy } from "lucide-react";
import { CardComponent } from "../CardComponent";

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
  delayBetweenMachines?: number;
}

export const GachaMachine = ({
  eventId,
  cardId,
  card,
  spinDuration = 1000,
}: // delayBetweenMachines = 1000,
GachaMachineProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentMachineIndex, setCurrentMachineIndex] = useState(-1);
  const [winners, setWinners] = useState<any[]>([]);
  const [displayValues, setDisplayValues] = useState<string[]>([]);
  const [, setRollingStates] = useState<boolean[]>([]);
  const winnerCount = card?.prize_quantity_slot ?? 1;

  useEffect(() => {
    setDisplayValues(Array(winnerCount).fill("?"));
    setRollingStates(Array(winnerCount).fill(false));
  }, [winnerCount]);

  // const performDraw = async () => {
  //   if (isDrawing || !eventId || !cardId) return;
  //   setIsDrawing(true);
  //   setWinners([]);
  //   setDisplayValues(Array(winnerCount).fill("?"));
  //   setCurrentMachineIndex(-1);

  //   try {
  //     for (let machineIndex = 0; machineIndex < winnerCount; machineIndex++) {
  //       setCurrentMachineIndex(machineIndex);
  //       setRollingStates((prev) =>
  //         prev.map((val, idx) => (idx === machineIndex ? true : val))
  //       );

  //       // Panggil API draw
  //       let rolledParticipants: any[] = [];
  //       let finalWinner: any = null;

  //       try {
  //         const res = await drawCard(eventId, cardId);
  //         rolledParticipants =
  //           res.data?.rolled_participants ?? res.rolled_participants ?? [];
  //         finalWinner = res.data?.winner ?? res.winner ?? null;
  //       } catch (err) {
  //         console.error("Gagal draw di mesin", machineIndex, err);
  //         setDisplayValues((prev) =>
  //           prev.map((val, idx) => (idx === machineIndex ? "Error" : val))
  //         );
  //         setRollingStates((prev) =>
  //           prev.map((val, idx) => (idx === machineIndex ? false : val))
  //         );
  //         continue;
  //       }

  //       //  Animasi peserta
  //       if (rolledParticipants.length > 0) {
  //         const rollInterval = 100;
  //         const rollCount = Math.floor(spinDuration / rollInterval);

  //         for (let i = 0; i < rollCount; i++) {
  //           const randomParticipant =
  //             rolledParticipants[
  //               Math.floor(Math.random() * rolledParticipants.length)
  //             ];
  //           setDisplayValues((prev) =>
  //             prev.map((val, idx) =>
  //               idx === machineIndex ? randomParticipant.name : val
  //             )
  //           );
  //           await new Promise((r) => setTimeout(r, rollInterval));
  //         }
  //       }

  //       //  Tampilkan pemenang
  //       const winnerName = finalWinner?.name ?? "Tidak diketahui";
  //       setDisplayValues((prev) =>
  //         prev.map((val, idx) => (idx === machineIndex ? winnerName : val))
  //       );
  //       setWinners((prev) => [...prev, finalWinner]);

  //       // hentikan rolling
  //       setRollingStates((prev) =>
  //         prev.map((val, idx) => (idx === machineIndex ? false : val))
  //       );

  //       // jeda sebelum lanjut ke mesin berikutnya
  //       if (machineIndex < winnerCount - 1) {
  //         await new Promise((r) => setTimeout(r, delayBetweenMachines));
  //       }
  //     }
  //   } catch (err) {
  //     console.error("Error besar di performDraw:", err);
  //   } finally {
  //     setIsDrawing(false);
  //     setCurrentMachineIndex(-1);
  //   }
  // };
  const performDraw = async () => {
    if (isDrawing || !eventId || !cardId) return;
    setIsDrawing(true);
    setWinners([]);
    setDisplayValues(Array(winnerCount).fill("?"));
    setCurrentMachineIndex(-1);

    try {
      // Jalankan semua mesin secara paralel
      await Promise.all(
        Array.from({ length: winnerCount }).map(async (_, machineIndex) => {
          setCurrentMachineIndex(machineIndex);
          setRollingStates((prev) =>
            prev.map((val, idx) => (idx === machineIndex ? true : val))
          );

          // Panggil API untuk mesin ini
          let rolledParticipants: any[] = [];
          let finalWinner: any = null;

          try {
            const res = await drawCard(eventId, cardId);
            rolledParticipants =
              res.data?.rolled_participants ?? res.rolled_participants ?? [];
            finalWinner = res.data?.winner ?? res.winner ?? null;
          } catch (err) {
            setDisplayValues((prev) =>
              prev.map((val, idx) => (idx === machineIndex ? "Error" : val))
            );
            setRollingStates((prev) =>
              prev.map((val, idx) => (idx === machineIndex ? false : val))
            );
            return;
          }

          // Animasi peserta
          if (rolledParticipants.length > 0) {
            const rollInterval = 100;
            const rollCount = Math.floor(spinDuration / rollInterval);

            for (let i = 0; i < rollCount; i++) {
              const randomParticipant =
                rolledParticipants[
                  Math.floor(Math.random() * rolledParticipants.length)
                ];
              setDisplayValues((prev) =>
                prev.map((val, idx) =>
                  idx === machineIndex ? randomParticipant.name : val
                )
              );
              await new Promise((r) => setTimeout(r, rollInterval));
            }
          }

          // Tampilkan pemenang
          const winnerName = finalWinner?.name ?? "Tidak diketahui";
          setDisplayValues((prev) =>
            prev.map((val, idx) => (idx === machineIndex ? winnerName : val))
          );
          setWinners((prev) => [...prev, finalWinner]);

          // Hentikan rolling
          setRollingStates((prev) =>
            prev.map((val, idx) => (idx === machineIndex ? false : val))
          );
        })
      );
    } catch (err) {
    } finally {
      setIsDrawing(false);
      setCurrentMachineIndex(-1);
    }
  };

  return (
    <div>
      <div className="mb-10 mx-8">
        <GachaHeaderCard
          prize={card.settings?.prize_name}
          winnerCount={winnerCount}
        />
      </div>

      {/* Gacha Machines */}
      <div className="flex flex-wrap justify-center gap-6 mb-12">
        {Array.from({ length: winnerCount }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <GachaCard
              displayValue={displayValues[index]}
              highlight={currentMachineIndex === index && isDrawing}
              showStars={
                !isDrawing &&
                displayValues[index] !== "?" &&
                currentMachineIndex === -1
              }
            />
          </motion.div>
        ))}
      </div>

      {/* Draw Button */}
      <div className="flex justify-center mb-12">
        {/* Draw Button */}
        {!isDrawing && winners.length === 0 && (
          <div className="flex justify-center mb-12">
            <DrawButton
              text="Mulai Undian!"
              onClick={performDraw}
              disabled={isDrawing}
            />
          </div>
        )}
        {isDrawing && (
          <div className="flex justify-center mb-12">
            <DrawButton
              text="Sedang Mengundi..."
              onClick={performDraw}
              disabled
            />
          </div>
        )}
      </div>

      {/* Winners List */}
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
                key={winner.id}
                id={winner.id}
                index={i}
                title={winner.name ?? "Tidak diketahui"}
                division={winner?.unit ?? ""}
                onRedraw={(id) => console.log("Redraw untuk ID:", id)}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
