import { motion } from "framer-motion";

const BookStackCoffee = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`relative w-full h-[220px] md:h-[260px] flex items-center justify-center ${className}`}>
      <motion.svg
        viewBox="0 0 240 260"
        className="w-[200px] md:w-[240px] h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [0, -6, 0], rotate: [0, 0.5, -0.5, 0] }}
        transition={{ opacity: { duration: 0.6 }, y: { duration: 4, repeat: Infinity, ease: "easeInOut" as const }, rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" as const } }}
      >
        {/* Bottom book — wide, warm */}
        <rect x="40" y="190" width="160" height="28" rx="4" fill="hsl(18 65% 45%)" stroke="hsl(25 30% 18%)" strokeWidth="1.5" />
        <rect x="40" y="190" width="12" height="28" rx="3" fill="hsl(18 65% 38%)" />
        <line x1="60" y1="200" x2="140" y2="200" stroke="hsl(40 45% 97% / 0.3)" strokeWidth="1" />
        <line x1="60" y1="206" x2="120" y2="206" stroke="hsl(40 45% 97% / 0.3)" strokeWidth="1" />

        {/* Second book — sage, slightly offset */}
        <rect x="50" y="162" width="148" height="26" rx="4" fill="hsl(140 20% 55%)" stroke="hsl(25 30% 18%)" strokeWidth="1.5" />
        <rect x="50" y="162" width="11" height="26" rx="3" fill="hsl(140 20% 45%)" />
        <line x1="70" y1="172" x2="130" y2="172" stroke="hsl(40 45% 97% / 0.3)" strokeWidth="1" />
        <line x1="70" y1="178" x2="110" y2="178" stroke="hsl(40 45% 97% / 0.3)" strokeWidth="1" />

        {/* Third book — dusty rose, offset other way */}
        <rect x="44" y="136" width="155" height="24" rx="4" fill="hsl(350 30% 65%)" stroke="hsl(25 30% 18%)" strokeWidth="1.5" />
        <rect x="44" y="136" width="11" height="24" rx="3" fill="hsl(350 30% 55%)" />
        <path d="M72 146 Q72 142 76 142 Q80 142 80 146 Q80 150 76 152 Q72 150 72 146Z" stroke="hsl(40 45% 97% / 0.4)" strokeWidth="0.8" fill="none" />

        {/* Fourth book — accent/gold, thinner */}
        <rect x="55" y="116" width="140" height="18" rx="3" fill="hsl(32 70% 55%)" stroke="hsl(25 30% 18%)" strokeWidth="1.5" />
        <rect x="55" y="116" width="10" height="18" rx="3" fill="hsl(32 70% 45%)" />
        <line x1="74" y1="124" x2="120" y2="124" stroke="hsl(40 45% 97% / 0.3)" strokeWidth="1" />

        {/* Top book — dark ink */}
        <rect x="48" y="94" width="150" height="20" rx="3" fill="hsl(25 30% 18%)" stroke="hsl(25 30% 12%)" strokeWidth="1.5" />
        <rect x="48" y="94" width="10" height="20" rx="3" fill="hsl(25 30% 14%)" />
        <line x1="66" y1="103" x2="130" y2="103" stroke="hsl(40 45% 97% / 0.15)" strokeWidth="1" />

        {/* Coffee cup — sitting on top */}
        {/* Saucer */}
        <ellipse cx="140" cy="93" rx="28" ry="6" fill="hsl(37 35% 85%)" stroke="hsl(25 30% 18%)" strokeWidth="1.2" />
        {/* Cup body */}
        <path d="M120 58 L124 88 Q140 94 156 88 L160 58 Z" fill="hsl(37 45% 92%)" stroke="hsl(25 30% 18%)" strokeWidth="1.5" />
        {/* Coffee inside */}
        <ellipse cx="140" cy="62" rx="20" ry="5" fill="hsl(28 50% 35%)" />
        {/* Cup rim highlight */}
        <ellipse cx="140" cy="58" rx="20" ry="5" fill="none" stroke="hsl(25 30% 18%)" strokeWidth="1.5" />
        {/* Handle */}
        <path d="M160 64 Q174 66 174 76 Q174 86 160 86" stroke="hsl(25 30% 18%)" strokeWidth="1.5" fill="none" />

        {/* Animated steam */}
        <motion.path
          d="M132 50 Q134 40 130 30"
          stroke="hsl(25 15% 55%)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          animate={{ opacity: [0.15, 0.5, 0.15], y: [0, -4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" as const }}
        />
        <motion.path
          d="M140 48 Q142 36 138 26"
          stroke="hsl(25 15% 55%)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          animate={{ opacity: [0.1, 0.55, 0.1], y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const, delay: 0.6 }}
        />
        <motion.path
          d="M148 50 Q146 38 150 28"
          stroke="hsl(25 15% 55%)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          animate={{ opacity: [0.1, 0.45, 0.1], y: [0, -3, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" as const, delay: 1.2 }}
        />

        {/* Tiny sparkle accents */}
        <motion.text
          x="80" y="80"
          fontSize="10"
          fill="hsl(32 70% 55%)"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        >✦</motion.text>
        <motion.text
          x="180" y="110"
          fontSize="8"
          fill="hsl(350 30% 65%)"
          animate={{ opacity: [0.15, 0.5, 0.15] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
        >✧</motion.text>
      </motion.svg>
    </div>
  );
};

export default BookStackCoffee;
