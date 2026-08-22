import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BrewingCupSVG from "./BrewingCupSVG";

interface QuizQuestion {
  id: string;
  question: string;
  subtitle: string;
  brewingLabel: string;
  options: { label: string; value: string; emoji: string; ingredientLabel: string }[];
}

const questions: QuizQuestion[] = [
  {
    id: "genre",
    question: "What shall we steep first?",
    subtitle: "Pick the heart of your brew",
    brewingLabel: "Choosing the base blend…",
    options: [
      { label: "Enchanted realms & magic", value: "fantasy", emoji: "✨", ingredientLabel: "Moonpetal leaves" },
      { label: "Love stories & butterflies", value: "romance", emoji: "💕", ingredientLabel: "Rose honey" },
      { label: "Puzzles & dark secrets", value: "mystery", emoji: "🕵️", ingredientLabel: "Midnight bark" },
      { label: "Stars & distant futures", value: "scifi", emoji: "🌌", ingredientLabel: "Stardust powder" },
    ],
  },
  {
    id: "pacing",
    question: "How long should it brew?",
    subtitle: "Set the rhythm of your read",
    brewingLabel: "Setting the timer…",
    options: [
      { label: "Quick sips — fast-paced!", value: "fast", emoji: "⚡", ingredientLabel: "A quick dash" },
      { label: "A leisurely steep — slow burn", value: "slow", emoji: "🍵", ingredientLabel: "A patient pour" },
      { label: "Somewhere in between", value: "medium", emoji: "☕", ingredientLabel: "A gentle swirl" },
    ],
  },
  {
    id: "priority",
    question: "Add a special ingredient?",
    subtitle: "What makes a story unforgettable for you",
    brewingLabel: "Adding flavor…",
    options: [
      { label: "Twists I never see coming", value: "plot", emoji: "🎢", ingredientLabel: "Wild ginger root" },
      { label: "Characters who feel like friends", value: "characters", emoji: "🫂", ingredientLabel: "Chamomile hearts" },
      { label: "Beautiful, poetic writing", value: "literary", emoji: "🪶", ingredientLabel: "Lavender ink" },
    ],
  },
  {
    id: "era",
    question: "How aged should the pages feel?",
    subtitle: "Choose the publication era for your matches",
    brewingLabel: "Checking the library date…",
    options: [
      {
        label: "Classics — before 2000",
        value: "classic",
        emoji: "⌛",
        ingredientLabel: "Aged parchment",
      },
      {
        label: "Newer stories — 2000 onward",
        value: "recent",
        emoji: "🌱",
        ingredientLabel: "Fresh-cut pages",
      },
      {
        label: "A blend of both — any era",
        value: "any",
        emoji: "📚",
        ingredientLabel: "A timeless blend",
      },
    ],
  },
  {
    id: "mood",
    question: "One last drop for the mood?",
    subtitle: "How do you want to feel?",
    brewingLabel: "Final touch…",
    options: [
      { label: "A warm hug in book form", value: "comfort", emoji: "🧸", ingredientLabel: "Warm vanilla cream" },
      { label: "An escape to another world", value: "escape", emoji: "🚪", ingredientLabel: "Misty fog essence" },
      { label: "Something to challenge my mind", value: "challenge", emoji: "🧩", ingredientLabel: "Smoked peppercorn" },
    ],
  },
];

interface QuizScreenProps {
  onComplete: (answers: Record<string, string>, ingredients: string[]) => void;
}

const washiColors = [
  "bg-washi-pink/30",
  "bg-washi-mint/30",
  "bg-washi-gold/30",
  "bg-washi-pink/20",
];

const cardRotations = ["-rotate-1", "rotate-1", "-rotate-[0.5deg]", "rotate-[0.5deg]"];

const QuizScreen = ({ onComplete }: QuizScreenProps) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [chosenIngredients, setChosenIngredients] = useState<string[]>([]);
  const [direction, setDirection] = useState(1);
  const [isPouring, setIsPouring] = useState(false);

  const question = questions[currentQ];
  const fillLevel = currentQ / questions.length;
  const isWideGrid = question.options.length === 4;

  const handleSelect = (value: string, emoji: string) => {
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);
    setChosenIngredients((prev) => [...prev, emoji]);
    setDirection(1);
    setIsPouring(true);

    setTimeout(() => {
      setIsPouring(false);
      if (currentQ < questions.length - 1) {
        setCurrentQ((prev) => prev + 1);
      } else {
        onComplete(newAnswers, [...chosenIngredients, emoji]);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pb-24 pt-32 paper-texture relative overflow-hidden">
      {/* Notebook spiral holes */}
      <div className="fixed left-3 top-0 bottom-0 flex flex-col justify-center gap-8 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-4 h-4 rounded-full border-2 border-border bg-background" />
        ))}
      </div>
      <div className="fixed left-12 top-0 bottom-0 w-px bg-dusty-rose/20 pointer-events-none" />

      {/* Washi tape decorations */}
      <div className="fixed top-6 right-16 w-20 h-5 bg-washi-gold/25 -rotate-6 pointer-events-none rounded-sm" />
      <div className="fixed bottom-10 left-24 w-16 h-5 bg-washi-mint/20 rotate-3 pointer-events-none rounded-sm" />

      {/* Ambient particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed w-1.5 h-1.5 rounded-full bg-accent/20"
          style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={{ y: [0, -20, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}

      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* Page number */}
        <motion.p
          className="font-handwritten text-lg text-muted-foreground/40 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          page {currentQ + 1} of {questions.length}
        </motion.p>

        {/* Brewing cup */}
        <motion.div
          className="w-28 h-28 mb-4"
          animate={isPouring ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.4 }}
        >
          <BrewingCupSVG fillLevel={fillLevel} ingredients={chosenIngredients} />
        </motion.div>

        {/* Step dots as journal bullets */}
        <div className="flex gap-3 mb-8">
          {questions.map((_, i) => (
            <motion.div
              key={i}
              className={`w-3 h-3 rounded-full border-2 transition-colors duration-300 ${
                i < currentQ
                  ? "bg-primary border-primary"
                  : i === currentQ
                  ? "bg-accent border-accent"
                  : "bg-transparent border-border"
              }`}
              animate={i === currentQ ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
          ))}
        </div>

        {/* Question + Options */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={question.id}
            custom={direction}
            initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="w-full flex flex-col items-center"
          >
            {/* Brewing label */}
            <motion.p
              className="text-sm font-handwritten tracking-wider text-muted-foreground mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              ~ {question.brewingLabel} ~
            </motion.p>

            <h2 className="text-3xl md:text-4xl font-handwritten text-center text-foreground mb-1">
              {question.question}
            </h2>
            <p className="text-sm text-muted-foreground font-body italic mb-8">
              {question.subtitle}
            </p>

            {/* Journal-style option cards */}
            <div className={`grid gap-5 w-full ${isWideGrid ? "grid-cols-2" : "grid-cols-3"}`}>
              {question.options.map((option, i) => (
                <motion.button
                  key={option.value}
                  initial={{ opacity: 0, scale: 0.85, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.4, type: "spring", stiffness: 200 }}
                  onClick={() => handleSelect(option.value, option.emoji)}
                  disabled={isPouring}
                  className={`relative group flex flex-col items-center justify-center gap-3
                    p-5 bg-card border-2 border-border/60 shadow-journal
                    ${cardRotations[i % cardRotations.length]}
                    disabled:opacity-50 disabled:cursor-not-allowed
                    hover:shadow-warm hover:-translate-y-1 hover:rotate-0
                    active:scale-95
                    transition-all duration-250 cursor-pointer rounded-sm dog-ear`}
                >
                  {/* Washi tape top */}
                  <div className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-14 h-5 rounded-sm ${washiColors[i % washiColors.length]} pointer-events-none`} />

                  {/* Emoji */}
                  <motion.span
                    className="text-4xl md:text-5xl block mt-2"
                    whileHover={{ scale: 1.2, rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    {option.emoji}
                  </motion.span>

                  {/* Label */}
                  <span className="font-handwritten text-xl md:text-2xl text-foreground text-center leading-snug">
                    {option.label}
                  </span>

                  {/* Ingredient tag */}
                  <span className="text-xs text-muted-foreground font-body italic
                    border-b border-dashed border-border pb-0.5">
                    + {option.ingredientLabel}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Pouring animation */}
        <AnimatePresence>
          {isPouring && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-5xl"
                initial={{ y: -60, opacity: 0, scale: 0.5 }}
                animate={{ y: 60, opacity: [0, 1, 1, 0], scale: [0.5, 1.3, 1, 0.8] }}
                transition={{ duration: 0.7, ease: "easeIn" }}
              >
                {chosenIngredients[chosenIngredients.length - 1]}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative doodles */}
      <div className="fixed bottom-6 left-16 text-4xl opacity-20 animate-float select-none">🫖</div>
      <div className="fixed top-10 right-10 text-3xl opacity-15 animate-float select-none" style={{ animationDelay: "1s" }}>🌿</div>
      <div className="fixed bottom-20 right-8 text-2xl opacity-15 animate-float select-none" style={{ animationDelay: "2s" }}>🍯</div>

      {/* Handwritten corner note */}
      <motion.p
        className="fixed bottom-4 right-4 font-handwritten text-base text-muted-foreground/30 rotate-2 select-none"
        animate={{ opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        keep going… ♡
      </motion.p>
    </div>
  );
};

export default QuizScreen;
