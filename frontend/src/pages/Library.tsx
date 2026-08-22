import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import WrappedBookSVG from "../components/WrappedBookSVG";
import { toast } from "sonner";

interface Save {
  id: string;
  kind: "blind_date" | "shelf_match";
  book_id: string | null;
  title: string | null;
  author: string | null;
  emoji: string | null;
  cover_color: string | null;
  clue1: string | null;
  clue2: string | null;
  clue3: string | null;
  ingredients: string[];
  shelf_listing_id: string | null;
  owner_email: string | null;
  owner_name: string | null;
  hooks: string[];
  created_at: string;
}

// Mock data to populate the library for local testing
const MOCK_SAVES: Save[] = [
  {
    id: "1",
    kind: "blind_date",
    book_id: "book-1",
    title: "The Night Circus",
    author: "Erin Morgenstern",
    emoji: "🎪",
    cover_color: "bg-sage",
    clue1: "A magical competition between two illusionists.",
    clue2: "A circus that only arrives without warning.",
    clue3: "A love story written in the stars.",
    ingredients: ["earl grey", "vanilla"],
    shelf_listing_id: null,
    owner_email: null,
    owner_name: null,
    hooks: [],
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    kind: "shelf_match",
    book_id: null,
    title: null,
    author: null,
    emoji: "☕",
    cover_color: "bg-warm",
    clue1: null,
    clue2: null,
    clue3: null,
    ingredients: ["cinnamon", "honey"],
    shelf_listing_id: "shelf-1",
    owner_email: "fellowreader@example.com",
    owner_name: "Oliver",
    hooks: [
      "A cozy coffee shop in a rainy city.",
      "A grumpy barista with a heart of gold.",
      "A sunny regular who won't stop talking.",
    ],
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

const tilts = ["-rotate-1", "rotate-1", "-rotate-[0.5deg]", "rotate-[0.5deg]"];

const Library = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [saves, setSaves] = useState<Save[]>(MOCK_SAVES);
  const [tab, setTab] = useState<"all" | "blind_date" | "shelf_match">("all");

  useEffect(() => {
    if (!loading && !user) {
      // You can uncomment this if you want strict redirecting
      // navigate("/auth");
    }
  }, [user, loading, navigate]);

  const remove = (id: string) => {
    // Simulate removing from the backend by updating local state
    setSaves((s) => s.filter((x) => x.id !== id));
    toast.success("Removed from library");
  };

  if (loading) return null;

  const filtered = saves.filter((s) => tab === "all" || s.kind === tab);

  return (
    <div className="min-h-screen paper-texture px-4 py-10 relative">
      <div className="fixed left-3 top-0 bottom-0 flex flex-col justify-center gap-8 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full border-2 border-border bg-background"
          />
        ))}
      </div>
      <div className="fixed left-12 top-0 bottom-0 w-px bg-dusty-rose/20 pointer-events-none" />

      <header className="max-w-5xl mx-auto flex justify-between items-center mb-8">
        <Link
          to="/"
          className="font-handwritten text-lg text-muted-foreground hover:text-primary"
        >
          ← home
        </Link>
        <button
          onClick={signOut}
          className="font-handwritten text-base text-muted-foreground hover:text-primary"
        >
          sign out
        </button>
      </header>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 max-w-2xl mx-auto"
      >
        <p className="font-handwritten text-lg text-muted-foreground/60">
          ~ your collection ~
        </p>
        <h1 className="font-handwritten text-5xl md:text-6xl text-foreground">
          My Little Library
        </h1>
        <div className="journal-divider w-56 mx-auto my-3" />
        <p className="font-body italic text-muted-foreground">
          Your recommended reads and community exchanges, pressed between these pages.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto flex justify-center gap-2 mb-10 font-handwritten text-xl">
        {(["all", "blind_date", "shelf_match"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-sm border transition ${
              tab === t
                ? "bg-primary text-primary-foreground border-primary/30 shadow-journal"
                : "bg-card border-border hover:bg-secondary"
            }`}
          >
            {t === "all"
              ? "All ♡"
              : t === "blind_date"
                ? "Next Reads ✦"
                : "Shelf Exchanges 📚"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center mt-20">
          <p className="font-handwritten text-2xl text-muted-foreground/60 mb-3">
            No pressed flowers here yet…
          </p>
          <Link
            to="/"
            className="font-handwritten text-xl text-primary underline underline-offset-4"
          >
            find your next read →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <AnimatePresence>
            {filtered.map((s, i) => (
              <motion.div
                key={s.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.04 }}
                className={`relative bg-card rounded-sm shadow-journal border border-border p-5 dog-ear ${tilts[i % tilts.length]}`}
              >
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-5 rounded-sm bg-washi-pink/40" />

                <div className="flex justify-center mb-3 mt-1">
                  <div className="scale-75 origin-top">
                    <WrappedBookSVG
                      color={s.cover_color || "bg-primary"}
                      emoji={s.emoji || "📖"}
                      className="w-28 h-40 drop-shadow"
                    />
                  </div>
                </div>

                {s.kind === "blind_date" ? (
                  <>
                    <h3 className="font-handwritten text-xl text-center text-foreground leading-tight">
                      {s.title}
                    </h3>
                    <p className="text-xs italic text-center text-muted-foreground mb-2">
                      by {s.author}
                    </p>
                  </>
                ) : (
                  <p className="text-center font-handwritten text-base text-muted-foreground mb-2">
                    from {s.owner_name || "a reader"}
                  </p>
                )}

                <div className="journal-divider mb-2" />

                <div className="space-y-1.5">
                  {(s.kind === "blind_date"
                    ? [s.clue1, s.clue2, s.clue3]
                    : s.hooks
                  )
                    .filter(Boolean)
                    .map((line, li) => (
                      <p
                        key={li}
                        className="text-xs font-body italic text-muted-foreground flex gap-2"
                      >
                        <span className="text-accent font-handwritten">✦</span>{" "}
                        {line}
                      </p>
                    ))}
                </div>

                {s.ingredients.length > 0 && (
                  <p className="text-[10px] font-handwritten text-muted-foreground/70 mt-2">
                    tea: {s.ingredients.join(" · ")}
                  </p>
                )}

                {s.kind === "shelf_match" && s.owner_email && (
                  <p className="text-xs font-handwritten text-primary break-all mt-2 text-center">
                    💌 {s.owner_email}
                  </p>
                )}

                <div className="flex justify-between items-center mt-3 pt-2 border-t border-border/50">
                  <span className="text-[10px] font-handwritten text-muted-foreground/60 uppercase tracking-wider">
                    {s.kind === "blind_date" ? "next read" : "shelf exchange"}
                  </span>
                  <button
                    onClick={() => remove(s.id)}
                    className="text-xs font-handwritten text-destructive/70 hover:text-destructive"
                  >
                    remove
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Library;
