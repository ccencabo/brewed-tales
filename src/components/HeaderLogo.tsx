import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HeaderLogo = () => {
  return (
    <Link
      to="/"
      className="fixed top-6 left-16 md:left-24 z-50 flex items-center gap-3 group select-none hover:opacity-80 transition-opacity"
    >
      <motion.svg
        viewBox="0 0 64 64"
        className="w-10 h-10 md:w-12 md:h-12 drop-shadow-sm"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        whileHover={{ rotate: -5, scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {/* Book */}
        <rect
          x="8"
          y="44"
          width="48"
          height="12"
          rx="2"
          fill="hsl(18 65% 45%)"
          stroke="hsl(25 30% 18%)"
          strokeWidth="2"
        />
        <rect
          x="8"
          y="44"
          width="6"
          height="12"
          rx="1"
          fill="hsl(18 65% 38%)"
        />
        <line
          x1="18"
          y1="50"
          x2="50"
          y2="50"
          stroke="hsl(40 45% 97% / 0.3)"
          strokeWidth="1"
        />

        {/* Coffee Cup */}
        <path
          d="M24 28 L26 44 Q32 46 38 44 L40 28 Z"
          fill="hsl(37 45% 92%)"
          stroke="hsl(25 30% 18%)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M40 32 Q46 32 46 36 Q46 40 40 40"
          stroke="hsl(25 30% 18%)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Animated Steam */}
        <motion.path
          d="M28 22 Q30 16 26 10"
          stroke="hsl(25 15% 55%)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          animate={{ opacity: [0.2, 0.7, 0.2], y: [0, -3, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M36 20 Q38 14 34 8"
          stroke="hsl(25 15% 55%)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          animate={{ opacity: [0.1, 0.6, 0.1], y: [0, -4, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </motion.svg>

      <span className="font-handwritten text-2xl md:text-3xl text-foreground tracking-wide mt-1">
        Brewed Tales
      </span>
    </Link>
  );
};

export default HeaderLogo;
