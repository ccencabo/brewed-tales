import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, RefreshCw, Users, X } from "lucide-react";
import WrappedBookSVG from "./WrappedBookSVG";

export interface ShelfMatchListing {
  id: string;
  cover_color: string;
  emoji: string;
  hook1: string;
  hook2: string;
  hook3: string;
  publication_year: number | null;
  ingredients: string[];
  status: string;
  owner_name?: string;
  match_tags: string[];
}

interface CommunityMatchFinderProps {
  listings: ShelfMatchListing[];
  onClose: () => void;
  onMatch: (listing: ShelfMatchListing) => void;
}

interface MatchQuestion {
  id: string;
  eyebrow: string;
  question: string;
  options: Array<{ label: string; note: string; emoji: string; tags: string[] }>;
}

const questions: MatchQuestion[] = [
  {
    id: "mood",
    eyebrow: "First sip",
    question: "What kind of reading mood are you bringing?",
    options: [
      { label: "Cozy & tender", note: "A soft place to land", emoji: "🧸", tags: ["cozy", "romance", "heartfelt"] },
      { label: "Tense & curious", note: "Give me secrets to unravel", emoji: "🔎", tags: ["mystery", "tense", "secrets"] },
      { label: "Wild & wondrous", note: "Take me somewhere impossible", emoji: "✨", tags: ["fantasy", "adventure", "escape"] },
    ],
  },
  {
    id: "pace",
    eyebrow: "Second sip",
    question: "How should this story move?",
    options: [
      { label: "Quick & clever", note: "Short chapters, sharp turns", emoji: "⚡", tags: ["fast", "witty"] },
      { label: "Slow & immersive", note: "Let the atmosphere linger", emoji: "🌙", tags: ["atmospheric", "slow-burn"] },
      { label: "Character-led", note: "I want people to root for", emoji: "💛", tags: ["character", "heartfelt"] },
    ],
  },
  {
    id: "era",
    eyebrow: "Third sip",
    question: "When should this story come from?",
    options: [
      {
        label: "A classic",
        note: "Published before 2000",
        emoji: "⌛",
        tags: ["era:classic"],
      },
      {
        label: "Something newer",
        note: "Published from 2000 onward",
        emoji: "🌱",
        tags: ["era:recent"],
      },
      {
        label: "Either era",
        note: "Let the shelf surprise me",
        emoji: "📚",
        tags: ["era:any"],
      },
    ],
  },
  {
    id: "spark",
    eyebrow: "Final note",
    question: "What would make the match feel just right?",
    options: [
      { label: "A warm glow", note: "Comforting and hopeful", emoji: "☕", tags: ["cozy", "hopeful"] },
      { label: "A big surprise", note: "I want an audible gasp", emoji: "🎭", tags: ["twisty", "secrets"] },
      { label: "A total escape", note: "New worlds, please", emoji: "🚪", tags: ["escape", "adventure"] },
    ],
  },
];

const CommunityMatchFinder = ({ listings, onClose, onMatch }: CommunityMatchFinderProps) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[][]>([]);
  const [showResult, setShowResult] = useState(false);
  const [resultOffset, setResultOffset] = useState(0);

  const rankedListings = useMemo(() => {
    const selectedTags = answers.flat();
    const eraPreference = selectedTags
      .find((tag) => tag.startsWith("era:"))
      ?.slice("era:".length);
    const preferenceTags = selectedTags.filter(
      (tag) => !tag.startsWith("era:"),
    );

    return [...listings]
      .filter((listing) => {
        if (listing.status !== "available") return false;
        if (!eraPreference || eraPreference === "any") return true;
        if (listing.publication_year === null) return true;
        return eraPreference === "classic"
          ? listing.publication_year < 2000
          : listing.publication_year >= 2000;
      })
      .map((listing, index) => ({
        listing,
        index,
        score:
          listing.match_tags.reduce(
            (total, tag) => total + (preferenceTags.includes(tag) ? 1 : 0),
            0,
          ) +
          (eraPreference &&
          eraPreference !== "any" &&
          listing.publication_year !== null
            ? 2
            : 0),
      }))
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .map(({ listing }) => listing);
  }, [answers, listings]);

  const result = rankedListings[resultOffset % Math.max(rankedListings.length, 1)];
  const question = questions[step];

  const chooseAnswer = (tags: string[]) => {
    const nextAnswers = [...answers.slice(0, step), tags];
    setAnswers(nextAnswers);

    if (step === questions.length - 1) {
      setShowResult(true);
      return;
    }

    setStep((current) => current + 1);
  };

  const goBack = () => {
    if (showResult) {
      setShowResult(false);
      setStep(questions.length - 1);
      return;
    }

    if (step === 0) {
      onClose();
      return;
    }

    setAnswers((current) => current.slice(0, -1));
    setStep((current) => current - 1);
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shelf-match-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] overflow-y-auto bg-foreground/45 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center py-6">
        <motion.section
          initial={{ opacity: 0, y: 18, rotate: -0.5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, y: 12 }}
          onClick={(event) => event.stopPropagation()}
          className="dog-ear relative w-full max-w-3xl rounded-sm border border-border bg-card p-5 shadow-warm sm:p-8"
        >
          <div className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-2 rounded-sm bg-washi-mint/70" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shelf matcher"
            className="absolute right-4 top-4 rounded-full border border-border bg-background/80 p-2 text-muted-foreground transition hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="mb-6 pr-10">
            <div className="mb-2 flex items-center gap-2 font-handwritten text-lg text-primary">
              <Users className="h-4 w-4" />
              Community Shelf Match
            </div>
            <h2 id="shelf-match-title" className="font-handwritten text-3xl text-foreground sm:text-4xl">
              {showResult ? "A fellow reader wrapped this for you" : "Match with a shared book"}
            </h2>
            <p className="mt-1 max-w-2xl font-body text-sm italic text-muted-foreground sm:text-base">
              {showResult
                ? "This match comes from the community shelf—not the book recommendation quiz."
                : "Three quick choices will pair you with a book another reader is ready to share."}
            </p>
          </div>

          {!showResult ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={question.id}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6 flex items-center gap-3" aria-label={`Step ${step + 1} of ${questions.length}`}>
                  {questions.map((item, index) => (
                    <div key={item.id} className="flex flex-1 items-center gap-2">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-handwritten text-sm ${
                          index < step
                            ? "border-primary bg-primary text-primary-foreground"
                            : index === step
                              ? "border-accent bg-accent text-accent-foreground"
                              : "border-border bg-background text-muted-foreground"
                        }`}
                      >
                        {index < step ? <Check className="h-3.5 w-3.5" /> : index + 1}
                      </span>
                      {index < questions.length - 1 && <span className="h-px flex-1 bg-border" />}
                    </div>
                  ))}
                </div>

                <p className="font-handwritten text-base text-muted-foreground">~ {question.eyebrow} ~</p>
                <h3 className="mb-5 mt-1 font-display text-2xl text-foreground sm:text-3xl">{question.question}</h3>

                <div className="grid gap-3 sm:grid-cols-3">
                  {question.options.map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => chooseAnswer(option.tags)}
                      className="group rounded-sm border-2 border-border/70 bg-background/70 p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-journal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <span className="mb-3 block text-3xl" aria-hidden="true">{option.emoji}</span>
                      <span className="block font-handwritten text-xl text-foreground group-hover:text-primary">{option.label}</span>
                      <span className="mt-1 block font-body text-xs italic text-muted-foreground">{option.note}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : result ? (
            <div className="grid items-center gap-7 sm:grid-cols-[200px_1fr]">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute -left-3 -top-3 h-7 w-20 -rotate-6 rounded-sm bg-washi-pink/60" />
                  <WrappedBookSVG
                    color={result.cover_color}
                    emoji={result.emoji}
                    className="h-64 w-44 drop-shadow-lg"
                  />
                </div>
              </div>
              <div>
                <p className="font-handwritten text-lg text-primary">Your shelf match is from {result.owner_name || "a fellow reader"}</p>
                {result.publication_year && (
                  <p className="mt-1 font-handwritten text-base text-muted-foreground">
                    first published in {result.publication_year}
                  </p>
                )}
                <div className="journal-divider my-3" />
                <div className="space-y-3">
                  {[result.hook1, result.hook2, result.hook3].map((hook) => (
                    <p key={hook} className="flex gap-2 font-body text-sm italic text-muted-foreground">
                      <span className="font-handwritten text-accent">✦</span>
                      {hook}
                    </p>
                  ))}
                </div>
                <p className="mt-4 font-handwritten text-sm text-muted-foreground">
                  shelf notes: {result.ingredients.join(" · ")}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => onMatch(result)}
                    className="rounded-sm bg-primary px-5 py-2.5 font-handwritten text-xl text-primary-foreground shadow-journal transition hover:-translate-y-0.5 hover:shadow-warm"
                  >
                    Choose This Shelf Match 💌
                  </button>
                  {rankedListings.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setResultOffset((current) => current + 1)}
                      className="flex items-center justify-center gap-2 rounded-sm border border-border bg-background px-4 py-2.5 font-handwritten text-lg text-foreground transition hover:bg-secondary"
                    >
                      <RefreshCw className="h-4 w-4" /> Another match
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-sm border border-dashed border-border bg-background/60 p-8 text-center">
              <p className="font-handwritten text-2xl text-foreground">The shelf needs a fresh restock.</p>
              <p className="mt-2 text-sm italic text-muted-foreground">There are no available community books to match right now.</p>
            </div>
          )}

          <button
            type="button"
            onClick={goBack}
            className="mt-7 inline-flex items-center gap-2 font-handwritten text-lg text-muted-foreground transition hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> {step === 0 && !showResult ? "Back to the shelf" : "Back"}
          </button>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default CommunityMatchFinder;
