import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import BookStackCoffee from "./BookStackCoffee";
import Navbar from "./Navbar";

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  return (
    <div className="paper-texture relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden px-4 pb-32 pt-28 sm:py-24">
      {/* Universal Navbar */}
      <Navbar />

      {/* Notebook spiral holes along the left */}
      <div className="fixed left-3 top-0 bottom-0 flex flex-col justify-center gap-8 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full border-2 border-border bg-background"
          />
        ))}
      </div>

      {/* Margin line */}
      <div className="fixed left-12 top-0 bottom-0 w-px bg-dusty-rose/20 pointer-events-none" />

      {/* Floating journal doodles */}
      <motion.div
        className="fixed bottom-16 right-8 font-handwritten text-xl text-muted-foreground/20 select-none rotate-3"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      >
        ~ chapter one ~
      </motion.div>

      {/* Coffee stain */}
      <div className="fixed top-20 right-20 w-24 h-24 rounded-full border-[3px] border-coffee-stain/10 pointer-events-none" />
      <div className="fixed top-22 right-22 w-20 h-20 rounded-full border border-coffee-stain/5 pointer-events-none" />

      {/* Washi tape strips (background elements) */}
      <div className="fixed bottom-12 left-20 w-20 h-5 bg-washi-mint/25 rotate-6 pointer-events-none rounded-sm" />
      <div className="fixed top-1/4 left-8 w-16 h-5 bg-washi-gold/20 -rotate-3 pointer-events-none rounded-sm" />

      {/* Floating emojis */}
      <div
        className="fixed top-24 right-16 text-2xl opacity-10 animate-float select-none"
        style={{ animationDelay: "1s" }}
      >
        🌸
      </div>
      <div
        className="fixed bottom-16 left-16 text-4xl opacity-15 animate-float select-none"
        style={{ animationDelay: "2s" }}
      >
        🕯️
      </div>
      <div
        className="fixed bottom-28 right-12 text-2xl opacity-10 animate-float select-none"
        style={{ animationDelay: "0.5s" }}
      >
        ☕
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-lg relative"
      >
        {/* Bookshop illustration in a "taped" frame */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative"
        >
          <div className="mx-auto max-w-[320px] md:max-w-[400px]">
            <BookStackCoffee />
          </div>
        </motion.div>

        <div className="mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-5xl md:text-7xl font-handwritten text-foreground mb-1"
          >
            Brewed Tales
          </motion.h1>

          {/* Hand-drawn underline */}
          <motion.svg
            viewBox="0 0 200 8"
            className="w-48 mx-auto"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <motion.path
              d="M5 4 Q50 0 100 5 Q150 8 195 3"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            />
          </motion.svg>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="text-xl md:text-2xl font-handwritten text-primary mt-2 tracking-wide"
          >
            ✦ Personal book recommendations ✦
          </motion.p>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-base text-muted-foreground font-body mb-8 leading-relaxed italic"
        >
          Not sure what to read next? Answer a few cozy questions and
          <br />get recommendations picked for your reading mood.
        </motion.p>

        {/* Journal-style CTA button */}
        <div className="flex items-center justify-center">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.4 }}
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={onStart}
            className="px-8 py-3 rounded-md bg-primary text-primary-foreground font-handwritten text-2xl
              shadow-journal hover:shadow-warm transition-all duration-200 border border-primary/20"
          >
            Find My Next Read ☕
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.05 }}
          className="mx-auto mt-5 max-w-sm rounded-sm border border-dashed border-border bg-card/55 px-4 py-3"
        >
          <p className="font-body text-xs italic text-muted-foreground">
            Want a book from another reader instead?
          </p>
          <Link
            to="/community"
            className="font-handwritten text-xl text-primary underline decoration-dashed underline-offset-4 transition hover:text-accent"
          >
            Find a Community Shelf Match →
          </Link>
        </motion.div>

        {/* Small handwritten note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 font-handwritten text-lg text-muted-foreground/50 rotate-1"
        >
          (psst… it only takes 2 minutes!)
        </motion.p>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
