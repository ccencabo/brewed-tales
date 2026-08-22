import { motion } from "framer-motion";
import {
  ArrowRight,
  BookHeart,
  BookmarkPlus,
  LibraryBig,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import WrappedBookSVG from "./WrappedBookSVG";

interface WelcomeScreenProps {
  onStart: () => void;
}

const features = [
  {
    icon: Sparkles,
    title: "Match your mood",
    description: "A few cozy questions turn your current mood into book matches.",
    color: "bg-washi-gold/55",
    tilt: "sm:-rotate-1",
  },
  {
    icon: BookmarkPlus,
    title: "Keep the good ones",
    description: "Save recommendations to a personal library you can return to.",
    color: "bg-washi-mint/55",
    tilt: "sm:rotate-1",
  },
  {
    icon: Users,
    title: "Meet another shelf",
    description: "Find wrapped books from readers and arrange a real exchange.",
    color: "bg-washi-pink/55",
    tilt: "sm:-rotate-[0.5deg]",
  },
];

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
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
        <section className="grid items-start gap-16 sm:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)] sm:gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-5 inline-flex -rotate-1 items-center gap-2 rounded-sm bg-washi-pink/45 px-4 py-1 font-handwritten text-lg text-foreground">
              <BookHeart className="h-4 w-4" /> a blind date with your next book
            </div>

            <h1 className="max-w-3xl font-handwritten text-5xl font-semibold leading-[0.98] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Meet your next favorite story, one clue at a time.
            </h1>
            <div className="journal-divider my-6 max-w-xl" />
            <p className="max-w-2xl font-body text-base leading-relaxed text-muted-foreground sm:text-lg">
              Brewed Tales turns your reading mood into a small collection of
              mystery matches. Peek at the clues, unwrap the right one, and keep
              the stories that feel like you.
            </p>

            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <motion.button
                type="button"
                onClick={onStart}
                whileHover={{ scale: 1.03, rotate: -1 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-sm border border-primary/20 bg-primary px-6 py-3 font-handwritten text-2xl text-primary-foreground shadow-journal transition hover:shadow-warm"
              >
                Find my next read <ArrowRight className="h-5 w-5" />
              </motion.button>

              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-2 py-2 font-handwritten text-xl text-primary underline decoration-dashed underline-offset-4 transition hover:text-accent"
              >
                Issue a library card
              </Link>
            </div>

            <p className="mt-4 font-handwritten text-lg text-muted-foreground">
              Explore recommendations first—create your card when you want to save one.
            </p>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 1 }}
            transition={{ delay: 0.15, duration: 0.55 }}
            className="relative mx-auto w-full max-w-lg self-start rounded-sm border border-dashed border-border bg-secondary/65 p-6 shadow-journal sm:ml-auto sm:mr-0 sm:p-5 lg:p-8"
          >
            <div className="absolute -top-3 left-1/2 h-6 w-28 -translate-x-1/2 -rotate-2 rounded-sm bg-washi-gold/70" />

            <div className="mb-5 flex items-end justify-between gap-4 border-b border-dashed border-border pb-4">
              <div>
                <p className="font-handwritten text-sm uppercase tracking-[0.2em] text-primary">
                  your mystery match
                </p>
                <h2 className="font-handwritten text-3xl text-foreground">
                  Wrapped with clues
                </h2>
              </div>
              <span className="rounded-full border border-dashed border-primary/40 bg-background/60 px-3 py-1 font-handwritten text-lg text-primary">
                2 min
              </span>
            </div>

            <div className="grid grid-cols-[105px_1fr] items-center gap-3 sm:grid-cols-[125px_1fr] lg:grid-cols-[155px_1fr] lg:gap-5">
              <WrappedBookSVG
                color="bg-dusty-rose"
                emoji="✨"
                className="h-44 w-28 drop-shadow-lg lg:h-60 lg:w-40"
              />

              <div className="space-y-3">
                {[
                  "Tell us your reading mood",
                  "Peek at three mystery matches",
                  "Unwrap the story that calls to you",
                ].map((step, index) => (
                  <div key={step} className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-background/70 font-handwritten text-lg text-primary">
                      {index + 1}
                    </span>
                    <p className="pt-0.5 font-handwritten text-xl leading-tight text-foreground">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-sm border border-dashed border-border bg-background/55 px-4 py-3 text-center">
              <p className="font-handwritten text-lg text-muted-foreground">
                No spoilers—just enough clues to make choosing fun.
              </p>
            </div>
          </motion.aside>
        </section>

        <section className="mt-16">
          <div className="mb-6 text-center">
            <p className="font-handwritten text-lg text-primary">
              more than a recommendation
            </p>
            <h2 className="font-handwritten text-4xl font-semibold text-foreground sm:text-5xl">
              A cozy home for your reading life
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28 + index * 0.08 }}
                  className={`relative rounded-sm border border-border bg-card/85 p-6 shadow-journal ${feature.tilt}`}
                >
                  <div
                    className={`absolute -top-2 left-6 h-5 w-16 -rotate-3 rounded-sm ${feature.color}`}
                  />
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-dashed border-primary/40 bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-handwritten text-3xl text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.article>
              );
            })}
          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-5 rounded-sm border border-dashed border-primary/25 bg-primary/5 px-6 py-7 text-center sm:mt-20 sm:flex-row sm:text-left">
            <div className="flex items-center gap-4">
              <LibraryBig className="hidden h-8 w-8 text-primary sm:block" />
              <div>
                <p className="font-handwritten text-2xl text-foreground">
                  Ready to start your reading journal?
                </p>
                <p className="font-body text-sm text-muted-foreground">
                  Your library card unlocks saved books, Shelf Match, and exchanges.
                </p>
              </div>
            </div>
            <Link
              to="/signup"
              className="shrink-0 rounded-sm border border-primary px-5 py-2 font-handwritten text-xl text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              Join Brewed Tales
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default WelcomeScreen;
