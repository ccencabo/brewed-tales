import { motion } from "framer-motion";
import { ReactNode } from "react";

interface IngredientSVGProps {
  type: "herb" | "spice" | "flower" | "crystal" | "drop";
  className?: string;
}

const ingredients: Record<string, ReactNode> = {
  herb: (
    <g>
      <path d="M12 22 Q12 14, 8 8 Q14 12, 12 6 Q10 12, 16 8 Q12 14, 12 22" fill="hsl(140, 20%, 55%)" />
      <line x1="12" y1="22" x2="12" y2="6" stroke="hsl(140, 25%, 40%)" strokeWidth="0.8" />
    </g>
  ),
  spice: (
    <g>
      <circle cx="12" cy="12" r="4" fill="hsl(18, 65%, 45%)" />
      <circle cx="12" cy="12" r="2" fill="hsl(18, 70%, 55%)" />
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <circle
          key={angle}
          cx={12 + Math.cos((angle * Math.PI) / 180) * 6}
          cy={12 + Math.sin((angle * Math.PI) / 180) * 6}
          r="1.5"
          fill="hsl(18, 60%, 50%)"
        />
      ))}
    </g>
  ),
  flower: (
    <g>
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx={12 + Math.cos((angle * Math.PI) / 180) * 5}
          cy={12 + Math.sin((angle * Math.PI) / 180) * 5}
          rx="3"
          ry="4.5"
          fill="hsl(350, 30%, 65%)"
          transform={`rotate(${angle}, ${12 + Math.cos((angle * Math.PI) / 180) * 5}, ${12 + Math.sin((angle * Math.PI) / 180) * 5})`}
        />
      ))}
      <circle cx="12" cy="12" r="3" fill="hsl(40, 70%, 65%)" />
    </g>
  ),
  crystal: (
    <g>
      <polygon points="12,3 16,10 14,18 10,18 8,10" fill="hsl(280, 20%, 70%)" opacity="0.8" />
      <polygon points="12,5 14,10 13,16 11,16 10,10" fill="hsl(280, 25%, 80%)" opacity="0.6" />
    </g>
  ),
  drop: (
    <g>
      <path d="M12 4 Q8 12, 8 16 Q8 20, 12 20 Q16 20, 16 16 Q16 12, 12 4" fill="hsl(200, 40%, 65%)" />
      <ellipse cx="10.5" cy="14" rx="1.5" ry="2" fill="hsl(200, 45%, 75%)" opacity="0.6" />
    </g>
  ),
};

const IngredientSVG = ({ type, className = "" }: IngredientSVGProps) => {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className={className}
      initial={{ scale: 0, rotate: -30 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 12 }}
    >
      {ingredients[type]}
    </motion.svg>
  );
};

export default IngredientSVG;
