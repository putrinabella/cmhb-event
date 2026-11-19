// import { useState, useRef } from "react";
// import { drawCard, redrawCard } from "@/services/cardAPI";

// interface UseGachaDrawProps {
//   eventId: string;
//   cardId: string;
//   winnerCount: number;
//   spinDuration?: number;
// }

// export const useGachaDraw = ({
//   eventId,
//   cardId,
//   winnerCount,
//   spinDuration = 2000, // durasi animasi per card
// }: UseGachaDrawProps) => {
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [currentMachineIndex, setCurrentMachineIndex] = useState(-1);
//   const [displayValues, setDisplayValues] = useState<string[]>(
//     Array(winnerCount).fill("?")
//   );
//   const [winners, setWinners] = useState<any[]>([]);

//   const audioRef = useRef<HTMLAudioElement | null>(null);

//   // --- Animasi roll
//   const animateRoll = async (
//     slotIndex: number,
//     rolledParticipants: any[],
//     finalWinner: any
//   ) => {
//     const rollInterval = 100;
//     const rollCount = Math.floor(spinDuration / rollInterval);

//     for (let i = 0; i < rollCount; i++) {
//       const random =
//         rolledParticipants[
//           Math.floor(Math.random() * rolledParticipants.length)
//         ];
//       setDisplayValues((prev) =>
//         prev.map((val, idx) => (idx === slotIndex ? random?.name ?? "?" : val))
//       );
//       await new Promise((r) => setTimeout(r, rollInterval));
//     }

//     const winnerName = finalWinner?.name ?? "Tidak diketahui";
//     setDisplayValues((prev) =>
//       prev.map((val, idx) => (idx === slotIndex ? winnerName : val))
//     );

//     setWinners((prev) => {
//       const updated = [...prev];
//       updated[slotIndex] = finalWinner;
//       return updated;
//     });
//   };

//   const drawSingleSlot = async (slotIndex: number) => {
//     setCurrentMachineIndex(slotIndex);

//     // buat audio baru untuk slot ini
//     const audio = new Audio("/sounds/gacha.wav");
//     audio.volume = 0.8;
//     audioRef.current = audio;

//     try {
//       const res = await drawCard(eventId, cardId);
//       const rolledParticipants =
//         res.data?.rolled_participants ?? res.rolled_participants ?? [];
//       const finalWinner = res.data?.winner ?? res.winner ?? null;

//       // mainkan audio
//       const audioPromise = new Promise<void>((resolve) => {
//         audio.play().catch(() => console.warn("Audio play failed"));
//         audio.onended = () => resolve();
//       });

//       // jalankan animasi spin (lebih cepat dari audio)
//       await animateRoll(slotIndex, rolledParticipants, finalWinner);

//       // tunggu audio selesai sebelum slot berikutnya
//       await audioPromise;

//       return finalWinner;
//     } catch (err) {
//       setDisplayValues((prev) =>
//         prev.map((val, idx) => (idx === slotIndex ? "Error" : val))
//       );
//       return null;
//     } finally {
//       setCurrentMachineIndex(-1);
//       audioRef.current = null;
//     }
//   };

//   const performDraw = async () => {
//     if (isDrawing) return;
//     setIsDrawing(true);
//     setWinners([]);
//     setDisplayValues(Array(winnerCount).fill("?"));

//     try {
//       for (let i = 0; i < winnerCount; i++) {
//         await drawSingleSlot(i); // tunggu sampai audio & animasi selesai sebelum lanjut slot berikut
//       }
//     } finally {
//       setIsDrawing(false);
//       setCurrentMachineIndex(-1);
//     }
//   };

//   // --- Redraw
//   const redrawSingleSlot = async (slotIndex: number, participantId: string) => {
//     setCurrentMachineIndex(slotIndex);

//     const audio = new Audio("/sounds/gacha.wav");
//     audio.volume = 0.8;
//     audioRef.current = audio;

//     try {
//       const res = await redrawCard(eventId, cardId, participantId);
//       const rolledParticipants =
//         res.data?.rolled_participants ?? res.rolled_participants ?? [];
//       const finalWinner = res.data?.winner ?? res.winner ?? null;

//       const playAudio = () =>
//         new Promise<void>((resolve) => {
//           audio.play().catch(() => console.warn("Audio play failed"));
//           audio.onended = () => resolve();
//         });

//       await Promise.all([
//         animateRoll(slotIndex, rolledParticipants, finalWinner),
//         playAudio(),
//       ]);

//       return finalWinner;
//     } finally {
//       setCurrentMachineIndex(-1);
//       audioRef.current = null;
//     }
//   };

//   const performRedraw = async (slotIndex: number, participantId: string) => {
//     if (isDrawing) return;
//     setIsDrawing(true);
//     try {
//       await redrawSingleSlot(slotIndex, participantId);
//     } finally {
//       setIsDrawing(false);
//       setCurrentMachineIndex(-1);
//     }
//   };

//   return {
//     isDrawing,
//     currentMachineIndex,
//     displayValues,
//     winners,
//     performDraw,
//     performRedraw,
//     setWinners,
//   };
// };
import { useState, useRef } from "react";
import { drawCard, redrawCard } from "@/services/cardAPI";

interface UseGachaDrawProps {
  eventId: string;
  cardId: string;
  winnerCount: number;
  spinDuration?: number;
}

export const useGachaDraw = ({
  eventId,
  cardId,
  winnerCount,
}: // spinDuration = 2000,
UseGachaDrawProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentMachineIndex, setCurrentMachineIndex] = useState(-1);
  const [displayValues, setDisplayValues] = useState<string[]>(
    Array(winnerCount).fill("?")
  );
  const [winners, setWinners] = useState<any[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- Animasi roll ---
  // const animateRoll = async (
  //   slotIndex: number,
  //   rolledParticipants: any[],
  //   finalWinner: any
  // ) => {
  //   if (!rolledParticipants.length) return;

  //   const rollInterval = 100;
  //   const rollCount = Math.floor(spinDuration / rollInterval);

  //   for (let i = 0; i < rollCount; i++) {
  //     const random =
  //       rolledParticipants[
  //         Math.floor(Math.random() * rolledParticipants.length)
  //       ];
  //     setDisplayValues((prev) =>
  //       prev.map((val, idx) => (idx === slotIndex ? random?.name ?? "?" : val))
  //     );
  //     await new Promise((r) => setTimeout(r, rollInterval));
  //   }

  //   const winnerName = finalWinner?.name ?? "Tidak diketahui";
  //   setDisplayValues((prev) =>
  //     prev.map((val, idx) => (idx === slotIndex ? winnerName : val))
  //   );

  //   setWinners((prev) => {
  //     const updated = [...prev];
  //     updated[slotIndex] = finalWinner;
  //     return updated;
  //   });
  // };

  // --- Draw single slot ---
  // const drawSingleSlot = async (slotIndex: number) => {
  //   setCurrentMachineIndex(slotIndex);

  //   const audio = new Audio("/sounds/gacha.wav");
  //   audio.volume = 0.8;
  //   audioRef.current = audio;

  //   try {
  //     const res = await drawCard(eventId, cardId);
  //     const rolledParticipants =
  //       res.data?.rolled_participants ?? res.rolled_participants ?? [];
  //     const finalWinner = res.data?.winner ?? res.winner ?? null;

  //     // Jalankan animasi roll terlebih dahulu
  //     await animateRoll(slotIndex, rolledParticipants, finalWinner);

  //     // Mainkan audio dan tunggu sampai selesai
  //     await new Promise<void>((resolve) => {
  //       audio.play().catch(() => console.warn("Audio play failed"));
  //       audio.onended = () => resolve();
  //     });

  //     return finalWinner;
  //   } catch (err) {
  //     setDisplayValues((prev) =>
  //       prev.map((val, idx) => (idx === slotIndex ? "Error" : val))
  //     );
  //     return null;
  //   } finally {
  //     setCurrentMachineIndex(-1);
  //     audioRef.current = null;
  //   }
  // };
  const drawSingleSlot = async (slotIndex: number) => {
    setCurrentMachineIndex(slotIndex);

    const audio = new Audio("/sounds/gacha.wav");
    audio.volume = 0.8;
    audioRef.current = audio;

    try {
      const res = await drawCard(eventId, cardId);
      const rolledParticipants =
        res.data?.rolled_participants ?? res.rolled_participants ?? [];
      const finalWinner = res.data?.winner ?? res.winner ?? null;

      // mainkan audio
      const audioPromise = new Promise<void>((resolve) => {
        audio.play().catch(() => console.warn("Audio play failed"));
        audio.onended = () => resolve();
      });

      // jalankan animasi spin singkat bersamaan dengan audio
      const rollInterval = 100;
      const rollCount = Math.min(rolledParticipants.length, 10); // spin sebentar saja
      for (let i = 0; i < rollCount; i++) {
        const random =
          rolledParticipants[
            Math.floor(Math.random() * rolledParticipants.length)
          ];
        setDisplayValues((prev) =>
          prev.map((val, idx) =>
            idx === slotIndex ? random?.name ?? "?" : val
          )
        );
        await new Promise((r) => setTimeout(r, rollInterval));
      }

      // tampilkan winner → freeze
      const winnerName = finalWinner?.name ?? "Tidak diketahui";
      setDisplayValues((prev) =>
        prev.map((val, idx) => (idx === slotIndex ? winnerName : val))
      );

      setWinners((prev) => {
        const updated = [...prev];
        updated[slotIndex] = finalWinner;
        return updated;
      });

      // tunggu audio selesai sebelum slot berikutnya
      await audioPromise;

      return finalWinner;
    } catch (err) {
      setDisplayValues((prev) =>
        prev.map((val, idx) => (idx === slotIndex ? "Error" : val))
      );
      return null;
    } finally {
      setCurrentMachineIndex(-1);
      audioRef.current = null;
    }
  };

  // --- Draw semua slot ---
  const performDraw = async () => {
    if (isDrawing) return;
    setIsDrawing(true);
    setWinners([]);
    setDisplayValues(Array(winnerCount).fill("?"));

    try {
      for (let i = 0; i < winnerCount; i++) {
        await drawSingleSlot(i);
      }
    } finally {
      setIsDrawing(false);
      setCurrentMachineIndex(-1);
    }
  };

  // --- Redraw single slot ---
  // const redrawSingleSlot = async (slotIndex: number, participantId: string) => {
  //   setCurrentMachineIndex(slotIndex);

  //   const audio = new Audio("/sounds/gacha.wav");
  //   audio.volume = 0.8;
  //   audioRef.current = audio;

  //   try {
  //     const res = await redrawCard(eventId, cardId, participantId);
  //     const rolledParticipants =
  //       res.data?.rolled_participants ?? res.rolled_participants ?? [];
  //     const finalWinner = res.data?.winner ?? res.winner ?? null;

  //     // Animasi roll dulu
  //     await animateRoll(slotIndex, rolledParticipants, finalWinner);

  //     // Mainkan audio setelah animasi selesai
  //     await new Promise<void>((resolve) => {
  //       audio.play().catch(() => console.warn("Audio play failed"));
  //       audio.onended = () => resolve();
  //     });

  //     return finalWinner;
  //   } finally {
  //     setCurrentMachineIndex(-1);
  //     audioRef.current = null;
  //   }
  // };
  const redrawSingleSlot = async (slotIndex: number, participantId: string) => {
    setCurrentMachineIndex(slotIndex);

    const audio = new Audio("/sounds/gacha.wav");
    audio.volume = 0.8;
    audioRef.current = audio;

    try {
      const res = await redrawCard(eventId, cardId, participantId);
      const rolledParticipants =
        res.data?.rolled_participants ?? res.rolled_participants ?? [];
      const finalWinner = res.data?.winner ?? res.winner ?? null;

      // mainkan audio
      const audioPromise = new Promise<void>((resolve) => {
        audio.play().catch(() => console.warn("Audio play failed"));
        audio.onended = () => resolve();
      });

      // jalankan animasi spin singkat bersamaan dengan audio
      const rollInterval = 100;
      const rollCount = Math.min(rolledParticipants.length, 10); // spin sebentar saja
      for (let i = 0; i < rollCount; i++) {
        const random =
          rolledParticipants[
            Math.floor(Math.random() * rolledParticipants.length)
          ];
        setDisplayValues((prev) =>
          prev.map((val, idx) =>
            idx === slotIndex ? random?.name ?? "?" : val
          )
        );
        await new Promise((r) => setTimeout(r, rollInterval));
      }

      // tampilkan winner → freeze
      const winnerName = finalWinner?.name ?? "Tidak diketahui";
      setDisplayValues((prev) =>
        prev.map((val, idx) => (idx === slotIndex ? winnerName : val))
      );

      setWinners((prev) => {
        const updated = [...prev];
        updated[slotIndex] = finalWinner;
        return updated;
      });

      // tunggu audio selesai sebelum slot berikutnya
      await audioPromise;

      return finalWinner;
    } finally {
      setCurrentMachineIndex(-1);
      audioRef.current = null;
    }
  };

  const performRedraw = async (slotIndex: number, participantId: string) => {
    if (isDrawing) return;
    setIsDrawing(true);
    try {
      await redrawSingleSlot(slotIndex, participantId);
    } finally {
      setIsDrawing(false);
      setCurrentMachineIndex(-1);
    }
  };

  return {
    isDrawing,
    currentMachineIndex,
    displayValues,
    winners,
    performDraw,
    performRedraw,
    setWinners,
  };
};
