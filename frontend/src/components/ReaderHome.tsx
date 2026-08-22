import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowRightLeft,
  BookHeart,
  Coffee,
  LibraryBig,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { AuthUser } from "../lib/auth";
import MysteryBookHero from "./MysteryBookHero";

interface ReaderHomeProps {
  user: AuthUser;
  onStart: () => void;
}

const dashboardLinks = [
  {
    to: "/community",
    title: "Shelf Match",
    description: "Trade stories with another reader from the community shelf.",
    note: "meet your next book",
    icon: BookHeart,
    tape: "bg-washi-pink/60",
    tilt: "sm:-rotate-1",
  },
  {
    to: "/library",
    title: "My Library",
    description: "Return to the recommendations and matches you saved.",
    note: "open your collection",
    icon: LibraryBig,
    tape: "bg-washi-mint/60",
    tilt: "sm:rotate-1",
  },
  {
    to: "/exchanges",
    title: "My Exchanges",
    description: "Check requests, arrange a handoff, and finish your swaps.",
    note: "see what needs you",
    icon: ArrowRightLeft,
    tape: "bg-washi-gold/60",
    tilt: "sm:-rotate-[0.5deg]",
  },
];

const ReaderHome = ({ user, onStart }: ReaderHomeProps) => {
  const firstName = user.displayName.trim().split(/\s+/)[0] || "reader";

  return (
    <div className="paper-texture relative min-h-screen overflow-hidden px-4 pb-28 pt-36 sm:px-8 sm:pb-16 sm:pt-40">
      <div className="pointer-events-none fixed bottom-0 left-3 top-0 hidden flex-col justify-center gap-8 sm:flex">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="h-4 w-4 rounded-full border-2 border-border bg-background"
          />
        ))}
      </div>
      <div className="pointer-events-none fixed bottom-0 left-12 top-0 hidden w-px bg-dusty-rose/20 sm:block" />

      <main className="relative mx-auto max-w-6xl sm:pl-8">
        <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="mb-4 inline-flex -rotate-1 items-center gap-2 rounded-sm bg-washi-gold/40 px-4 py-1 font-handwritten text-lg text-foreground">
              <Coffee className="h-4 w-4" /> your private reading room
            </div>
            <p className="font-handwritten text-2xl text-primary">
              Welcome back, {firstName}.
            </p>
            <h1 className="mt-2 max-w-2xl -rotate-[0.5deg] font-handwritten text-5xl font-semibold leading-[0.98] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              What kind of story are you craving today?
            </h1>
            <div className="journal-divider my-5 max-w-lg" />
            <p className="max-w-xl font-body text-base leading-relaxed text-muted-foreground sm:text-lg">
              Start a fresh book date, revisit a saved favorite, or see which
              reader is waiting on the other side of the shelf.
            </p>
            <motion.button
              type="button"
              onClick={onStart}
              whileHover={{ scale: 1.03, rotate: -1 }}
              whileTap={{ scale: 0.98 }}
              className="mt-7 inline-flex items-center gap-2 rounded-sm border border-primary/20 bg-primary px-6 py-3 font-handwritten text-2xl text-primary-foreground shadow-journal transition hover:shadow-warm"
            >
              <Sparkles className="h-5 w-5" /> Brew a new recommendation
            </motion.button>
          </motion.div>

          <MysteryBookHero />
        </section>

        <section className="mt-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="font-handwritten text-lg text-primary">your shortcuts</p>
              <h2 className="font-display text-3xl text-foreground">Continue your story</h2>
            </div>
            <span className="hidden font-handwritten text-lg text-muted-foreground sm:block">
              pick a page →
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {dashboardLinks.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + index * 0.08 }}
                  className={item.tilt}
                >
                  <Link
                    to={item.to}
                    className="group relative block h-full rounded-sm border border-border bg-card/90 p-6 shadow-journal transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-warm"
                  >
                    <div
                      className={`absolute -top-2 left-6 h-5 w-16 -rotate-3 rounded-sm ${item.tape}`}
                    />
                    <div className="mb-4 flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-dashed border-primary/40 bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <ArrowRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                    <h3 className="font-handwritten text-3xl text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 min-h-12 font-body text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="mt-4 font-handwritten text-lg text-primary">
                      {item.note}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ReaderHome;
