import { useEffect } from "react";
import { motion } from "framer-motion";
import BrewingCupSVG from "./BrewingCupSVG";

interface BrewingCompleteProps {
  ingredients: string[];
  onComplete: () => void;
}

const BrewingComplete = ({ ingredients, onComplete }: BrewingCompleteProps) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 paper-texture relative overflow-hidden">
      {/* Notebook edges */}
      <div className="fixed left-3 top-0 bottom-0 flex flex-col justify-center gap-8 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-4 h-4 rounded-full border-2 border-border bg-background" />
        ))}
      </div>
      <div className="fixed left-12 top-0 bottom-0 w-px bg-dusty-rose/20 pointer-events-none" />

      {/* Warm glow backdrop */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="w-[400px] h-[400px] rounded-full bg-accent/10 blur-[80px]" />
      </motion.div>

      {/* Journal entry label */}
      <motion.p
        className="font-handwritten text-2xl text-muted-foreground/40 mb-6 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        ~ brewing your story ~
      </motion.p>

      {/* Cup with full brew */}
      <motion.div
        className="w-40 h-40 mb-6 relative z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <BrewingCupSVG fillLevel={1} ingredients={ingredients} />
      </motion.div>

      {/* Swirling steam ring */}
      <motion.div
        className="absolute w-32 h-32 rounded-full border-2 border-accent/20"
        style={{ top: "calc(50% - 120px)" }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.5, 2.5], opacity: [0.4, 0], rotate: 180 }}
        transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
      />
      <motion.div
        className="absolute w-24 h-24 rounded-full border border-primary/15"
        style={{ top: "calc(50% - 110px)" }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.5, 3], opacity: [0.3, 0], rotate: -120 }}
        transition={{ duration: 2.2, delay: 0.8, ease: "easeOut" }}
      />

      {/* Text sequence */}
      <motion.p
        className="text-2xl font-handwritten text-foreground relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -10] }}
        transition={{ duration: 2, times: [0, 0.2, 0.7, 1] }}
      >
        Your brew is ready…
      </motion.p>

      <motion.p
        className="text-lg font-body text-muted-foreground italic relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: [0, 1, 1], y: [10, 0, 0] }}
        transition={{ duration: 1.5, delay: 2 }}
      >
        Let's find your perfect match ✨
      </motion.p>

      {/* Floating ingredients recap */}
      {ingredients.map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl pointer-events-none select-none"
          style={{
            left: `${30 + i * 12}%`,
            top: "55%",
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            y: [0, -80],
            x: [0, (i % 2 === 0 ? 1 : -1) * 20],
          }}
          transition={{ duration: 2, delay: 0.3 + i * 0.3, ease: "easeOut" }}
        >
          {emoji}
        </motion.span>
      ))}

      {/* Decorative */}
      <div className="fixed bottom-6 left-16 text-4xl opacity-20 animate-float select-none">🫖</div>
      <div className="fixed top-10 right-10 text-3xl opacity-15 animate-float select-none" style={{ animationDelay: "1s" }}>🌿</div>
    </div>
  );
};

export default BrewingComplete;
