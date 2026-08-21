import { motion } from "framer-motion";

interface WrappedBookSVGProps {
  color: string;
  emoji: string;
  className?: string;
}

const WrappedBookSVG = ({ color, emoji, className = "" }: WrappedBookSVGProps) => {
  const colorMap: Record<string, string> = {
    "bg-primary": "hsl(18 65% 45%)",
    "bg-sage": "hsl(140 20% 55%)",
    "bg-dusty-rose": "hsl(350 30% 65%)",
    "bg-accent": "hsl(32 70% 55%)",
    "bg-warm": "hsl(28 55% 40%)",
  };

  const fill = colorMap[color] || "hsl(18 65% 45%)";

  return (
    <motion.svg
      viewBox="0 0 160 220"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      whileHover={{ scale: 1.05, rotate: 2 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Book body */}
      <rect x="20" y="10" width="120" height="200" rx="4" fill={fill} />
      <rect x="20" y="10" width="12" height="200" rx="2" fill="hsl(25 30% 18% / 0.2)" />
      
      {/* Wrapping paper pattern - diagonal stripes */}
      <g opacity="0.15">
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1={20 + i * 20}
            y1="10"
            x2={20 + i * 20 - 60}
            y2="210"
            stroke="hsl(37 40% 96%)"
            strokeWidth="3"
          />
        ))}
      </g>
      
      {/* Ribbon horizontal */}
      <rect x="20" y="100" width="120" height="12" fill="hsl(37 40% 96%)" opacity="0.6" />
      {/* Ribbon vertical */}
      <rect x="74" y="10" width="12" height="200" fill="hsl(37 40% 96%)" opacity="0.6" />
      
      {/* Bow */}
      <ellipse cx="80" cy="100" rx="18" ry="10" fill="hsl(37 40% 96%)" opacity="0.8" />
      <ellipse cx="68" cy="94" rx="10" ry="6" fill="hsl(37 40% 96%)" opacity="0.7" transform="rotate(-20 68 94)" />
      <ellipse cx="92" cy="94" rx="10" ry="6" fill="hsl(37 40% 96%)" opacity="0.7" transform="rotate(20 92 94)" />
      
      {/* Question mark or emoji area */}
      <text x="80" y="170" textAnchor="middle" fontSize="36">{emoji}</text>

      {/* "?" label */}
      <text x="80" y="60" textAnchor="middle" fontSize="28" fill="hsl(37 40% 96%)" fontFamily="serif" fontWeight="bold" opacity="0.8">?</text>
    </motion.svg>
  );
};

export default WrappedBookSVG;
