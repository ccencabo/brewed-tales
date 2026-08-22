import { motion } from "framer-motion";
import WrappedBookSVG from "./WrappedBookSVG";

interface MysteryBookHeroProps {
  className?: string;
}

const clues = [
  {
    text: "a little mysterious",
    className: "-rotate-1 bg-washi-gold/90",
  },
  {
    text: "warm-hearted",
    className: "rotate-1 bg-washi-pink/90",
  },
  {
    text: "impossible to put down",
    className: "-rotate-[0.5deg] bg-washi-mint/90",
  },
];

const MysteryBookHero = ({ className = "" }: MysteryBookHeroProps) => (
  <motion.aside
    initial={{ opacity: 0, scale: 0.94, rotate: 2 }}
    animate={{ opacity: 1, scale: 1, rotate: 0 }}
    transition={{ delay: 0.15, duration: 0.55 }}
    className={`relative mx-auto w-full max-w-md px-2 pb-4 sm:px-3 lg:px-6 ${className}`}
  >
    <div className="pointer-events-none absolute bottom-24 left-8 top-12 w-44 rounded-full bg-washi-mint/20 blur-3xl" />
    <div className="relative mx-auto grid min-h-[280px] max-w-md grid-cols-[minmax(115px,0.85fr)_minmax(135px,1fr)] items-center gap-3 py-4 lg:grid-cols-[minmax(130px,0.85fr)_minmax(150px,1fr)]">
      <motion.div
        animate={{ y: [0, -5, 0], rotate: [-4, -2, -4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 flex justify-center"
      >
        <WrappedBookSVG
          color="bg-primary"
          emoji="📖"
          className="h-52 w-36 drop-shadow-lg lg:h-60 lg:w-40"
        />
      </motion.div>

      <div className="relative z-20 space-y-3">
        {clues.map((clue, index) => (
          <div
            key={clue.text}
            className={`rounded-sm border border-dashed border-border px-3 py-2 shadow-sticker ${clue.className}`}
          >
            <p className="font-handwritten text-xs uppercase tracking-widest text-muted-foreground">
              clue no. {index + 1}
            </p>
            <p className="font-handwritten text-xl leading-tight text-foreground">
              {clue.text}
            </p>
          </div>
        ))}
      </div>
    </div>

    <div className="relative mx-auto max-w-sm rotate-1 rounded-sm border border-dashed border-border bg-secondary/80 px-5 py-4 text-center shadow-journal">
      <div className="absolute -top-3 left-1/2 h-5 w-24 -translate-x-1/2 -rotate-2 rounded-sm bg-washi-pink/65" />
      <p className="font-handwritten text-sm uppercase tracking-[0.2em] text-primary">
        Today&apos;s reading note
      </p>
      <p className="mt-1 font-display text-xl italic text-foreground">
        “Let the mood choose the book.”
      </p>
    </div>
  </motion.aside>
);

export default MysteryBookHero;
