import { motion } from "framer-motion";

interface BrewingCupSVGProps {
  fillLevel: number; // 0 to 1
  ingredients: string[]; // emojis of chosen ingredients
  className?: string;
}

const BrewingCupSVG = ({ fillLevel, ingredients, className = "" }: BrewingCupSVGProps) => {
  const liquidY = 140 - fillLevel * 70; // fills from bottom
  const liquidHeight = fillLevel * 70;

  // Color transitions as brew progresses
  const brewColors = [
    { stop1: "hsl(37, 45%, 85%)", stop2: "hsl(37, 40%, 80%)" }, // empty - light cream
    { stop1: "hsl(32, 55%, 72%)", stop2: "hsl(28, 50%, 65%)" }, // 25%
    { stop1: "hsl(25, 60%, 58%)", stop2: "hsl(20, 55%, 50%)" }, // 50%
    { stop1: "hsl(18, 65%, 45%)", stop2: "hsl(15, 60%, 38%)" }, // 75%
    { stop1: "hsl(15, 70%, 35%)", stop2: "hsl(12, 65%, 28%)" }, // 100% - rich brew
  ];

  const colorIndex = Math.min(Math.floor(fillLevel * 4), 4);
  const colors = brewColors[colorIndex];

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="liquidGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.stop1} />
            <stop offset="100%" stopColor={colors.stop2} />
          </linearGradient>
          <linearGradient id="cupGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(37, 45%, 94%)" />
            <stop offset="100%" stopColor="hsl(37, 35%, 88%)" />
          </linearGradient>
          <clipPath id="cupClip">
            <path d="M55 70 Q55 145, 70 155 Q85 165, 100 165 Q115 165, 130 155 Q145 145, 145 70 Z" />
          </clipPath>
        </defs>

        {/* Saucer */}
        <ellipse cx="100" cy="172" rx="65" ry="10" fill="hsl(37, 35%, 86%)" />
        <ellipse cx="100" cy="170" rx="60" ry="8" fill="hsl(37, 40%, 90%)" />

        {/* Cup body */}
        <path
          d="M55 70 Q55 145, 70 155 Q85 165, 100 165 Q115 165, 130 155 Q145 145, 145 70 Z"
          fill="url(#cupGradient)"
          stroke="hsl(30, 25%, 75%)"
          strokeWidth="2"
        />

        {/* Cup rim */}
        <ellipse cx="100" cy="70" rx="46" ry="10" fill="hsl(37, 45%, 92%)" stroke="hsl(30, 25%, 75%)" strokeWidth="1.5" />

        {/* Handle */}
        <path
          d="M145 85 Q170 85, 172 110 Q174 135, 145 135"
          fill="none"
          stroke="hsl(30, 25%, 75%)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Liquid - animated fill */}
        <g clipPath="url(#cupClip)">
          <motion.rect
            x="55"
            width="90"
            fill="url(#liquidGradient)"
            initial={{ y: 140, height: 0 }}
            animate={{ y: liquidY, height: liquidHeight }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          {/* Surface shimmer */}
          {fillLevel > 0 && (
            <motion.ellipse
              cx="100"
              ry="3"
              rx="40"
              fill="hsl(32, 50%, 70%)"
              opacity={0.4}
              initial={{ cy: 140 }}
              animate={{ cy: liquidY + 2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          )}
        </g>

        {/* Steam wisps - only show when there's liquid */}
        {fillLevel > 0.2 && (
          <>
            <motion.path
              d="M85 65 Q82 50, 87 38 Q92 26, 88 15"
              fill="none"
              stroke="hsl(30, 20%, 75%)"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{
                opacity: [0, 0.5, 0],
                pathLength: [0, 1, 1],
                y: [0, -5, -10],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <motion.path
              d="M100 62 Q103 48, 98 35 Q93 22, 98 12"
              fill="none"
              stroke="hsl(30, 20%, 75%)"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.4, 0],
                y: [0, -6, -12],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.8,
              }}
            />
            <motion.path
              d="M115 64 Q118 50, 113 37 Q108 24, 113 14"
              fill="none"
              stroke="hsl(30, 20%, 75%)"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.35, 0],
                y: [0, -4, -8],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeOut",
                delay: 1.5,
              }}
            />
          </>
        )}
      </svg>

      {/* Floating ingredient emojis around the cup */}
      <div className="absolute inset-0 pointer-events-none">
        {ingredients.map((emoji, i) => {
          const angle = (i / Math.max(ingredients.length, 1)) * Math.PI * 2 - Math.PI / 2;
          const radius = 42;
          const x = 50 + Math.cos(angle) * radius;
          const y = 40 + Math.sin(angle) * radius;

          return (
            <motion.span
              key={`${emoji}-${i}`}
              className="absolute text-lg select-none"
              style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.7 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 15,
                delay: 0.1,
              }}
            >
              {emoji}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
};

export default BrewingCupSVG;
