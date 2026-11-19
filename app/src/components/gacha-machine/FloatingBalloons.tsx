import "@/FloatingBalloons.css";
import { ballColors } from "./ballColors";

const FloatingBalloons = () => {
  const balloons = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: i * 12 + 5,
    delay: i * 0.5,
    duration: 8 + Math.random() * 4,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {balloons.map((balloon) => (
        <div
          key={balloon.id}
          className="absolute bottom-0"
          style={{
            left: `${balloon.left}%`,
            animation: `float-up ${balloon.duration}s ease-in ${balloon.delay}s infinite`,
          }}
        >
          {/* Balon */}
          <div
            className={`relative w-16 h-20 bg-gradient-to-br ${
              ballColors[balloon.id % ballColors.length].bg
            } rounded-full opacity-70`}
          >
            {/* Highlight */}
            <div className="absolute top-2 left-3 w-6 h-6 bg-white/60 rounded-full blur-sm" />
          </div>

          {/* Tali */}
          <div className="w-1 h-12 bg-gray-400 mx-auto" />
        </div>
      ))}
    </div>
  );
};

export default FloatingBalloons;
