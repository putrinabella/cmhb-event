import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cake, PartyPopper, Sparkle } from "lucide-react";
import { capitalizeEachWord } from "@/utils/stringUtils";

export interface GachaHeaderCardProps {
  children?: React.ReactNode;
  highlight?: boolean;
  displayValue?: string;
  showStars?: boolean;
  prize?: string;
  winnerCount?: number;
}

export const GachaHeaderCard = ({
  children,
  highlight = true,
  displayValue,
  showStars = true,
  prize = "",
  winnerCount = 0,
}: GachaHeaderCardProps) => {
  return (
    <motion.div
      className="relative"
      animate={highlight ? { y: [0, -10, 0] } : {}}
      transition={{ duration: 0.5, repeat: highlight ? 3 : 0 }}
    >
      <div className="relative bg-gradient-to-br from-pink-400/60 via-purple-400/60 to-fuchsia-500/60 rounded-3xl p-5 shadow-2xl">
        {/* Sparkle Lights */}
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: i < 8 ? `${8 + i * 11}%` : `${8 + (i - 8) * 11}%`,
              top: i < 8 ? "5%" : "90%",
              background:
                i % 2 === 0
                  ? "linear-gradient(135deg, #fde68a, #fbbf24)"
                  : "linear-gradient(135deg, #fbcfe8, #f9a8d4)",
            }}
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1.5, 0.8],
              boxShadow: [
                "0 0 8px rgba(251, 207, 232, 0.6)",
                "0 0 20px rgba(251, 207, 232, 1)",
                "0 0 8px rgba(251, 207, 232, 0.6)",
              ],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.08,
            }}
          />
        ))}

        {/* Side Sparkles */}
        {[...Array(6)].map((_, i) => (
          <React.Fragment key={`side-${i}`}>
            <motion.div
              className="absolute w-2.5 h-2.5 rounded-full bg-gradient-to-br from-yellow-200 to-pink-300"
              style={{ left: "5%", top: `${20 + i * 12}%` }}
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [0.8, 1.4, 0.8],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.12 }}
            />
            <motion.div
              className="absolute w-2.5 h-2.5 rounded-full bg-gradient-to-br from-purple-200 to-fuchsia-300"
              style={{ right: "5%", top: `${20 + i * 12}%` }}
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [0.8, 1.4, 0.8],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 0.7,
                repeat: Infinity,
                delay: i * 0.12 + 0.35,
              }}
            />
          </React.Fragment>
        ))}

        {/* Reel / Content Window */}
        <div className="relative bg-gradient-to-br from-purple-900/60 via-pink-900/60 to-fuchsia-900/60 rounded-2xl p-4 shadow-inner backdrop-blur-sm">
          <div className="relative h-36 bg-gradient-to-br from-pink-50 via-purple-50 to-fuchsia-50 rounded-xl overflow-hidden shadow-xl flex items-center justify-center border-2 border-white/60">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-200/20 to-transparent pointer-events-none" />

            {showStars && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-yellow-400 text-2xl"
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                    animate={{
                      x: Math.cos((i * 45 * Math.PI) / 180) * 60,
                      y: Math.sin((i * 45 * Math.PI) / 180) * 60,
                      opacity: 0,
                      scale: 1.5,
                      rotate: 360,
                    }}
                    transition={{ duration: 1, delay: i * 0.05 }}
                  >
                    <Sparkle className="w-10 h-10" />
                  </motion.div>
                ))}
              </>
            )}

            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={displayValue || prize}
                  initial={{ y: -70, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 70, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                  className="text-center p-4 rounded-xl transition-all duration-300"
                >
                  <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary m-4">
                    <div className="text-center z-10 relative">
                      {/* Background Glow */}
                      <div className="absolute inset-0 flex justify-center">
                        <div className="w-60 h-60 bg-pink-300/30 rounded-full blur-3xl animate-pulse" />
                      </div>

                      <div className="relative flex flex-col items-center gap-4">
                        <div className="flex items-center justify-center gap-4">
                          <PartyPopper className="w-12 h-12 text-pink-400 animate-[float_3s_ease-in-out_infinite]" />

                          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-lg">
                            {capitalizeEachWord(prize)}
                          </h1>

                          <Cake className="w-12 h-12 text-purple-400 animate-[float_3s_0.3s_ease-in-out_infinite]" />
                        </div>

                        <p className="text-lg md:text-2xl font-semibold text-gray-700 drop-shadow-sm">
                          {winnerCount} Orang Pemenang
                        </p>
                      </div>

                      <style>
                        {`
                          @keyframes float {
                              0%, 100% { transform: translateY(0); }
                              50% { transform: translateY(-10px); }
                          }
                        `}
                      </style>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Optional children */}
        {children}

        {/* Decorative corners */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-yellow-300 rounded-tl-full" />
        <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-yellow-300 rounded-tr-full" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-yellow-300 rounded-bl-full" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-yellow-300 rounded-br-full" />

        {/* Border frame */}
        {/* <div className="absolute -inset-1 rounded-3xl border-4 border-yellow-300 pointer-events-none shadow-2xl" /> */}
      </div>
    </motion.div>
  );
};
