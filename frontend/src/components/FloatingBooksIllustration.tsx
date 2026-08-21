import { motion } from "framer-motion";

const FloatingBooksIllustration = ({ className = "" }: { className?: string }) => {
  const floatVariant = (delay: number, y: number = 8) => ({
    animate: {
      y: [0, -y, 0],
      rotate: [0, 1, -1, 0],
      transition: { duration: 3.5 + delay, repeat: Infinity, ease: "easeInOut" as const, delay: delay * 0.3 },
    },
  });

  return (
    <div className={`relative w-full h-[220px] md:h-[260px] ${className}`}>
      {/* Book 1 — large, warm tones */}
      <motion.div
        className="absolute left-[12%] top-[30%]"
        {...floatVariant(0, 10)}
      >
        <svg width="72" height="90" viewBox="0 0 72 90" fill="none">
          <rect x="4" y="4" width="52" height="78" rx="4" fill="hsl(18 65% 45%)" stroke="hsl(25 30% 18%)" strokeWidth="1.5" />
          <rect x="8" y="8" width="44" height="70" rx="2" fill="hsl(18 65% 50%)" />
          <rect x="4" y="4" width="8" height="78" rx="2" fill="hsl(18 65% 38%)" />
          {/* Page lines */}
          <line x1="18" y1="24" x2="44" y2="24" stroke="hsl(40 45% 97% / 0.4)" strokeWidth="1" />
          <line x1="18" y1="32" x2="40" y2="32" stroke="hsl(40 45% 97% / 0.4)" strokeWidth="1" />
          <line x1="18" y1="40" x2="42" y2="40" stroke="hsl(40 45% 97% / 0.4)" strokeWidth="1" />
          {/* Title area */}
          <rect x="18" y="50" width="20" height="3" rx="1" fill="hsl(40 45% 97% / 0.5)" />
        </svg>
      </motion.div>

      {/* Book 2 — small, sage */}
      <motion.div
        className="absolute left-[35%] top-[15%]"
        {...floatVariant(1, 12)}
      >
        <svg width="48" height="64" viewBox="0 0 48 64" fill="none">
          <rect x="4" y="4" width="36" height="54" rx="3" fill="hsl(140 20% 55%)" stroke="hsl(25 30% 18%)" strokeWidth="1.5" />
          <rect x="8" y="8" width="28" height="46" rx="2" fill="hsl(140 22% 58%)" />
          <rect x="4" y="4" width="6" height="54" rx="2" fill="hsl(140 20% 45%)" />
          <circle cx="24" cy="30" r="6" stroke="hsl(40 45% 97% / 0.5)" strokeWidth="1" fill="none" />
        </svg>
      </motion.div>

      {/* Coffee cup — center */}
      <motion.div
        className="absolute left-[52%] top-[38%]"
        {...floatVariant(0.5, 6)}
      >
        <svg width="64" height="72" viewBox="0 0 64 72" fill="none">
          {/* Saucer */}
          <ellipse cx="28" cy="62" rx="24" ry="6" fill="hsl(37 35% 82%)" stroke="hsl(25 30% 18%)" strokeWidth="1" />
          {/* Cup body */}
          <path d="M12 30 L16 58 Q28 64 40 58 L44 30 Z" fill="hsl(37 45% 92%)" stroke="hsl(25 30% 18%)" strokeWidth="1.5" />
          {/* Handle */}
          <path d="M44 36 Q56 38 56 46 Q56 54 44 54" stroke="hsl(25 30% 18%)" strokeWidth="1.5" fill="none" />
          {/* Coffee surface */}
          <ellipse cx="28" cy="34" rx="16" ry="4" fill="hsl(28 50% 38%)" />
          {/* Steam 1 */}
          <motion.path
            d="M22 24 Q24 16 22 8"
            stroke="hsl(25 15% 55%)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            initial={{ opacity: 0.2, y: 0 }}
            animate={{ opacity: [0.2, 0.6, 0.2], y: [0, -4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Steam 2 */}
          <motion.path
            d="M28 22 Q30 14 28 6"
            stroke="hsl(25 15% 55%)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            initial={{ opacity: 0.15, y: 0 }}
            animate={{ opacity: [0.15, 0.5, 0.15], y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          {/* Steam 3 */}
          <motion.path
            d="M34 24 Q32 15 34 7"
            stroke="hsl(25 15% 55%)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            initial={{ opacity: 0.1, y: 0 }}
            animate={{ opacity: [0.1, 0.45, 0.1], y: [0, -3, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </svg>
      </motion.div>

      {/* Book 3 — dusty rose, tilted */}
      <motion.div
        className="absolute right-[12%] top-[22%]"
        {...floatVariant(1.5, 9)}
      >
        <svg width="56" height="74" viewBox="0 0 56 74" fill="none" className="rotate-12">
          <rect x="4" y="4" width="42" height="62" rx="3" fill="hsl(350 30% 65%)" stroke="hsl(25 30% 18%)" strokeWidth="1.5" />
          <rect x="8" y="8" width="34" height="54" rx="2" fill="hsl(350 30% 68%)" />
          <rect x="4" y="4" width="7" height="62" rx="2" fill="hsl(350 30% 55%)" />
          {/* Heart doodle */}
          <path d="M22 28 Q22 22 27 22 Q32 22 32 28 Q32 34 27 38 Q22 34 22 28Z" stroke="hsl(40 45% 97% / 0.5)" strokeWidth="1" fill="none" />
        </svg>
      </motion.div>

      {/* Small floating sparkles / stars */}
      <motion.div
        className="absolute left-[28%] top-[8%] font-handwritten text-accent/40 text-lg select-none"
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ✦
      </motion.div>
      <motion.div
        className="absolute right-[28%] top-[55%] font-handwritten text-dusty-rose/30 text-base select-none"
        animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.15, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
      >
        ✧
      </motion.div>
      <motion.div
        className="absolute left-[48%] top-[2%] font-handwritten text-sage/30 text-sm select-none"
        animate={{ opacity: [0.2, 0.5, 0.2], rotate: [0, 15, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.4 }}
      >
        ★
      </motion.div>

      {/* Tiny open book at bottom */}
      <motion.div
        className="absolute left-[22%] bottom-[5%]"
        {...floatVariant(2, 5)}
      >
        <svg width="40" height="28" viewBox="0 0 40 28" fill="none">
          <path d="M2 4 Q2 2 4 2 L18 2 Q20 2 20 4 L20 24 Q18 22 4 22 Q2 22 2 20 Z" fill="hsl(32 70% 55%)" stroke="hsl(25 30% 18%)" strokeWidth="1" />
          <path d="M38 4 Q38 2 36 2 L22 2 Q20 2 20 4 L20 24 Q22 22 36 22 Q38 22 38 20 Z" fill="hsl(32 70% 60%)" stroke="hsl(25 30% 18%)" strokeWidth="1" />
          {/* Page lines */}
          <line x1="6" y1="8" x2="16" y2="8" stroke="hsl(25 30% 18% / 0.2)" strokeWidth="0.5" />
          <line x1="6" y1="12" x2="14" y2="12" stroke="hsl(25 30% 18% / 0.2)" strokeWidth="0.5" />
          <line x1="24" y1="8" x2="34" y2="8" stroke="hsl(25 30% 18% / 0.2)" strokeWidth="0.5" />
          <line x1="24" y1="12" x2="32" y2="12" stroke="hsl(25 30% 18% / 0.2)" strokeWidth="0.5" />
        </svg>
      </motion.div>
    </div>
  );
};

export default FloatingBooksIllustration;
